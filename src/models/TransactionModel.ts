export type TransactionType = "deposit" | "withdrawal" | "transfer";
export type TransactionStatus = "success" | "failed" | "pending";

export interface ITransaction {
  id?: number;
  wallet_id: number;
  amount: number;
  old_balance?: number;

  balance?: number;

  account_number?: string;
  type: TransactionType;
  status: TransactionStatus;
  narration?: string;
  reference: string;
  created_at?: Date;
}
