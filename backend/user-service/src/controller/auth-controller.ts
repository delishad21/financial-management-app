import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import {
  findUserByEmail as _findUserByEmail,
  findUserByUsername as _findUserByUsername,
  confirmUserById as _confirmUserById,
} from "../model/repository.js";
import { formatUserResponse } from "./user-controller.js";
import { makePasswordResetEmail, transporter } from "../utils/mail.js";
import { CustomRequest } from "../middleware/basic-access-control.js";

const isEmail = (input: string): boolean =>
  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(input);

const generateEmailToken = (
  userId: string,
  verificationCode: number,
  expiresInSeconds: number
): string => {
  return jwt.sign(
    { id: userId, code: verificationCode },
    process.env.JWT_SECRET!,
    { expiresIn: expiresInSeconds }
  );
};

const sendPasswordResetLink = async (
  email: string,
  username: string,
  resetLink: string
): Promise<void> => {
  await transporter.sendMail(
    makePasswordResetEmail(email, username, resetLink)
  );
};

export async function handleLogin(req: CustomRequest, res: Response) {
  const { identifier, password } = req.body;
  console.log(`[AUTH] Login attempt for user: ${identifier}`);

  if (!identifier || !password) {
    console.log(`[AUTH] Login failed: Missing credentials for ${identifier}`);
    res.status(400).json({ message: "Missing identifier and/or password" });
    return;
  }

  try {
    const user = isEmail(identifier)
      ? await _findUserByEmail(identifier)
      : await _findUserByUsername(identifier);

    if (!user) {
      console.log(`[AUTH] Login failed: User not found - ${identifier}`);
      res.status(401).json({ message: "Wrong username/email and/or password" });
      return;
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      console.log(
        `[AUTH] Login failed: Invalid password for user ${identifier}`
      );
      res.status(401).json({ message: "Wrong username/email and/or password" });
      return;
    }

    if (!user.isVerified) {
      console.log(`[AUTH] Login failed: Unverified account - ${identifier}`);
      res.status(403).json({ message: "You have not verified your account" });
      return;
    }

    console.log(`[AUTH] Login successful: ${user.username} (${user.id})`);
    // Generate JWT access token
    const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });

    res.status(200).json({
      message: "User logged in",
      data: {
        accessToken,
        ...formatUserResponse(user),
      },
    });
    return;
  } catch (err: any) {
    console.error(`[AUTH] Login error: ${err.message}`, err);
    res.status(500).json({ message: "Unknown error occurred during login" });
    return;
  }
}

export async function handleForgetPassword(req: CustomRequest, res: Response) {
  const { identifier } = req.body;
  console.log(`[AUTH] Forget password attempt for user: ${identifier}`);

  if (!identifier) {
    console.log(
      `[AUTH] Forget password failed: Missing credentials for ${identifier}`
    );
    res.status(400).json({ message: "Missing identifier" });
    return;
  }

  try {
    const user = isEmail(identifier)
      ? await _findUserByEmail(identifier)
      : await _findUserByUsername(identifier);

    if (!user) {
      console.log(
        `[AUTH] Forget password failed: User not found - ${identifier}`
      );
      res.status(401).json({ message: "Unidentified user" });
      return;
    }

    if (!user.isVerified) {
      console.log(
        `[AUTH] Forget password failed: Unverified account - ${identifier}`
      );
      res.status(403).json({ message: "You have not verified your account" });
      return;
    }

    console.log(
      `[AUTH] Forget password request successful: ${user.username} (${user.id})`
    );

    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    const expirationDate = new Date(Date.now() + 3 * 60 * 1000);
    const expiresInSeconds = Math.floor(
      (expirationDate.getTime() - Date.now()) / 1000
    );

    const jwt = generateEmailToken(user.id, verificationCode, expiresInSeconds);

    const resetLink = `${process.env.FRONTEND_URL}/sign-in/forgot-password/reset?token=${jwt}`;
    await sendPasswordResetLink(user.email, user.username, resetLink);
    console.log(`[AUTH] Reset link email sent - Username: ${user.username}`);

    res.status(200).json({
      message: "Forget password request success",
      data: {
        token: jwt,
      },
    });
    return;
  } catch (err: any) {
    console.error(`[AUTH] Forget password error: ${err.message}`, err);
    res.status(500).json({
      message: "Unknown error occurred during forget password procedure",
    });
    return;
  }
}

export async function handleVerifyToken(req: CustomRequest, res: Response) {
  try {
    const verifiedUser = req.user;
    res.status(200).json({ message: "Token verified", data: verifiedUser });
    return;
  } catch (err: any) {
    res.status(500).json({ message: err.message });
    return;
  }
}

export async function verifyPassword(req: CustomRequest, res: Response) {
  try {
    const { username } = req.user;

    console.log(`[AUTH] Password verification attempt for user: ${username}`);

    const user = await _findUserByUsername(username);

    if (!user) {
      console.log(
        `[AUTH] Password verification failed: User not found - ${username}`
      );
      res.status(401).json({ message: "User not found" });
      return;
    }

    const match = await bcrypt.compare(req.body.password, user.password);

    if (!match) {
      console.log(`[AUTH] Password verification failed for user: ${username}`);
      res.status(401).json({ message: "Wrong password" });
      return;
    }

    console.log(`[AUTH] Password verified successfully for user: ${username}`);
    res.status(200).json({ message: "Password verified!" });
    return;
  } catch (err: any) {
    console.error(`[AUTH] Password verification error: ${err.message}`, err);
    res.status(500).json({ message: err.message });
    return;
  }
}

export async function confirmUser(req: CustomRequest, res: Response) {
  if (!req.verified) {
    res.status(400).json({ message: "Code is not verified" });
    return;
  }

  try {
    const { id, username } = req.user;
    console.log(
      `[AUTH] Account confirmation attempt for user: ${username} (${id})`
    );

    const updatedUser = await _confirmUserById(id, true);

    if (!updatedUser) {
      console.log(
        `[AUTH] Account confirmation failed: User not found - ${username} (${id})`
      );
      res.status(401).json({ message: "User not found" });
      return;
    }

    console.log(
      `[AUTH] Account confirmed successfully for user: ${username} (${id})`
    );

    // Generate JWT access token
    const accessToken = jwt.sign(
      { id: updatedUser.id },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: `${updatedUser.id} registered and logged in!`,
      data: {
        accessToken,
        ...formatUserResponse(updatedUser),
      },
    });
    return;
  } catch (err: any) {
    console.error(`[AUTH] Account confirmation error: ${err.message}`, err);
    res.status(500).json({ message: err.message });
    return;
  }
}
