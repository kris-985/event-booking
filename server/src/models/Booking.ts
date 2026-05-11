import { Schema, model, Types, type Document } from 'mongoose';

export type BookingStatus = 'active' | 'cancelled';

export interface IBooking extends Document {
  userId: Types.ObjectId;
  eventId: Types.ObjectId;
  eventTitle: string;
  eventDate: Date;
  quantity: number;
  totalPrice: number;
  status: BookingStatus;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: true
    },
    eventTitle: {
      type: String,
      required: true,
      trim: true
    },
    eventDate: {
      type: Date,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0
    },
    status: {
      type: String,
      enum: ['active', 'cancelled'],
      default: 'active',
      required: true
    }
  },
  {
    timestamps: true
  }
);

export const Booking = model<IBooking>('Booking', bookingSchema);
