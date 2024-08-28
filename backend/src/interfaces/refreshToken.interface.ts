import { Document } from "mongoose";

export default interface IRefreshToken extends Document {
  userId: string;
  token: string;
  expiresAt: Date;
}
