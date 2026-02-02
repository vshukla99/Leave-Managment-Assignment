import { Router } from "express";
import { auth } from "../../middleware/auth.middleware";
import { validateSchema } from "../../middleware/validate.middleware";
import {
  updateUserSchema,
  updateMyProfileSchema,
} from "./user.schema";
import {
  updateUser,
  deleteUser,
  updateMe,
  getUsers,
  getUser,
} from "./user.controller";

const router = Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users ADMIN ONLY
 *     description: Returns a list of all users. Accessible only by admin.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               data:
 *                 - id: 1
 *                   fullName: John Doe
 *                   email: john@example.com
 *                   mobile: "9876543210"
 *                   role: USER
 *                   createdAt: 2026-02-01T10:00:00.000Z
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get("/", auth("ADMIN"), getUsers);

/**
 * @swagger
 * /users/{userId}:
 *   get:
 *     summary: Get user by ID
 *     description: Fetch a single user by their ID. Accessible only by admin.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 3
 *     responses:
 *       200:
 *         description: User fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               data:
 *                 id: 3
 *                 fullName: John Doe
 *                 email: john@example.com
 *                 mobile: "9876543210"
 *                 role: USER
 *                 createdAt: 2026-02-01T10:00:00.000Z
 *       400:
 *         description: Invalid user ID
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */
router.get("/:userId",  auth("USER", "ADMIN"), getUser);

/**
 * @swagger
 * /users/me:
 *   put:
 *     summary: Update own profile
 *     description: Allows a logged-in user to update their own profile information.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: John Doe
 *               mobile:
 *                 type: string
 *                 example: "9876543210"
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Profile updated successfully
 *               data:
 *                 id: 1
 *                 fullName: John Doe
 *                 email: john@example.com
 *                 mobile: "9876543210"
 *                 role: USER
 *                 createdAt: 2026-02-01T10:00:00.000Z
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.put(
  "/me",
  auth("USER", "ADMIN"),
  validateSchema(updateMyProfileSchema),
  updateMe
);

/**
 * @swagger
 * /users/{userId}:
 *   put:
 *     summary: Update user by ID ADMIN ONLY
 *     description: Allows admin to update user details including role and email.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 3
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: John Doe
 *               mobile:
 *                 type: string
 *                 example: "9876543210"
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               role:
 *                 type: string
 *                 enum: [USER, ADMIN]
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */
router.put(
  "/:userId",
  auth("ADMIN"),
  validateSchema(updateUserSchema),
  updateUser
);

/**
 * @swagger
 * /users/{userId}:
 *   delete:
 *     summary: Delete user ADMIN ONLY
 *     description: Permanently deletes a user. Admin cannot delete their own account.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 3
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               message: User deleted successfully
 *       400:
 *         description: Invalid operation
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */
router.delete(
  "/:userId",
  auth("ADMIN"),
  deleteUser
);

export default router;
