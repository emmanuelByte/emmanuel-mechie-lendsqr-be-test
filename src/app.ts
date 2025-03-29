import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import rateLimiter from "./config/rateLimit";
import morgan from "morgan";
import compression from "compression";

import listEndpoints from "list_end_points";
import { generalError, notFound } from "./middlewares/error.middleware";
import router from "./routes/index.routes";

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(rateLimiter);
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev")); // or use "combined" for more verbose logs
} else {
  app.use(morgan("combined"));
}
app.use("/api/v1", router);

// Default route
app.get("/", (req, res) => {
  res.send("Lendsqr Wallet Service is running 🚀");
});

app.use(compression());
if (process.env.NODE_ENV === "development") {
  listEndpoints(app);
}

// Error handling middleware

app.use(notFound);
app.use(generalError);

export default app; // ✅ Export app for `server.ts`
