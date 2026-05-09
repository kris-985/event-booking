import { Router } from 'express';
import { Types } from 'mongoose';

import { authMiddleware } from '../middleware/auth.middleware';
import { roleMiddleware } from '../middleware/role.middleware';
import { Event, IEvent } from '../models/Event';

const router = Router();

type EventPayload = Partial<Pick<
  IEvent,
  'title' | 'description' | 'location' | 'date' | 'price' | 'availableSeats' | 'imageUrl' | 'category'
>>;

const requiredEventFields: Array<keyof EventPayload> = [
  'title',
  'description',
  'location',
  'date',
  'price',
  'availableSeats',
  'imageUrl',
  'category'
];

const isMissing = (value: unknown): boolean => {
  return value === undefined || value === null || (typeof value === 'string' && value.trim() === '');
};

const validateEventPayload = (
  payload: EventPayload,
  requireAllFields: boolean
): string | undefined => {
  if (requireAllFields) {
    const missingFields = requiredEventFields.filter((field) => isMissing(payload[field]));

    if (missingFields.length > 0) {
      return `Missing required fields: ${missingFields.join(', ')}`;
    }
  }

  if (payload.date !== undefined && Number.isNaN(new Date(payload.date).getTime())) {
    return 'Date must be a valid date';
  }

  if (payload.price !== undefined && (typeof payload.price !== 'number' || payload.price < 0)) {
    return 'Price must be a number greater than or equal to 0';
  }

  if (
    payload.availableSeats !== undefined &&
    (!Number.isInteger(payload.availableSeats) || payload.availableSeats < 0)
  ) {
    return 'Available seats must be an integer greater than or equal to 0';
  }

  return undefined;
};

const toEventData = (payload: EventPayload): EventPayload => {
  return {
    ...payload,
    title: typeof payload.title === 'string' ? payload.title.trim() : payload.title,
    description:
      typeof payload.description === 'string' ? payload.description.trim() : payload.description,
    location: typeof payload.location === 'string' ? payload.location.trim() : payload.location,
    imageUrl: typeof payload.imageUrl === 'string' ? payload.imageUrl.trim() : payload.imageUrl,
    category: typeof payload.category === 'string' ? payload.category.trim() : payload.category
  };
};

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
    const eventId = req.params.id;

    if (typeof eventId !== 'string' || !Types.ObjectId.isValid(eventId)) {
      res.status(400).json({ message: 'Invalid event id' });
      return;
    }

    const event = await Event.findById(eventId);

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
    const payload = toEventData(req.body as EventPayload);
    const validationError = validateEventPayload(payload, true);

    if (validationError) {
      res.status(400).json({ message: validationError });
      return;
    }

    const event = await Event.create(payload);

    res.status(201).json(event);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', authMiddleware, roleMiddleware('admin'), async (req, res, next) => {
  try {
    const eventId = req.params.id;

    if (typeof eventId !== 'string' || !Types.ObjectId.isValid(eventId)) {
      res.status(400).json({ message: 'Invalid event id' });
      return;
    }

    const payload = toEventData(req.body as EventPayload);
    const validationError = validateEventPayload(payload, false);

    if (validationError) {
      res.status(400).json({ message: validationError });
      return;
    }

    const event = await Event.findByIdAndUpdate(eventId, payload, {
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
    const eventId = req.params.id;

    if (typeof eventId !== 'string' || !Types.ObjectId.isValid(eventId)) {
      res.status(400).json({ message: 'Invalid event id' });
      return;
    }

    const event = await Event.findByIdAndDelete(eventId);

    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
