import Joi from "joi";
import validate from ".";

const fundWalletSchema = Joi.object({
  amount: Joi.number().positive().required().label("Amount").messages({
    "any.required": "{{#label}} is required",
    "number.base": "{{#label}} must be a number",
    "number.positive": "{{#label}} must be a positive number",
  }),
});

const initiateTransferSchema = Joi.object({
  recipient_account_number: Joi.string()
    .pattern(/^\d{10}$/)
    .required()
    .label("Recipient account number")
    .messages({
      "any.required": "{{#label}} is required",
      "string.empty": "{{#label}} is required",
      "string.pattern.base":
        "{{#label}} must be a valid 10-digit account number",
    }),
});

const completeTransferSchema = Joi.object({
  session_id: Joi.string().uuid().required().label("Session ID").messages({
    "any.required": "{{#label}} is required",
    "string.empty": "{{#label}} is required",
    "string.guid": "{{#label}} must be a valid UUID",
  }),
  amount: Joi.number().positive().required().label("Amount").messages({
    "any.required": "{{#label}} is required",
    "number.base": "{{#label}} must be a number",
    "number.positive": "{{#label}} must be a positive number",
  }),
  narration: Joi.string().optional().label("Narration").messages({
    "string.base": "{{#label}} must be a string",
  }),
});

const getWalletByAccountNumberSchema = Joi.object({
  account_number: Joi.string()
    .pattern(/^\d{10}$/)
    .required()
    .label("Account number")
    .messages({
      "any.required": "{{#label}} is required",
      "string.empty": "{{#label}} is required",
      "string.pattern.base":
        "{{#label}} must be a valid 10-digit account number",
    }),
});

const withdrawSchema = Joi.object({
  amount: Joi.number().positive().required().label("Amount").messages({
    "any.required": "{{#label}} is required",
    "number.base": "{{#label}} must be a number",
    "number.positive": "{{#label}} must be a positive number",
  }),
});

export default {
  fundWalletSchemaValidation: validate(fundWalletSchema),
  initiateTransferSchemaValidation: validate(initiateTransferSchema),
  completeTransferSchemaValidation: validate(completeTransferSchema),
  getWalletByAccountNumberSchemaValidation: validate(
    getWalletByAccountNumberSchema,
    "params"
  ),
  withdrawSchemaValidation: validate(withdrawSchema),
};
