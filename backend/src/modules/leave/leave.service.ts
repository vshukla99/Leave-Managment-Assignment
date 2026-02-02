import { Prisma } from "@prisma/client";
import { prisma } from "../../prisma";
import { AppError } from "../../utils/app-error";

/**
 * ================================
 * ADMIN: Credit leave
 * ================================
 */
export async function creditLeaveService(
  userId: number,
  hoursGranted: number,
  expiresAt: string
) {
  return prisma.leaveCredit.create({
    data: {
      userId,
      hoursGranted,
      hoursRemaining: hoursGranted,
      expiresAt: new Date(expiresAt),
    },
  });
}

/**
 * ================================
 * USER: Request leave
 * ================================
 */
export async function requestLeaveService(
  userId: number,
  payload: {
    fromDate: string;
    toDate: string;
    hoursRequested: number;
    reason: string; // ✅ REQUIRED
  }
) {
  const { fromDate, toDate, hoursRequested, reason } = payload;

  return prisma.$transaction(
    async (tx) => {
      await deductLeaveFIFO(tx, userId, hoursRequested);

      return tx.leaveRequest.create({
        data: {
          userId,
          fromDate: new Date(fromDate),
          toDate: new Date(toDate),
          hoursRequested,
          reason,
        },
      });
    },
    { isolationLevel: "Serializable" }
  );
}

/**
 * ================================
 * USER: Get my leaves
 * ================================
 */
export async function getMyLeavesService(userId: number) {
  return prisma.leaveRequest.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * ================================
 * ADMIN: Get all leaves
 * ================================
 */
export async function getAllLeavesService() {
  return prisma.leaveRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          fullName: true,
          email: true,
          mobile: true,
        },
      },
    },
  });
}

/**
 * ================================
 * ADMIN: Update leave status
 * ================================
 */
export async function updateLeaveStatusService(
  leaveId: number,
  status: "APPROVED" | "REJECTED"
) {
  return prisma.$transaction(async (tx) => {
    const leave = await tx.leaveRequest.findUnique({
      where: { id: leaveId },
    });

    if (!leave) {
      throw new AppError("Leave not found", 404);
    }

    if (leave.status === status) {
      throw new AppError("Invalid state transition", 409);
    }

    if (status === "REJECTED") {
      await restoreLeaveFIFO(tx, leave.userId, leave.hoursRequested);
    }

    if (status === "APPROVED" && leave.status === "REJECTED") {
      await deductLeaveFIFO(tx, leave.userId, leave.hoursRequested);
    }

    return tx.leaveRequest.update({
      where: { id: leaveId },
      data: { status },
    });
  });
}

/**
 * ================================
 * USER: Leave balance
 * ================================
 */
export async function getMyLeaveBalanceService(userId: number) {
  const credits = await prisma.leaveCredit.findMany({
    where: {
      userId,
      expiresAt: { gt: new Date() },
    },
  });

  const totalGranted = credits.reduce((sum, c) => sum + c.hoursGranted, 0);
  const totalRemaining = credits.reduce((sum, c) => sum + c.hoursRemaining, 0);

  return {
    totalGranted,
    totalUsed: totalGranted - totalRemaining,
    totalRemaining,
  };
}

/**
 * ================================
 * FIFO deduction
 * ================================
 */
export async function deductLeaveFIFO(
  tx: Prisma.TransactionClient,
  userId: number,
  hoursToDeduct: number
) {
  let remaining = hoursToDeduct;

  const credits = await tx.leaveCredit.findMany({
    where: {
      userId,
      hoursRemaining: { gt: 0 },
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "asc" }, // FIFO
  });

  for (const credit of credits) {
    if (remaining <= 0) break;

    const deduct = Math.min(credit.hoursRemaining, remaining);

    await tx.leaveCredit.update({
      where: { id: credit.id },
      data: {
        hoursRemaining: credit.hoursRemaining - deduct,
      },
    });

    remaining -= deduct;
  }

  if (remaining > 0) {
    throw new AppError("Insufficient leave balance", 409);
  }
}

/**
 * FIFO restore (used when PTO is rejected)
 * Restore in reverse order (LIFO) to keep FIFO integrity
 */
export async function restoreLeaveFIFO(
  tx: Prisma.TransactionClient,
  userId: number,
  hoursToRestore: number
) {
  let remaining = hoursToRestore;

  const credits = await tx.leaveCredit.findMany({
    where: {
      userId,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },// reverse FIFO
  });

  for (const credit of credits) {
    if (remaining <= 0) break;

    const used = credit.hoursGranted - credit.hoursRemaining;
    if (used <= 0) continue;

    const restore = Math.min(used, remaining);

    await tx.leaveCredit.update({
      where: { id: credit.id },
      data: {
        hoursRemaining: { increment: restore },
      },
    });

    remaining -= restore;
  }

  if (remaining > 0) {
    throw new AppError("Restore overflow detected", 500);
  }
}
