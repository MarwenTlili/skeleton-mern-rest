import { Response, NextFunction } from "express"
import { verifyAccessToken } from "../utils/jwt.util"
import { CustomRequest } from "../types"

export const authMiddleware = (
  req: CustomRequest, res: Response, next: NextFunction
) => {
  // OR req.cookies.access_token
  const accessToken = req.header('Authorization')?.replace('Bearer ', '')

  if (!accessToken) {
    return res.status(401).json({ message: 'Access denied, No token provided!' })
  }

  try {
    // decoded: { id: '66c23eeb3735ef18ba9ea68f', iat: 1724668884, exp: 1724672484 }
    const decoded = verifyAccessToken(accessToken)
    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token!' })
  }
}
