import { Router } from 'express';

import { authMiddleware } from '../middleware/auth.middleware';
import { roleMiddleware } from '../middleware/role.middleware';
import { Event } from '../models/Event';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const events = await Event.find().sort({ date: 1 });

    res.json(events);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }

    res.json(event);
  } catch (error) {
    next(error);
  }
});

router.post('/', authMiddleware, roleMiddleware('admin'), async (req, res, next) => {
  try {
    const event = await Event.create(req.body);

    res.status(201).json(event);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', authMiddleware, roleMiddleware('admin'), async (req, res, next) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }

    res.json(event);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', authMiddleware, roleMiddleware('admin'), async (req, res, next) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

export default router;
