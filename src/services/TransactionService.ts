import WalletRepository from "../repositories/WalletRepository";
import TransactionRepository from "../repositories/TransactionRepository";
import { BadRequestError } from "../utils/error";
import { IPaginationMeta } from "../utils/responseHandler";
import { ITransaction } from "../models/TransactionModel";

class TransactionService {
  async getUserTransactions(
    user_id: number,
    page = 1,
    limit = 10
  ): Promise<{
    data: ITransaction[];
    meta: IPaginationMeta;
  }> {
    const wallet = await WalletRepository.findByUserId(user_id);
    if (!wallet) throw new BadRequestError("Wallet not found");

    const response = await TransactionRepository.getWalletTransactionsPaginated(
      wallet.id!,
      page,
      limit
    );
    if (!response) {
      return {
        data: [],
        meta: {
          total_items: 0,
          current_page: page,
          total_pages: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };
    }
    // Destructure the response to get transactions and total
    const { transactions, total } = response;
    const currentPage = page;
    const totalItems = total;
    const totalPages = Math.ceil(total / limit);
    return {
      data: transactions,
      meta: {
        total_items: totalItems,
        current_page: currentPage,
        total_pages: totalPages,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
      },
    };
  }
}

export default new TransactionService();
