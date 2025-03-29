import db from "../config/db";
import { IUser } from "../models/UserModel";
import { checkBlacklistStatus } from "../providers/adjutorProvider";
import UserRepository from "../repositories/UserRepository";
import WalletRepository from "../repositories/WalletRepository";
import { generateAccountNumber } from "../utils/account";
import { BadRequestError } from "../utils/error";
import { comparePassword, hashPassword } from "../utils/hash";
import { generateToken } from "../utils/jwt";
import WalletService from "./WalletService";

class AuthService {
  /**
   * Registers a new user
   * @param fullName User full name
   * @param email User email
   * @param phoneNumber User phone number
   * @param password User password
   */
  public async signup(
    first_name: string,
    last_name: string,
    other_name: string | undefined,
    email: string,
    phone_number: string,
    password: string
  ) {
    const existingUser = await UserRepository.findByEmailOrPhone(
      email,
      phone_number
    );
    if (existingUser) throw new BadRequestError("User already registered");

    const isBlacklisted = await checkBlacklistStatus(email);
    if (isBlacklisted)
      throw new BadRequestError("User is blacklisted and cannot be onboarded");

    const hashedPassword = await hashPassword(password);

    const newUser: Omit<IUser, "id"> = {
      first_name,
      last_name,
      other_name,
      email,
      phone_number,
      password: hashedPassword,
    };

    const user = await UserRepository.create(newUser);
    const wallet = await WalletService.createWallet(user?.id);
    const token = generateToken(user?.id);

    return { user, token, wallet };
  }
  public async login(email: string, password: string) {
    const user = await UserRepository.findByEmailOrPhone(email);
    if (!user) throw new BadRequestError("Invalid email or password");

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid)
      throw new BadRequestError("Invalid email or password");

    const token = generateToken(user.id);
    const { password: p, ...rest } = user;

    return {
      user: rest,
      token,
    };
  }
}

export default new AuthService();
