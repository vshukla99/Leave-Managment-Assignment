import { Router } from "express";
import {
  postLeave,
  requestLeave,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus,
  getMyLeaveBalance
} from "./leave.controller";
import { auth } from "../../middleware/auth.middleware";
import { validateSchema } from "../../middleware/validate.middleware";
import {
  postLeaveSchema,
  requestLeaveSchema,
  updateLeaveStatusSchema
} from "./leave.schema";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Leave
 *   description: Leave Management APIs
 */

/**
 * ================================
 * ADMIN: Credit leave to a user
 * ================================
 */
/**
 * @swagger
 * /leave/credit:
 *   post:
 *     summary: Credit leave hours to a user (Admin only)
 *     description: Admin can grant leave credits to a user with an expiration date.
 *     tags: [Leave]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, hoursGranted, expiresAt]
 *             properties:
 *               userId:
 *                 type: number
 *                 example: 1
 *               hoursGranted:
 *                 type: number
 *                 example: 16
 *               expiresAt:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-03-01T00:00:00.000Z
 *     responses:
 *       201:
 *         description: Leave credited successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/credit",
  auth("ADMIN"),
  validateSchema(postLeaveSchema),
  postLeave
);

/**
 * ================================
 * USER: Request leave
 * ================================
 */
/**
 * @swagger
 * /leave/request:
 *   post:
 *     summary: Request leave using FIFO deduction
 *     description: User requests PTO. Leave credits are deducted using FIFO logic from available, non-expired balances.
 *     tags: [Leave]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fromDate
 *               - toDate
 *               - hoursRequested
 *               - reason
 *             properties:
 *               fromDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-02-14T00:00:00.000Z
 *               toDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-02-14T00:00:00.000Z
 *               hoursRequested:
 *                 type: integer
 *                 example: 8
 *               reason:
 *                 type: string
 *                 example: "Medical appointment"
 *     responses:
 *       200:
 *         description: Leave requested successfully
 *       400:
 *         description: Validation error or insufficient leave balance
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/request",
  auth(),
  validateSchema(requestLeaveSchema),
  requestLeave
);

/**
 * ================================
 * USER: Get my leave requests
 * ================================
 */
/**
 * @swagger
 * /leave/my:
 *   get:
 *     summary: Get my leave requests
 *     tags: [Leave]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of leave requests for logged-in user
 */
router.get("/my", auth(), getMyLeaves);

/**
 * ================================
 * ADMIN: Get all leave requests with user details
 * ================================
 */
/**
 * @swagger
 * /leave/all:
 *   get:
 *     summary: Get all leave requests (Admin)
 *     tags: [Leave]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all leave requests with user fullName, email, mobile
 */
router.get("/all", auth("ADMIN"), getAllLeaves);

/**
 * ================================
 * ADMIN: Update leave status
 * ================================
 */
/**
 * @swagger
 * /leave/{leaveId}/status:
 *   patch:
 *     summary: Approve or reject a leave request (Admin)
 *     tags: [Leave]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: leaveId
 *         required: true
 *         schema:
 *           type: number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [APPROVED, REJECTED]
 *     responses:
 *       200:
 *         description: Leave status updated successfully
 *       404:
 *         description: Leave not found
 *       409:
 *         description: Invalid state transition
 */
router.patch(
  "/:leaveId/status",
  auth("ADMIN"),
  validateSchema(updateLeaveStatusSchema),
  updateLeaveStatus
);

/**
 * ================================
 * USER: Get leave balance
 * ================================
 */
/**
 * @swagger
 * /leave/balance:
 *   get:
 *     summary: Get available leave balance
 *     tags: [Leave]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Leave balance summary
 */
router.get("/balance", auth(), getMyLeaveBalance);


export default router;
