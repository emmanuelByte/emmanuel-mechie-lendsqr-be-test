import app from "./app";
import db from "./config/db";
import logger from "./config/logger";

const PORT = process.env.PORT || 6789;

// Test DB Connection before starting server
db.raw("SELECT 1")
  .then(() => {
    logger.info("✅ Database connected successfully");

    // Start Express server
    app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    logger.error("❌ Database connection failed:", err);
    process.exit(1); // Prevent server from running if DB is down
  });
