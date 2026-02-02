import express from "express";
import helmet from "helmet";
import cors from "cors";
import swaggerUi from "swagger-ui-express";

import rateLimit from "./middleware/rateLimiter";
import authRoutes from "./modules/auth/auth.routes";
import leaveRoutes from "./modules/leave/leave.routes";
import userRoutes from "./modules/user/user.routes";
import { errorHandler } from "./middleware/error.middleware";
import { swaggerSpec } from "./config/swagger";
import { startLeaveExpirationJob } from "./utils/leave-cron";

const app = express();

/* ===============================
   GLOBAL MIDDLEWARES
================================ */
app.set("trust proxy", 1);

app.use(
  cors({
    origin: "*", // OK for dev, restrict in prod
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(rateLimit);

/* ===============================
   ROOT INFO
================================ */
app.get("/", (req, res) => {
  res.status(200).json({
    title: "Leave Management",
    status: "running",
    version: "1.0.0",
    documentation: "/api/docs",
    timestamp: new Date().toISOString(),
  });
});

/* ===============================
   SWAGGER
================================ */
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/* ===============================
   ROUTES
================================ */
app.use("/api/auth", authRoutes);
app.use("/api/leave", leaveRoutes);
app.use("/api/users", userRoutes);

/* ===============================
   ERROR HANDLER
================================ */
app.use(errorHandler);

// Start cron jobs once when app boots
startLeaveExpirationJob();

export default app;
