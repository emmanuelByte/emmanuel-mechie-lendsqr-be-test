import { Request, Response, NextFunction } from "express";

export function catchAsync<T>(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<T>
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch((err) => next(err));
  };
}
