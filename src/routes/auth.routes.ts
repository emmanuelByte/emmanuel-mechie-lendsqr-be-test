import { Router } from "express";
import AuthController from "../controllers/AuthController";
import userValidation from "../validate/user.validation";
import { isAuthenticated } from "../middlewares/auth.middleware";

const userRouter = Router();

userRouter.post(
  "/signup",
  userValidation.signupSchemaValidation,
  AuthController.signup
);

userRouter.post(
  "/login",
  userValidation.loginSchemaValidation,
  AuthController.login
);

userRouter.get("/me", isAuthenticated, AuthController.getProfile);

export default userRouter;
