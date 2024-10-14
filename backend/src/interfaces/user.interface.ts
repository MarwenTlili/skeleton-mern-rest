import { Document } from "mongoose";

export default interface IUser extends Document {
  _id: string;
  name?: string;
  email?: string;
  password?: string;
  roles?: [string];
  picture?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  lastLoginAt?: Date;
  refreshToken?: string;
  __v?: Number;
}
