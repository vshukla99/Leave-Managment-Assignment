import { Prisma } from "@prisma/client";
import { AppError } from "../../utils/app-error";

/**
 * FIFO deduction
 * Used for PTO utilization
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
    orderBy: { createdAt: "desc" }, // reverse FIFO
  });

  for (const credit of credits) {
    if (remaining <= 0) break;

    const used =
      credit.hoursGranted - credit.hoursRemaining;

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
