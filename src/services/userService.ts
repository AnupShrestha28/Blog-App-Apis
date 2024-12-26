import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { validateUUID } from "../utils/validationUtils";

dotenv.config();

const prisma = new PrismaClient();

export const register = async (
  username: string,
  email: string,
  password: string
) => {
  try {
    if (!username || !email || !password) {
      return {
        status: "error",
        statusCode: 400,
        error: {
          code: "VALIDATION_ERROR",
          message: "All fields (username, email, password) are required.",
        },
      };
    }

    if (password.length < 6 || password.length > 10) {
      return {
        status: "error",
        statusCode: 400,
        error: {
          code: "VALIDATION_ERROR",
          message: "Password must be between 6 and 10 characters.",
        },
      };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        status: "error",
        statusCode: 400,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid email format.",
        },
      };
    }

    const userWithSameUsername = await prisma.user.findUnique({
      where: { username },
    });

    if (userWithSameUsername) {
      return {
        status: "error",
        statusCode: 409,
        error: {
          code: "CONFLICT",
          message: "Username already exists.",
        },
      };
    }

    const userWithSameEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (userWithSameEmail) {
      return {
        status: "error",
        statusCode: 409,
        error: {
          code: "CONFLICT",
          message: "Email already exists.",
        },
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: "USER",
      },
    });

    return {
      status: "success",
      statusCode: 201,
      data: { user },
      message: "User registered successfully.",
    };
  } catch (error) {
    return {
      status: "error",
      statusCode: 500,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: error instanceof Error ? error.message : "Error creating user",
      },
    };
  }
};

export const login = async (username: string, password: string) => {
  try {
    if (!username || !password) {
      return {
        status: "error",
        statusCode: 400,
        error: {
          code: "VALIDATION_ERROR",
          message: "Username and password are required.",
        },
      };
    }

    if (password.length < 6 || password.length > 10) {
      return {
        status: "error",
        statusCode: 400,
        error: {
          code: "VALIDATION_ERROR",
          message: "Password must be between 6 and 10 characters.",
        },
      };
    }

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return {
        status: "error",
        statusCode: 404,
        error: {
          code: "NOT_FOUND",
          message: "Username is incorrect.",
        },
      };
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return {
        status: "error",
        statusCode: 401,
        error: {
          code: "AUTHENTICATION_ERROR",
          message: "Password is incorrect.",
        },
      };
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    return {
      status: "success",
      statusCode: 200,
      data: { token },
      message: "Login successfully.",
    };
  } catch (error) {
    return {
      status: "error",
      statusCode: 500,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: error instanceof Error ? error.message : "Unknown error",
      },
    };
  }
};

export const getAllUsers = async () => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, username: true, email: true, role: true },
    });

    return {
      status: "success",
      statusCode: 200,
      data: { users },
      message: "Users retrieved successfully.",
    };
  } catch (error) {
    return {
      status: "error",
      statusCode: 500,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message:
          error instanceof Error ? error.message : "Error retrieving users.",
      },
    };
  }
};

export const getUserById = async (id: string) => {
  try {
    validateUUID(id);

    const user = await prisma.user.findUnique({
      where: { id },
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
      data: { user },
      message: "User retrieved successfully.",
    };
  } catch (error) {
    return {
      status: "error",
      statusCode: 500,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message:
          error instanceof Error ? error.message : "Error retrieving user.",
      },
    };
  }
};

export const deleteUser = async (userId: string) => {
  try {
    validateUUID(userId);

    const user = await prisma.user.findUnique({ where: { id: userId } });

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

    await prisma.user.delete({
      where: { id: userId },
    });

    return {
      status: "success",
      statusCode: 200,
      message: "User and related data deleted successfully.",
    };
  } catch (error) {
    return {
      status: "error",
      statusCode: 500,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message:
          error instanceof Error ? error.message : "Error deleting user.",
      },
    };
  }
};
