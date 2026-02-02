import cron from "node-cron";
import { expireLeaveCreditsService } from "../modules/leave/leave.service";

/**
 * FIFO expiration job
 */
export function startLeaveExpirationJob() {
  cron.schedule(
    "0 0 * * *",
    async () => {
      try {
        const count = await expireLeaveCreditsService();
        console.log(
          `[CRON] Leave expiration completed. Expired: ${count}`
        );
      } catch (error) {
        console.error(
          "[CRON] Leave expiration failed",
          error
        );
      }
    },
    { timezone: "Asia/Kolkata" }
  );
}
