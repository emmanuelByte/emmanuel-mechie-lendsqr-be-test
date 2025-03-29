import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware";
import WalletController from "../controllers/WalletController";
import walletValidation from "../validate/wallet.validation";
import TransactionController from "../controllers/TransactionController";

const walletRouter = Router();

walletRouter.use(isAuthenticated);

walletRouter.post(
  "/fund",
  walletValidation.fundWalletSchemaValidation,
  WalletController.fund
);

walletRouter.post(
  "/transfer/initiate",
  walletValidation.initiateTransferSchemaValidation,
  WalletController.initiateTransfer
);

walletRouter.post(
  "/transfer/complete",
  walletValidation.completeTransferSchemaValidation,
  WalletController.completeTransfer
);

walletRouter.post(
  "/withdraw",
  walletValidation.withdrawSchemaValidation,
  WalletController.withdraw
);

walletRouter.get("/", WalletController.getWallet);

walletRouter.get("/transactions", TransactionController.getWalletTransactions);

walletRouter.get(
  "/:account_number",
  walletValidation.getWalletByAccountNumberSchemaValidation,
  WalletController.getWalletByAccountNumber
);

export default walletRouter;
