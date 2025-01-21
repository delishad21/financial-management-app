import UserModel from "./user-model.js";
import "dotenv/config";
import { connect } from "mongoose";

export async function connectToDB() {
  let mongoDBUri = process.env.USER_MONGODB_URI;

  if (!mongoDBUri) {
    throw new Error("MongoDB URI is not provided");
  }

  await connect(mongoDBUri);
}

export async function createTempUser(
  username: string,
  email: string,
  password: string,
  isVerified = false,
  expireAt: Date
) {
  return new UserModel({
    username,
    email,
    password,
    isVerified,
    expireAt,
  }).save();
}

export async function findUserByEmail(email: string) {
  return UserModel.findOne({ email });
}

export async function findUserById(userId: string) {
  return UserModel.findById(userId);
}

export async function findUserByUsername(username: string) {
  return UserModel.findOne({ username });
}

export async function findUserByUsernameOrEmail(
  username: string,
  email: string
) {
  return UserModel.findOne({
    $or: [{ username }, { email }],
  });
}

export async function findAllUsers() {
  return UserModel.find();
}

export async function updateUserById(
  userId: string,
  username: string,
  email: string,
  password: string
) {
  return UserModel.findByIdAndUpdate(
    userId,
    {
      $set: {
        username,
        email,
        password,
      },
    },
    { new: true } // return the updated user
  );
}

export async function updateUserAccountCreationTime(
  userId: string,
  createdAt: Date,
  expireAt: Date
) {
  return UserModel.findByIdAndUpdate(
    userId,
    {
      $set: {
        createdAt,
        expireAt,
      },
    },
    { new: true } // return the updated user
  );
}

export async function confirmUserById(userId: string, isVerified: boolean) {
  return UserModel.findByIdAndUpdate(
    userId,
    {
      $set: {
        isVerified,
      },
      $unset: {
        expireAt: "",
      },
    },
    { new: true } // return the updated user
  );
}

export async function updateUserPrivilegeById(
  userId: string,
  isAdmin: boolean
) {
  return UserModel.findByIdAndUpdate(
    userId,
    {
      $set: {
        isAdmin,
      },
    },
    { new: true } // return the updated user
  );
}

export async function deleteUserById(userId: string) {
  return UserModel.findByIdAndDelete(userId);
}
