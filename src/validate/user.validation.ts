import Joi from "joi";
import validate from ".";

const signupSchema = Joi.object({
  first_name: Joi.string().required().label("First name").messages({
    "any.required": "{{#label}} is required",
    "string.empty": "{{#label}} is required",
  }),

  last_name: Joi.string().required().label("Last name").messages({
    "any.required": "{{#label}} is required",
    "string.empty": "{{#label}} is required",
  }),

  other_name: Joi.string().optional().allow("").label("Other name"),

  email: Joi.string().email().required().label("Email").messages({
    "string.empty": "{{#label}} is required",
    "string.email": "Enter a valid email address",
  }),

  phone_number: Joi.string()
    .pattern(/^\+?\d{10,15}$/)
    .required()
    .label("Phone number")
    .messages({
      "string.empty": "{{#label}} is required",
      "string.pattern.base": "{{#label}} must be valid (E.g., +234...)",
    }),

  password: Joi.string().min(8).required().label("Password").messages({
    "string.empty": "{{#label}} is required",
    "string.min": "{{#label}} must be at least 8 characters",
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Enter a valid email address",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required",
  }),
});

const requestPasswordResetSchema = Joi.object({
  email: Joi.string().email().required(),
});

const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().min(8).required(),
});

export default {
  signupSchemaValidation: validate(signupSchema),
  loginSchemaValidation: validate(loginSchema),
  requestPasswordResetSchemaValidation: validate(requestPasswordResetSchema),
  resetPasswordSchemaValidation: validate(resetPasswordSchema),
};
