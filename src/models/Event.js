// src/models/Event.js
import { Schema, model } from 'mongoose';

const eventSchema = new Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  date: { type: Date, required: true },
  location: { type: String, required: true, trim: true },
  capacity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0, default: 0 },
  status: { 
    type: String, 
    enum: ['draft', 'published', 'cancelled', 'finished'], 
    default: 'published' 
  },
  organizer: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }
}, { timestamps: true });

export const EventModel = model('Event', eventSchema);