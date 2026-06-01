import { Router } from 'express';

import { authMiddleware } from '../middleware/auth.middleware';
import { roleMiddleware } from '../middleware/role.middleware';
import { User } from '../models/User';

const router = Router();

router.get('/', authMiddleware, roleMiddleware('admin'), async (_req, res, next) => {
  try {
    const users = await User.find()
      .select('name email role createdAt')
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    next(error);
  }
});

export default router;
