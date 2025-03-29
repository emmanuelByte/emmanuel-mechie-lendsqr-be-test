import { Request, Response } from "express";
import WalletService from "../services/WalletService";
import TransferService from "../services/TransferService";
import { successResponse } from "../utils/responseHandler";
import { catchAsync } from "../utils/catchAsync";
import { IRequest } from "../types/express";

class WalletController {
  public fund = catchAsync(async (req: Request, res: Response) => {
    const { amount } = req.body;
    const { user } = req as IRequest;

    const data = await WalletService.fund(user.id, parseFloat(amount));
    return successResponse({
      res,
      message: "Wallet funded successfully",
      data,
    });
  });

  // ✅ INITIATE transfer session
  public initiateTransfer = catchAsync(async (req: Request, res: Response) => {
    const { recipient_account_number } = req.body;
    const { user } = req as IRequest;

    const data = await TransferService.initiateTransfer(
      user.id,
      recipient_account_number
    );

    return successResponse({
      res,
      message: "Transfer session created successfully",
      data,
    });
  });

  // ✅ COMPLETE transfer session
  public completeTransfer = catchAsync(async (req: Request, res: Response) => {
    const { session_id, narration, amount } = req.body;
    const { user } = req as IRequest;

    const data = await TransferService.completeTransfer(
      user.id,
      session_id,
      amount,
      narration
    );

    return successResponse({
      res,
      message: "Transfer completed successfully",
      data,
    });
  });

  public getWallet = catchAsync(async (req: Request, res: Response) => {
    const { user } = req as IRequest;
    const data = await WalletService.getWalletByUserId(user.id);

    return successResponse({
      res,
      message: "Wallet fetched successfully",
      data,
    });
  });

  public withdraw = catchAsync(async (req: Request, res: Response) => {
    const { amount } = req.body;
    const { user } = req as IRequest;

    const data = await WalletService.withdraw(user.id, parseFloat(amount));

    return successResponse({
      res,
      message: "Withdrawal successful",
      data,
    });
  });

  public getWalletByAccountNumber = catchAsync(
    async (req: Request, res: Response) => {
      const { account_number } = req.params;
      const data = await WalletService.getWalletByAccountNumber(account_number);

      return successResponse({
        res,
        message: "Wallet fetched successfully",
        data,
      });
    }
  );
}

export default new WalletController();
