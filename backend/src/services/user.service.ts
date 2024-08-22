import IUser from "../interfaces/user.interface";
import { IUserService } from "../interfaces/userService.interface";
import User from "../models/user.model";
import CustomError from "../utils/CustomError";
import { hashPassword } from "../utils/password";

class UserService implements IUserService {
  async create(data: Partial<IUser>): Promise<IUser | null> {
    const { name, email, password } = data;

    if (await User.exists({ name })) {
      throw new CustomError('Name already exists', 409);
    }

    if (await User.exists({ email })) {
      throw new CustomError('Email already exists', 409);
    }

    data.password = await hashPassword(password!);
    const user = new User(data);
    const savedUser = await user.save();

    // Omit password from User Object
    // Convert to plain object and remove password
    const userObject = savedUser.toObject();
    delete userObject.password;

    return userObject as Omit<IUser, 'password'>;
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
