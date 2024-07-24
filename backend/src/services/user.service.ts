import User, { IUser } from "../models/user.model";
import CustomError from "../utils/CustomError";
import { hashPassword } from "../utils/password";

class UserService {
  async create(data: Partial<IUser>): Promise<IUser> {
    const { name, email, password } = data;

    if (await User.exists({ name })) {
      throw new CustomError('Name already exists', 409);
    }

    if (await User.exists({ email })) {
      throw new CustomError('Email already exists', 409);
    }

    data.password = await hashPassword(password!);
    const user = new User(data);
    return user.save();
  }

  async getById(id: string): Promise<IUser | null> {
    return await User.findById(id);
  }

  /**
   * find user by identifier (eg: name, email)
   * @param identifier 
   * @returns Promise<IUser | null>
   */
  async findByIdentifier(identifier: string): Promise<IUser | null> {
    return await User.findOne({
      $or: [{ name: identifier }, { email: identifier }]
    });
  }

  async getAll(): Promise<IUser[]> {
    return await User.find();
  }

  async update(id: string, data: Partial<IUser>): Promise<IUser | null> {
    return await User.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<IUser | null> {
    return await User.findByIdAndDelete(id);
  }
}

export default new UserService();
