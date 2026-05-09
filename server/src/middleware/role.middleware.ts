import { NextFunction, Response } from 'express';

import { AuthRequest } from './auth.middleware';
import { UserRole } from '../models/User';

export const roleMiddleware =
  (...allowedRoles: UserRole[]) =>
  (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication is required' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ message: 'You do not have permission to perform this action' });
      return;
    }

    next();
  };
