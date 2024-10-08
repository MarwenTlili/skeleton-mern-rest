import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export const login = async (req: Request, res: Response) => {
  try {
    const { identifier, password } = req.body;
    const result = await AuthService.login(identifier, password);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name) return res.status(401).json({ message: 'name is required!' })
    if (!email) return res.status(401).json({ message: 'email is required!' })
    if (!password) return res.status(401).json({ message: 'password is required!' })

    const result = await AuthService.register(req.body);
    return res.status(201).json(result);
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
  }
};

export const refreshTokens = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    const result = await AuthService.refreshTokens(refreshToken);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
  }
};
