import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

/**
 * Extend Express Request type
 */
declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: number;
      role: "USER" | "ADMIN";
    };
  }
}

/**
 * Authentication & Authorization Middleware
 *
 * @param requiredRoles Allowed roles for the route (optional)
 * @example auth() // any authenticated user
 * @example auth("ADMIN") // admin only
 * @example auth("USER", "ADMIN") // user or admin
 */
export function auth(...requiredRoles: Array<"USER" | "ADMIN">) {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    // Check Authorization header
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      // Extract token
      const token = authHeader.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as JwtPayload;

      const userId = Number(decoded.id);
      const role = decoded.role as "USER" | "ADMIN";

      // Validate token payload
      if (!userId || !role) {
        return res.status(401).json({ message: "Invalid token" });
      }

      // Attach user to request
      req.user = {
        id: userId,
        role,
      };

      // Role-based authorization (if roles provided)
      if (
        requiredRoles.length > 0 &&
        !requiredRoles.includes(req.user.role)
      ) {
        return res.status(403).json({ message: "Forbidden" });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
}
