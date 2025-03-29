import { Router } from "express";
import authRoutes from "./auth.routes";
import walletRoutes from "./wallets.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/wallets", walletRoutes);

export default router;
