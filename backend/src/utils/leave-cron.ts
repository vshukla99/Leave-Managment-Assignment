import cron from "node-cron";
import { prisma } from "../prisma";

/**
 * FIFO expiration job
 */
export function startLeaveExpirationJob() {
  cron.schedule(
    "0 0 * * *",
    async () => {
      const now = new Date();

      const expiredCredits = await prisma.leaveCredit.findMany({
        where: {
          expiresAt: { lt: now },
          hoursRemaining: { gt: 0 },
        },
        orderBy: { createdAt: "asc" },
      });

      for (const credit of expiredCredits) {
        await prisma.leaveCredit.update({
          where: { id: credit.id },
          data: { hoursRemaining: 0 },
        });
      }

      console.log("[CRON] Leave expiration completed");
    },
    { timezone: "Asia/Kolkata" }
  );
}
