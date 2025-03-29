export interface ITransferSession {
  id?: number;
  user_id: number;
  account_number: string;
  amount?: number;
  session_id: string;
  expires_at: Date;
  created_at?: Date;
}
