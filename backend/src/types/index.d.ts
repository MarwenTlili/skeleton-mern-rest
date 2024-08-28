import { Request } from "express"
import { JwtPayload } from "jsonwebtoken"

export interface CustomJwtPayload extends JwtPayload {
  id?: string
}

export interface CustomRequest extends Request {
  user?: CustomJwtPayload | string
}
