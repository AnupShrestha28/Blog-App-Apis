import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
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
      return {
        status: "error",
        statusCode: 404,
        error: {
          code: "NOT_FOUND",
          message: "User not found.",
        },
      };
    }

    return {
      status: "success",
      statusCode: 200,
      data: user,
      message: "User details fetched successfully.",
    };
  } catch (error) {
    return {
      status: "error",
      statusCode: 500,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message:
          error instanceof Error
            ? error.message
            : "Error fetching user details.",
      },
    };
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
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!existingUser) {
      return {
        status: "error",
        statusCode: 404,
        error: {
          code: "NOT_FOUND",
          message: "User not found.",
        },
      };
    }

    const data: { username?: string; email?: string; password?: string } = {};

    if (username) {
      const userWithSameUsername = await prisma.user.findUnique({
        where: { username },
      });
      if (userWithSameUsername && userWithSameUsername.id !== userId) {
        return {
          status: "error",
          statusCode: 409,
          error: {
            code: "CONFLICT",
            message: "Username already exists.",
          },
        };
      }
      data.username = username;
    }

    if (email) {
      const userWithSameEmail = await prisma.user.findUnique({
        where: { email },
      });
      if (userWithSameEmail && userWithSameEmail.id !== userId) {
        return {
          status: "error",
          statusCode: 409,
          error: {
            code: "CONFLICT",
            message: "Email already exists.",
          },
        };
      }
      data.email = email;
    }

    if (newPassword) {
      if (!oldPassword) {
        return {
          status: "error",
          statusCode: 400,
          error: {
            code: "VALIDATION_ERROR",
            message: "Old password is required to update the password.",
          },
        };
      }

      const isOldPasswordValid = await bcrypt.compare(
        oldPassword,
        existingUser.password
      );
      if (!isOldPasswordValid) {
        return {
          status: "error",
          statusCode: 401,
          error: {
            code: "AUTHENTICATION_ERROR",
            message: "Old password is incorrect.",
          },
        };
      }

      if (newPassword.length < 6 || newPassword.length > 10) {
        return {
          status: "error",
          statusCode: 400,
          error: {
            code: "VALIDATION_ERROR",
            message: "New password must be between 6 and 10 characters.",
          },
        };
      }

      data.password = await bcrypt.hash(newPassword, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data,
    });

    return {
      status: "success",
      statusCode: 200,
      data: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
      },
      message: "Profile updated successfully.",
    };
  } catch (error) {
    return {
      status: "error",
      statusCode: 500,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message:
          error instanceof Error
            ? error.message
            : "Error updating user details.",
      },
    };
  }
};
