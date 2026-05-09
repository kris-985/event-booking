import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { AuthRequest, authMiddleware } from '../middleware/auth.middleware';
import { IUser, User, UserRole } from '../models/User';

const router = Router();

const isValidRole = (role: unknown): role is UserRole => role === 'user' || role === 'admin';

const createToken = (userId: string, role: UserRole): string => {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not configured');
  }

  return jwt.sign({ userId, role }, jwtSecret, { expiresIn: '7d' });
};

const toAuthUser = (user: IUser): { id: string; name: string; email: string; role: UserRole } => {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role
  };
};

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body as {
      name?: string;
      email?: string;
      password?: string;
      role?: UserRole;
    };

    if (!name?.trim() || !email?.trim() || !password) {
      res.status(400).json({ message: 'Name, email, and password are required' });
      return;
    }

    if (role !== undefined && !isValidRole(role)) {
      res.status(400).json({ message: 'Role must be either user or admin' });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      res.status(409).json({ message: 'A user with this email already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: role ?? 'user'
    });

    res.status(201).json({
      token: createToken(user.id, user.role),
      user: toAuthUser(user)
    });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body as {
      email?: string;
      password?: string;
    };

    if (!email?.trim() || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if (!user) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    res.json({
      token: createToken(user.id, user.role),
      user: toAuthUser(user)
    });
  } catch (error) {
    next(error);
  }
});

router.get('/me', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const user = await User.findById(req.user?.userId).select('-password');

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json(toAuthUser(user));
  } catch (error) {
    next(error);
  }
});

export default router;
