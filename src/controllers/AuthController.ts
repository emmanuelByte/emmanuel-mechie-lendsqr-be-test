import { Request, Response } from "express";
import AuthService from "../services/AuthService";
import { successResponse, errorResponse } from "../utils/responseHandler";
import { catchAsync } from "../utils/catchAsync";
import { IRequest } from "../types/express";

class AuthController {
  /**
   * User signup handler
   */
  public signup = catchAsync(async (req: Request, res: Response) => {
    const { first_name, last_name, other_name, email, phone_number, password } =
      req.body;

    const data = await AuthService.signup(
      first_name,
      last_name,
      other_name,
      email,
      phone_number,
      password
    );

    return successResponse({
      res,
      message: "User registered successfully",
      data,
    });
  });
  public login = catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const data = await AuthService.login(email, password);

    return successResponse({
      res,
      message: "User Logged In successfully",
      data,
    });
  });

  getProfile = catchAsync(async (req: Request, res: Response) => {
    const { user } = req as IRequest;

    return successResponse({
      res,
      message: "User Profile",
      data: user,
    });
  });
}

export default new AuthController();
