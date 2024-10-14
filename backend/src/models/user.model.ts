import { Schema, model } from "mongoose";
import IUser from "../interfaces/user.interface";

const userSchema = new Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  picture: { type: String, required: false, default: "" },
  roles: { type: [String], required: true, default: ['USER'] },
  isActive: { type: Boolean, required: false, default: false },
  createdAt: { type: Date, required: false, default: Date.now },
  updatedAt: { type: Date, required: false },
  lastLoginAt: { type: Date, required: false },
  refreshToken: { type: String, required: false },
  __v: { type: Number }
});

// Format function
export const formatUserDocument = (doc: IUser) => ({
  _id: doc._id,
  name: doc.name,
  email: doc.email,
  password: doc.password,
  picture: doc.picture,
  roles: doc.roles,
  isActive: doc.isActive,
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt,
  __v: doc.__v
});

const User = model<IUser>('User', userSchema);

export default User;
