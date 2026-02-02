import { Request, Response, NextFunction } from "express";
import { createUser, authenticateUser } from "./auth.service";
import { CreateUserInput, LoginInput } from "../auth/types/auth.types";

export async function register(
  req: Request<{}, {}, CreateUserInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const user = await createUser(req.body);

    res.status(201).json({
      message: "User registered successfully",
      userId: user.id,
      role: user.role,
    });
  } catch (error) {
    next(error);
  }
}

export async function login(
  req: Request<{}, {}, LoginInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await authenticateUser(req.body);

    res.status(200).json({
      message: "Login successful",
      ...result,
    });
  } catch (error) {
    next(error);
  }
}

export function logout(req: Request, res: Response) {
  res.json({ message: "Logout successful" });
}
