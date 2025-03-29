import AuthService from "../../../src/services/AuthService";
import UserRepository from "../../../src/repositories/UserRepository";
import WalletRepository from "../../../src/repositories/WalletRepository";
import { checkBlacklistStatus } from "../../../src/providers/adjutorProvider";
import * as hashUtils from "../../../src/utils/hash";
import * as jwtUtils from "../../../src/utils/jwt";
import { BadRequestError } from "../../../src/utils/error";

jest.mock("../../../src/repositories/UserRepository");
jest.mock("../../../src/repositories/WalletRepository");
jest.mock("../../../src/providers/adjutorProvider");

describe("AuthService", () => {
  const user = {
    id: 1,
    email: "user@example.com",
    password: "hashed-password",
    first_name: "John",
    last_name: "Doe",
    phone_number: "+2347000000000",
  };

  const plainPassword = "Password@123";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // -------------------------------
  describe("signup", () => {
    it("should throw if user already exists", async () => {
      (UserRepository.findByEmailOrPhone as jest.Mock).mockResolvedValue(user);

      await expect(
        AuthService.signup(
          user.first_name,
          user.last_name,
          undefined,
          user.email,
          user.phone_number,
          plainPassword
        )
      ).rejects.toThrow(/already registered/i);
    });

    it("should throw if user is blacklisted", async () => {
      (UserRepository.findByEmailOrPhone as jest.Mock).mockResolvedValue(null);
      (checkBlacklistStatus as jest.Mock).mockResolvedValue(true);

      await expect(
        AuthService.signup(
          user.first_name,
          user.last_name,
          undefined,
          user.email,
          user.phone_number,
          plainPassword
        )
      ).rejects.toThrow(/blacklisted/i);
    });

    it("should create user, wallet, and return token", async () => {
      (UserRepository.findByEmailOrPhone as jest.Mock).mockResolvedValue(null);
      (checkBlacklistStatus as jest.Mock).mockResolvedValue(false);
      jest.spyOn(hashUtils, "hashPassword").mockResolvedValue("hashed-pass");
      (UserRepository.create as jest.Mock).mockResolvedValue(user.id);
      (WalletRepository.createWallet as jest.Mock).mockResolvedValue({});
      jest.spyOn(jwtUtils, "generateToken").mockReturnValue("jwt-token");

      const result = await AuthService.signup(
        user.first_name,
        user.last_name,
        undefined,
        user.email,
        user.phone_number,
        plainPassword
      );

      expect(result).toHaveProperty("user", user.id);
      expect(result).toHaveProperty("token", "jwt-token");
    });
  });

  // -------------------------------
  describe("login", () => {
    it("should throw for invalid email", async () => {
      (UserRepository.findByEmailOrPhone as jest.Mock).mockResolvedValue(null);

      await expect(
        AuthService.login(user.email, plainPassword)
      ).rejects.toThrow(/invalid/i);
    });

    it("should throw for wrong password", async () => {
      (UserRepository.findByEmailOrPhone as jest.Mock).mockResolvedValue(user);
      jest.spyOn(hashUtils, "comparePassword").mockResolvedValue(false);

      await expect(
        AuthService.login(user.email, plainPassword)
      ).rejects.toThrow(/invalid/i);
    });

    it("should login successfully and return token", async () => {
      (UserRepository.findByEmailOrPhone as jest.Mock).mockResolvedValue(user);
      jest.spyOn(hashUtils, "comparePassword").mockResolvedValue(true);
      jest.spyOn(jwtUtils, "generateToken").mockReturnValue("jwt-token");

      const result = await AuthService.login(user.email, plainPassword);

      expect(result).toHaveProperty("token", "jwt-token");
      expect(result.user).not.toHaveProperty("password");
    });
  });
});
