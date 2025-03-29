import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { BadRequestError } from "../utils/error";

type ValidationSource = "body" | "query" | "params";

const validate = (
  schema: Joi.ObjectSchema<unknown>,
  source: ValidationSource = "body"
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const input = { ...req[source] };
    const { error } = schema.validate(input);

    if (error && error.details?.[0]) {
      return next(new BadRequestError(error.details[0].message));
    }

    next();
  };
};

export default validate;
