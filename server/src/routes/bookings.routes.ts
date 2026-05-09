import { Router } from 'express';
import { Types } from 'mongoose';

import { AuthRequest, authMiddleware } from '../middleware/auth.middleware';
import { roleMiddleware } from '../middleware/role.middleware';
import { Booking } from '../models/Booking';
import { Event } from '../models/Event';

const router = Router();

router.get('/', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const query =
      req.user?.role === 'admin' ? {} : { userId: new Types.ObjectId(req.user?.userId) };
    const bookings = await Booking.find(query).sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    next(error);
  }
});

router.post('/', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const { eventId, quantity } = req.body as {
      eventId?: string;
      quantity?: number;
    };

    if (!req.user || !eventId || !quantity || quantity < 1) {
      res.status(400).json({ message: 'Event id and a valid quantity are required' });
      return;
    }

    const event = await Event.findById(eventId);

    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }

    if (quantity > event.capacity) {
      res.status(400).json({ message: 'Not enough seats available' });
      return;
    }

    const booking = await Booking.create({
      userId: new Types.ObjectId(req.user.userId),
      eventId: event._id,
      eventTitle: event.title,
      eventDate: event.date,
      quantity,
      totalPrice: event.price * quantity
    });

    event.capacity -= quantity;
    await event.save();

    res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      res.status(404).json({ message: 'Booking not found' });
      return;
    }

    if (req.user?.role !== 'admin' && booking.userId.toString() !== req.user?.userId) {
      res.status(403).json({ message: 'You do not have permission to view this booking' });
      return;
    }

    res.json(booking);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', authMiddleware, roleMiddleware('admin'), async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking) {
      res.status(404).json({ message: 'Booking not found' });
      return;
    }

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

export default router;
