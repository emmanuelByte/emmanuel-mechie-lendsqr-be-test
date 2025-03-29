export interface IWallet {
  id?: number;
  user_id: number;
  balance: number;
  oldBalance?: number;
  created_at?: Date;
  account_number: string;
}
