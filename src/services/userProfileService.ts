import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

export const getUserDetails = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true, email: true, role: true },
    });

    if (!user) {
      throw new Error("User not found.");
    }

    return user;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Error fetching user details."
    );
  }
};

export const updateUserDetails = async (
  userId: string,
  username?: string,
  email?: string,
  oldPassword?: string,
  newPassword?: string
) => {
  try {
    const data: { username?: string; email?: string; password?: string } = {};

    if (username) {
      const userWithSameUsername = await prisma.user.findUnique({
        where: { username },
      });
      if (userWithSameUsername && userWithSameUsername.id !== userId) {
        throw new Error("Username already exists.");
      }
      data.username = username;
    }

    if (email) {
      const userWithSameEmail = await prisma.user.findUnique({
        where: { email },
      });
      if (userWithSameEmail && userWithSameEmail.id !== userId) {
        throw new Error("Email already exists.");
      }
      data.email = email;
    }

    if (newPassword) {
      if (!oldPassword) {
        throw new Error("Old password is required to update the password.");
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new Error("User not found.");
      }

      const isOldPasswordValid = await bcrypt.compare(
        oldPassword,
        user.password
      );
      if (!isOldPasswordValid) {
        throw new Error("Old password is incorrect.");
      }

      if (newPassword.length < 6 || newPassword.length > 10) {
        throw new Error("New password must be between 6 and 10 characters.");
      }

      data.password = await bcrypt.hash(newPassword, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data,
    });

    return {
      message: "Profile updated successfully.",
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
      },
    };
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Error updating user details."
    );
  }
};
