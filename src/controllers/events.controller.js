import { eventModel } from '../models/Event.js';

// GET /api/events
export const getEvents = async (req, res, next) => {
  try {
    const events = await eventModel.find();
    res.json({ status: 'success', payload: events });
  } catch (error) {
    next(error);
  }
};

// POST /api/events
export const createEvent = async (req, res, next) => {
  try {
    const { title, description, date, capacity } = req.body;
    
    // Creamos el evento asignando el organizador autenticado
    const newEvent = await eventModel.create({
      title,
      description,
      date,
      capacity,
      organizer: req.user._id || req.user.id
    });

    res.status(201).json({ status: 'success', payload: newEvent });
  } catch (error) {
    next(error);
  }
};

// PUT /api/events/:id
export const updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedEvent = await eventModel.findByIdAndUpdate(id, req.body, { new: true });
    
    res.json({ status: 'success', payload: updatedEvent });
  } catch (error) {
    next(error);
  }
};