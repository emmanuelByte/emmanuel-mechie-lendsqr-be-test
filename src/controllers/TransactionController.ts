import { Request, Response } from "express";
import { successResponse } from "../utils/responseHandler";
import { catchAsync } from "../utils/catchAsync";
import TransactionService from "../services/TransactionService";
import { IRequest } from "../types/express";

class TransactionController {
  public getWalletTransactions = catchAsync(
    async (req: Request, res: Response) => {
      const { user } = req as IRequest;
      const userId = user.id;

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const { data, meta } = await TransactionService.getUserTransactions(
        userId,
        page,
        limit
      );

      return successResponse({
        res,
        message: "Transactions fetched successfully",
        data,
        meta,
      });
    }
  );
}

export default new TransactionController();
