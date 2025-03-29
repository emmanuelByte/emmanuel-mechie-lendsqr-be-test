import db from "../config/db";
import { IUser } from "../models/UserModel";

class UserRepository {
  async findByEmailOrPhone(email?: string, phone?: string) {
    return db("users")
      .where(function () {
        if (email) {
          this.where({ email });
        }
        if (phone) {
          this.orWhere({ phone_number: phone });
        }
      })
      .first();
  }
  async findById(id: string, hidePassword = true) {
    return await db("users")
      .where({ id })
      .first()
      .then((user) => {
        if (hidePassword) {
          const { password, ...rest } = user;
          return rest;
        }
        return user;
      });
  }

  async create(user: Omit<IUser, "id">): Promise<IUser> {
    const [createdUser] = await db("users").insert(user, [
      "id",
      "first_name",
      "last_name",
      "other_name",
      "phone_number",
      "password",
      "email",
    ]);
    return await this.findById(createdUser);
  }
}

export default new UserRepository();
