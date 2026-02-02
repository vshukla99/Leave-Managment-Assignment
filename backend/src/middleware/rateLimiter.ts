import rateLimit from "express-rate-limit";

/**
 * Rate limiter to protect APIs from abuse
 * - 100 requests per 15 minutes per IP
 * - Applies globally
 */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false, // Disable X-RateLimit-* headers
  message: {
    message: "Too many requests, please try again later."
  }
});

export default limiter;
