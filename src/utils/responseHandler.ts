import { Response } from "express";
import { StatusCodes } from "http-status-codes";

export interface IPaginationMeta {
  total_pages: number;
  total_items: number;
  current_page: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export function successResponse<T>({
  res,
  message,
  data,
  status,
  meta,
}: {
  res: Response;
  message: string;
  data?: T;
  status?: number;
  meta?: IPaginationMeta;
}) {
  return res.status(status || StatusCodes.OK).json({
    success: true,
    message,
    data,
    meta,
  });
}

export function errorResponse({
  res,
  message,
  status,
}: {
  res: Response;
  message: string;
  status?: number;
}) {
  return res.status(status || StatusCodes.BAD_REQUEST).json({
    success: false,
    message,
  });
}
