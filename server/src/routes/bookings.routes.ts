import { Router } from 'express';
import { Types } from 'mongoose';

import { AuthRequest, authMiddleware } from '../middleware/auth.middleware';
import { roleMiddleware } from '../middleware/role.middleware';
import { Booking } from '../models/Booking';
import { Event } from '../models/Event';

const router = Router();

const getParamId = (value: string | string[] | undefined): string | undefined => {
  return typeof value === 'string' ? value : undefined;
};

router.post('/', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const { eventId } = req.body as {
      eventId?: string;
    };

    if (!req.user) {
      res.status(401).json({ message: 'Authentication is required' });
      return;
    }

    if (!eventId || !Types.ObjectId.isValid(eventId)) {
      res.status(400).json({ message: 'A valid event id is required' });
      return;
    }

    const event = await Event.findById(eventId);

    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }

    if (event.availableSeats <= 0) {
      res.status(400).json({ message: 'No seats available for this event' });
      return;
    }

    const booking = await Booking.create({
      userId: new Types.ObjectId(req.user.userId),
      eventId: event._id,
      eventTitle: event.title,
      eventDate: event.date,
      quantity: 1,
      totalPrice: event.price,
      status: 'active'
    });

    event.availableSeats -= 1;
    await event.save();

    res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
});

router.get('/my', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication is required' });
      return;
    }

    const bookings = await Booking.find({
      userId: new Types.ObjectId(req.user.userId)
    }).sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    next(error);
  }
});

router.get('/', authMiddleware, roleMiddleware('admin'), async (_req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    next(error);
  }
});

router.patch('/:id/cancel', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const bookingId = getParamId(req.params.id);

    if (!req.user) {
      res.status(401).json({ message: 'Authentication is required' });
      return;
    }

    if (!bookingId || !Types.ObjectId.isValid(bookingId)) {
      res.status(400).json({ message: 'Invalid booking id' });
      return;
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      res.status(404).json({ message: 'Booking not found' });
      return;
    }

    if (req.user.role !== 'admin' && booking.userId.toString() !== req.user.userId) {
      res.status(403).json({ message: 'You do not have permission to cancel this booking' });
      return;
    }

    if (booking.status === 'cancelled') {
      res.status(400).json({ message: 'Booking is already cancelled' });
      return;
    }

    const event = await Event.findById(booking.eventId);

    booking.status = 'cancelled';
    await booking.save();

    if (event) {
      event.availableSeats += 1;
      await event.save();
    }

    res.json(booking);
  } catch (error) {
    next(error);
  }
});

export default router;
