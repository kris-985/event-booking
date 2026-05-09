import { Schema, model, type Document } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  description: string;
  location: string;
  date: Date;
  price: number;
  capacity: number;
  imageUrl: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    location: {
      type: String,
      required: true,
      trim: true
    },
    date: {
      type: Date,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    capacity: {
      type: Number,
      required: true,
      min: 0
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

export const Event = model<IEvent>('Event', eventSchema);
