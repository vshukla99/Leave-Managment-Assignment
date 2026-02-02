import { Request, Response, NextFunction } from "express";
import {
  updateMyProfile,
  adminUpdateUser,
  deleteUserByAdmin,
  getAllUsers,
  getUserById,
} from "./user.service";
import { AppError } from "../../utils/app-error";

/**
 * USER: Update own profile
 */
export async function updateMe(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const updatedUser = await updateMyProfile(req.user!.id, req.body);

    res.status(200).json({
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * ADMIN: Update user
 */
export async function updateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = Number(req.params.userId);
    if (Number.isNaN(userId)) {
      throw new AppError("Invalid user id", 400);
    }

    const user = await adminUpdateUser(userId, req.body);

    res.status(200).json({
      message: "User updated successfully",
      data: user,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * ADMIN: Delete user
 */
export async function deleteUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = Number(req.params.userId);
    if (Number.isNaN(userId)) {
      throw new AppError("Invalid user id", 400);
    }

    await deleteUserByAdmin(req.user!.id, userId);

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (err) {
    next(err);
  }
}

/**
 * ADMIN: Get all users
 */
export async function getUsers(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const users = await getAllUsers();

    res.status(200).json({
      data: users,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * ADMIN: Get user by ID
 */
export async function getUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = Number(req.params.userId);
    if (Number.isNaN(userId)) {
      throw new AppError("Invalid user id", 400);
    }

    const user = await getUserById(userId);

    res.status(200).json({
      data: user,
    });
  } catch (err) {
    next(err);
  }
}
