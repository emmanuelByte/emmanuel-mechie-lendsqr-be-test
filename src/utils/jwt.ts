import jwt from "jsonwebtoken";
import config from "../config/config";

export const generateToken = (userId: number) => {
  const { secret, expiresIn } = config.jwt;

  return jwt.sign({ userId }, secret, {
    expiresIn: expiresIn as `${number}D`,
  });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, config.jwt.secret) as { userId: string };
  } catch (error) {
    return null;
  }
};
