import { prisma } from "../../prisma";
import { AppError } from "../../utils/app-error";
import {
  UpdateMyProfileInput,
  AdminUpdateUserInput,
} from "./user.types";

/**
 * ================================
 * USER: Update own profile
 * ================================
 */
export async function updateMyProfile(
  userId: number,
  data: UpdateMyProfileInput
) {
  return prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      fullName: true,
      mobile: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
}

/**
 * ================================
 * ADMIN: Update user
 * ================================
 */
export async function adminUpdateUser(
  userId: number,
  data: AdminUpdateUserInput
) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      fullName: true,
      mobile: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
}

/**
 * ================================
 * ADMIN: Delete user
 * ================================
 */
export async function deleteUserByAdmin(
  adminId: number,
  userId: number
) {
  if (adminId === userId) {
    throw new AppError("Admin cannot delete self", 400);
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  await prisma.$transaction([
    prisma.leaveRequest.deleteMany({
      where: { userId },
    }),
    prisma.leaveCredit.deleteMany({
      where: { userId },
    }),
    prisma.user.delete({
      where: { id: userId },
    }),
  ]);
}

/**
 * ================================
 * ADMIN: Get all users
 * ================================
 */
export async function getAllUsers() {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      fullName: true,
      email: true,
      mobile: true,
      role: true,
      createdAt: true,
    },
  });
}

/**
 * ================================
 * ADMIN: Get user by ID
 * ================================
 */
export async function getUserById(userId: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      fullName: true,
      email: true,
      mobile: true,
      role: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
}
