import * as Express from "express";
import { IUser } from "../models/UserModel";

export interface IRequest extends Express.Request {
  user: IUser;
}

export interface AdjutorKarmaResponse {
  status: "success" | "error";
  message: string;
  "mock-response"?: string;
  data?: {
    karma_identity: string;
    amount_in_contention: string;
    reason: string | null;
    default_date: string;
    karma_type: {
      karma: string;
    };
    karma_identity_type: {
      identity_type: string;
    };
    reporting_entity: {
      name: string;
      email: string;
    };
  };
  meta?: {
    cost: number;
    balance: number;
  };
}
