import { Schema, model } from "mongoose";
import IUser from "../interfaces/user.interface";

const userSchema = new Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  refreshToken: { type: String, required: false }
});

const User = model<IUser>('User', userSchema);

export default User;
