import { NextFunction, Request, Response } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken';

import { User, UserRole } from '../models/User';

export interface AuthUser {
  userId: string;
  role: UserRole;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

interface TokenPayload extends JwtPayload {
  userId: string;
  role: UserRole;
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Authentication token is required' });
    return;
  }

  const token = authHeader.split(' ')[1];
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    res.status(500).json({ message: 'JWT_SECRET is not configured' });
    return;
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as TokenPayload;

    if (!decoded.userId) {
      res.status(401).json({ message: 'Invalid token payload' });
      return;
    }

    const user = await User.findById(decoded.userId).select('role');

    if (!user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }

    req.user = {
      userId: decoded.userId,
      role: user.role
    };

    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};
