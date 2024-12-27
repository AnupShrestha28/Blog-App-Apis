import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const getUserDetails = async (userId: string | undefined) => {
  if (!userId) {
    return {
      status: "error",
      statusCode: 401,
      error: {
        code: "AUTHENTICATION_REQUIRED",
        message: "Authentication required.",
      },
    };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true, email: true, role: true },
    });

    if (!user) {
      return {
        status: "error",
        statusCode: 404,
        error: { code: "NOT_FOUND", message: "User not found." },
      };
    }

    return {
      status: "success",
      statusCode: 200,
      data: user,
      message: "User details fetched successfully.",
    };
  } catch (error) {
    console.error("Error fetching user profile:", error);

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
  userId: string | undefined,
  data: {
    username?: string;
    email?: string;
    oldPassword?: string;
    newPassword?: string;
  }
) => {
  if (!userId) {
    return {
      status: "error",
      statusCode: 401,
      error: {
        code: "AUTHENTICATION_REQUIRED",
        message: "Authentication required.",
      },
    };
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return {
        status: "error",
        statusCode: 404,
        error: { code: "NOT_FOUND", message: "User not found." },
      };
    }

    const updates: { username?: string; email?: string; password?: string } =
      {};

    if (data.username) {
      const existingUsername = await prisma.user.findUnique({
        where: { username: data.username },
      });
      if (existingUsername && existingUsername.id !== userId) {
        return {
          status: "error",
          statusCode: 409,
          error: { code: "CONFLICT", message: "Username already exists." },
        };
      }
      updates.username = data.username;
    }

    if (data.email) {
      const existingEmail = await prisma.user.findUnique({
        where: { email: data.email },
      });
      if (existingEmail && existingEmail.id !== userId) {
        return {
          status: "error",
          statusCode: 409,
          error: { code: "CONFLICT", message: "Email already exists." },
        };
      }
      updates.email = data.email;
    }

    if (data.newPassword) {
      if (!data.oldPassword) {
        return {
          status: "error",
          statusCode: 400,
          error: {
            code: "VALIDATION_ERROR",
            message: "Old password is required to update password.",
          },
        };
      }

      const isPasswordValid = await bcrypt.compare(
        data.oldPassword,
        user.password
      );
      if (!isPasswordValid) {
        return {
          status: "error",
          statusCode: 401,
          error: {
            code: "AUTHENTICATION_ERROR",
            message: "Old password is incorrect.",
          },
        };
      }

      updates.password = await bcrypt.hash(data.newPassword, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updates,
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
            : "Error updating user profile.",
      },
    };
  }
};
