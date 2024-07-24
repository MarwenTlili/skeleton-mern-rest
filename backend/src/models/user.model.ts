import { Schema, model, Document } from "mongoose";

interface IUser extends Document {
  _id: string;
  name?: string;
  email?: string;
  password?: string;
}

const userSchema = new Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User = model<IUser>('User', userSchema);

export { IUser };

export default User;
