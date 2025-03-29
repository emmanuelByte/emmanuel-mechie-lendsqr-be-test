import { Response, NextFunction, Request } from "express";

import { UnauthorizedError } from "../utils/error";

import jwt from "jsonwebtoken";
import { verifyToken } from "../utils/jwt";
import UserRepository from "../repositories/UserRepository";
import { IRequest } from "../types/express";

export const isAuthenticated = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const authorizationHeader = req.headers["authorization"];
  if (!authorizationHeader) {
    return next(new UnauthorizedError("No authentication token provided."));
  }

  const token = authorizationHeader.split(" ")[1];

  try {
    if (!token) {
      return next(new UnauthorizedError("No authentication token provided."));
    }

    const decoded = verifyToken(token);

    const userId = decoded?.userId as string;
    const user = await UserRepository.findById(userId);
    (req as IRequest).user = user;

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(new UnauthorizedError("Authentication token has expired."));
    } else {
      return next(new UnauthorizedError("Authentication token is invalid."));
    }
  }
};
