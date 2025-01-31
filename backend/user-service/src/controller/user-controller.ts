import bcrypt from "bcrypt";
import { isValidObjectId } from "mongoose";
import {
  createTempUser as _createTempUser,
  deleteUserById as _deleteUserById,
  findAllUsers as _findAllUsers,
  findUserByEmail as _findUserByEmail,
  findUserById as _findUserById,
  findUserByUsername as _findUserByUsername,
  findUserByUsernameOrEmail as _findUserByUsernameOrEmail,
  updateUserById as _updateUserById,
  confirmUserById as _confirmUserById,
  updateUserPrivilegeById as _updateUserPrivilegeById,
  updateUserAccountCreationTime as _updateUserAccountCreationTime,
} from "../model/repository";
import jwt from "jsonwebtoken";
import {
  makeVerificationEmail,
  makeVerificationEmailForEmailChange,
  transporter,
} from "../utils/mail";
import { Request, Response } from "express";
import { CustomRequest } from "../middleware/basic-access-control";

// Helper functions
const isValidEmail = (email: string) =>
  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);

const isValidUsername = (username: string) =>
  /^[a-zA-Z0-9_-]{2,32}$/.test(username);

const isValidPassword = (password: string) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!#%*?&])[A-Za-z\d@$#!%*?&]{12,}$/.test(
    password
  );

const validateUserData = ({ username, email, password }: any) => {
  if (!username || !email || !password) {
    return "Username, email, and password are required.";
  }
  if (!isValidUsername(username)) {
    return "Username must be 2-32 characters and can contain a-z, A-Z, 0-9, _ or -.";
  }
  if (!isValidEmail(email)) {
    return "Invalid email format.";
  }
  if (!isValidPassword(password)) {
    return "Password must be at least 8 characters long.";
  }
  return null;
};

const generateEmailToken = (
  userId: string,
  createdAt: Date,
  verificationCode: number,
  expiresInSeconds: number
) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT secret is not provided");
  }
  return jwt.sign(
    { id: userId, createdAt: createdAt, code: verificationCode },
    process.env.JWT_SECRET,
    { expiresIn: expiresInSeconds }
  );
};

const sendVerificationEmail = async (
  email: string,
  username: string,
  verificationCode: number
) => {
  return transporter.sendMail(
    makeVerificationEmail(email, username, verificationCode)
  );
};

const sendVerificationEmailForEmailChange = async (
  email: string,
  username: string,
  verificationCode: number
) => {
  return transporter.sendMail(
    makeVerificationEmailForEmailChange(email, username, verificationCode)
  );
};

export async function createUserRequest(req: CustomRequest, res: Response) {
  const { username, email, password } = req.body;
  console.log(
    `[USER] New user registration attempt - Username: ${username}, Email: ${email}`
  );

  try {
    const error = validateUserData(req.body);
    if (error) {
      console.log(`[USER] Registration validation failed - ${error}`);
      res.status(400).json({ message: error });
      return;
    }

    const existingUser = await _findUserByUsernameOrEmail(username, email);
    if (existingUser) {
      if (!existingUser.isVerified) {
        console.log(`[USER] Unverified account found - Username: ${username}`);
        const match = await bcrypt.compare(password, existingUser.password);
        if (match) {
          req.user = existingUser;
          return refreshEmailToken(req, res);
        }
        console.log(
          `[USER] Password mismatch for unverified account - Username: ${username}`
        );
        res.status(409).json({
          message:
            "An unverified account has been linked to your username/email",
        });
        return;
      }
      console.log(
        `[USER] Registration failed - Username/Email already exists - Username: ${username}`
      );
      res.status(409).json({ message: "Username or email already exists." });
      return;
    }

    const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    const expirationDate = new Date(Date.now() + 3 * 60 * 1000);
    const expiresInSeconds = Math.floor(
      (expirationDate.getTime() - Date.now()) / 1000
    );

    const createdUser = await _createTempUser(
      username,
      email,
      hashedPassword,
      false,
      expirationDate
    );
    console.log(
      `[USER] Temporary user created successfully - ID: ${createdUser.id}, Username: ${username}`
    );

    const emailToken = generateEmailToken(
      createdUser.id,
      createdUser.createdAt,
      verificationCode,
      expiresInSeconds
    );

    await sendVerificationEmail(email, username, verificationCode);
    console.log(`[USER] Verification email sent - Username: ${username}`);

    res.status(201).json({
      message: `Created new user ${username} request successfully`,
      data: { token: emailToken, expiry: expirationDate },
    });
    return;
  } catch (error: any) {
    console.error(`[USER] Registration error - ${error.message}`, error);
    res
      .status(500)
      .json({ message: "Unknown error occurred when creating a new user!" });
    return;
  }
}

export async function updateEmailRequest(req: CustomRequest, res: Response) {
  try {
    const verifiedUser = req.user;
    const email = req.body.email;

    const valid = isValidEmail(email);
    if (!valid) {
      res.status(400).json({ message: "email is not valid" });
      return;
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    const expirationDate = new Date(Date.now() + 3 * 60 * 1000);
    const expiresInSeconds = Math.floor(
      (expirationDate.getTime() - Date.now()) / 1000
    );

    const emailToken = generateEmailToken(
      verifiedUser.id,
      verifiedUser.createdAt,
      verificationCode,
      expiresInSeconds
    );

    await sendVerificationEmailForEmailChange(
      email,
      verifiedUser.username,
      verificationCode
    );

    res.status(201).json({
      message: `Created email update request`,
      data: { token: emailToken, expiry: expirationDate },
    });
    return;
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Unknown error occurred when creating a new user!" });
    return;
  }
}

export async function deleteUserRequest(req: CustomRequest, res: Response) {
  try {
    const email = req.params.email;
    if (!isValidEmail(email)) {
      res.status(404).json({ message: `${email} is not a valid email` });
      return;
    }
    const user = await _findUserByEmail(email);
    if (!user) {
      res.status(404).json({ message: `User with email: ${email} not found` });
      return;
    } else if (user.isVerified) {
      res.status(403).json({ message: `This operation is illegal` });
      return;
    }
    await _deleteUserById(user.id);
    res.status(200).json({
      message: `Deleted user account creation request of email: ${email} successfully`,
    });
    return;
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Unknown error when deleting user!" });
    return;
  }
}

export async function refreshEmailToken(req: CustomRequest, res: Response) {
  try {
    const verifiedUser = req.user;

    const now = new Date();
    const expirationDate = new Date(Date.now() + 3 * 60 * 1000);
    const expiresInSeconds = Math.floor(
      (expirationDate.getTime() - Date.now()) / 1000
    );

    await _updateUserAccountCreationTime(verifiedUser.id, now, expirationDate);

    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    const emailToken = generateEmailToken(
      verifiedUser.id,
      now,
      verificationCode,
      expiresInSeconds
    );

    await sendVerificationEmail(
      verifiedUser.email,
      verifiedUser.username,
      verificationCode
    );

    res.status(201).json({
      message: `Token refreshed successfully`,
      data: { token: emailToken, expiry: expirationDate },
    });
    return;
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Unknown error occurred when refreshing token" });
    return;
  }
}

export async function getUser(req: CustomRequest, res: Response) {
  try {
    const userId = req.params.id;
    if (!isValidObjectId(userId)) {
      res.status(404).json({ message: `User ${userId} not found` });
      return;
    }

    const user = await _findUserById(userId);
    if (!user) {
      res.status(404).json({ message: `User ${userId} not found` });
      return;
    } else {
      res
        .status(200)
        .json({ message: `Found user`, data: formatUserResponse(user) });
      return;
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Unknown error when getting user!" });
    return;
  }
}

export async function getAllUsers(req: CustomRequest, res: Response) {
  try {
    const users = await _findAllUsers();

    res
      .status(200)
      .json({ message: `Found users`, data: users.map(formatUserResponse) });
    return;
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Unknown error when getting all users!" });
    return;
  }
}

export async function updateUser(req: CustomRequest, res: Response) {
  const userId = req.params.id;
  const { username, email, password } = req.body;
  console.log(
    `[USER] Update request - ID: ${userId}, New Username: ${username}, New Email: ${email}`
  );

  try {
    if (!username && !email && !password) {
      console.log(`[USER] Update failed - No fields to update - ID: ${userId}`);
      res.status(400).json({ message: "No field to update" });
      return;
    }

    if (!isValidObjectId(userId)) {
      console.log(`[USER] Update failed - Invalid user ID: ${userId}`);
      res.status(404).json({ message: `User ${userId} not found` });
      return;
    }

    const user = await _findUserById(userId);
    if (!user) {
      console.log(`[USER] Update failed - User not found - ID: ${userId}`);
      res.status(404).json({ message: `User ${userId} not found` });
      return;
    }

    // Check for username/email conflicts
    if (username || email) {
      let existingUser = username ? await _findUserByUsername(username) : null;
      if (existingUser && existingUser.id !== userId) {
        console.log(
          `[USER] Update failed - Username already exists - Username: ${username}`
        );
        res.status(409).json({ message: "Username already exists" });
        return;
      }

      existingUser = email ? await _findUserByEmail(email) : null;
      if (existingUser && existingUser.id !== userId) {
        console.log(
          `[USER] Update failed - Email already exists - Email: ${email}`
        );
        res.status(409).json({ message: "Email already exists" });
        return;
      }
    }

    let hashedPassword: string = "";
    if (password) {
      if (!isValidPassword(password)) {
        console.log(
          `[USER] Update failed - Password does not meet requirements`
        );
        res
          .status(400)
          .json({ message: "Password does not meet requirements" });
        return;
      }
      if (req.field === "password") {
        const salt = bcrypt.genSaltSync(10);
        hashedPassword = bcrypt.hashSync(password, salt);
      } else {
        console.log(
          `[USER] Update failed - Unauthorized password update - ID: ${userId}`
        );
        res.status(403).json({ message: "Unauthorized password update" });
        return;
      }
    }

    if (username && req.field !== "username") {
      console.log(
        `[USER] Update failed - Unauthorized username update - ID: ${userId}`
      );
      res.status(403).json({ message: "Unauthorized username update" });
      return;
    }

    if (email && req.field !== "email") {
      console.log(
        `[USER] Update failed - Unauthorized email update - ID: ${userId}`
      );
      res.status(403).json({ message: "Unauthorized email update" });
      return;
    }

    const updatedUser = await _updateUserById(
      userId,
      username,
      email,
      hashedPassword
    );
    console.log(`[USER] User updated successfully - ID: ${userId}`);
    res.status(200).json({
      message: `Updated data for user ${userId}`,
      data: formatUserResponse(updatedUser),
    });
    return;
  } catch (err: any) {
    console.error(`[USER] Update error - ${err.message}`, err);
    res.status(500).json({ message: "Unknown error when updating user!" });
    return;
  }
}

export async function updateUserPrivilege(req: CustomRequest, res: Response) {
  try {
    const { isAdmin } = req.body;

    if (isAdmin !== undefined) {
      // isAdmin can have boolean value true or false
      const userId = req.params.id;
      if (!isValidObjectId(userId)) {
        res.status(404).json({ message: `User ${userId} not found` });
        return;
      }
      const user = await _findUserById(userId);
      if (!user) {
        res.status(404).json({ message: `User ${userId} not found` });
        return;
      }

      const updatedUser = await _updateUserPrivilegeById(
        userId,
        isAdmin === true
      );
      res.status(200).json({
        message: `Updated privilege for user ${userId}`,
        data: formatUserResponse(updatedUser),
      });
      return;
    } else {
      res.status(400).json({ message: "isAdmin is missing!" });
      return;
    }
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Unknown error when updating user privilege!" });
    return;
  }
}

export async function deleteUser(req: CustomRequest, res: Response) {
  const userId = req.params.id;
  console.log(`[USER] Delete request - ID: ${userId}`);

  try {
    if (!isValidObjectId(userId)) {
      console.log(`[USER] Delete failed - Invalid user ID: ${userId}`);
      res.status(404).json({ message: `User ${userId} not found` });
      return;
    }

    const user = await _findUserById(userId);
    if (!user) {
      console.log(`[USER] Delete failed - User not found - ID: ${userId}`);
      res.status(404).json({ message: `User ${userId} not found` });
      return;
    }

    if (req.field !== "delete") {
      console.log(`[USER] Delete failed - Unauthorized delete - ID: ${userId}`);
      res.status(403).json({ message: "Unauthorized delete" });
      return;
    }

    await _deleteUserById(userId);
    console.log(`[USER] User deleted successfully - ID: ${userId}`);
    res.status(200).json({ message: `Deleted user ${userId} successfully` });
    return;
  } catch (err: any) {
    console.error(`[USER] Delete error - ${err.message}`, err);
    res.status(500).json({ message: "Unknown error when deleting user!" });
    return;
  }
}

export function formatUserResponse(user: any) {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    isAdmin: user.isAdmin,
    isVerified: user.isVerified,
    createdAt: user.createdAt,
  };
}
