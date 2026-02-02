import { prisma } from "../../prisma";
import { AppError } from "../../utils/app-error";
import { hashPassword, comparePassword } from "../../utils/password";
import { signToken } from "../../utils/jwt";
import { CreateUserInput, LoginInput } from "../auth/types/auth.types";
import { Role } from "@prisma/client";

export async function createUser(data: CreateUserInput) {
    const { fullName, mobile, email, password } = data;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new AppError("Email already exists", 400);
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      fullName,
      mobile,
      email,
      password: hashedPassword,
      role: Role.USER, 
    },
  });

  return user;
}

export async function authenticateUser(data: LoginInput) {
  const { email, password } = data;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError("Invalid email or password", 400);
  }

  const isValid = await comparePassword(password, user.password);
  if (!isValid) {
    throw new AppError("Invalid email or password", 400);
  }

  const token = signToken({
    id: user.id,
    role: user.role,
  });

  return {
    token,
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    },
  };
}
