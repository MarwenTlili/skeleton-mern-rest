import { Document } from "mongoose";

export default interface IUser extends Document {
  _id: string;
  name?: string;
  email?: string;
  password?: string;
  refreshToken?: string;
  roles?: [string];
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  lastLoginAt?: Date;
  profilePicture?: string;
  __v?: Number;
}
