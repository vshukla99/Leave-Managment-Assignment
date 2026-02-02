import { z } from "zod";

const HOURS_PER_DAY = 8;
const MS_PER_DAY = 1000 * 60 * 60 * 24;

/**
 * ================================
 * ADMIN: Credit leave
 * ================================
 */
export const postLeaveSchema = z
  .object({
    userId: z.number().int().positive(),
    hoursGranted: z.number().int().positive(),
    expiresAt: z.string().datetime(),
  })
  .strict();

/**
 * ================================
 * USER: Request leave (FULL-DAY ONLY)
 * ================================
 */
export const requestLeaveSchema = z
  .object({
    hoursRequested: z.number().int().positive(),
    fromDate: z.string().datetime(),
    toDate: z.string().datetime(),
    reason: z.string().min(5).max(255),
  })
  .superRefine((data, ctx) => {
    const from = new Date(data.fromDate);
    const to = new Date(data.toDate);
    

    // 1️⃣ Date order validation
    if (from > to) {
      ctx.addIssue({
        path: ["fromDate"],
        message: "fromDate must be before or equal to toDate",
        code: z.ZodIssueCode.custom,
      });
      return;
    }

    // Calculate total days (inclusive)
    const totalDays =
      Math.floor((to.getTime() - from.getTime()) / MS_PER_DAY) + 1;

    const requiredHours = totalDays * HOURS_PER_DAY;

    //  Enforce exact hours match
    if (data.hoursRequested !== requiredHours) {
      ctx.addIssue({
        path: ["hoursRequested"],
        message: `hoursRequested must be exactly ${requiredHours} hours for ${totalDays} day(s) of leave`,
        code: z.ZodIssueCode.custom,
      });
    }
  })
  .strict();

  /**
 * ================================
 * ADMIN: Update leave status
 * ================================
 */
export const updateLeaveStatusSchema = z
  .object({
    status: z.enum(["APPROVED", "REJECTED"]),
  })
  .strict();