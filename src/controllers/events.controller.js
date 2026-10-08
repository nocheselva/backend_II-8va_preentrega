// src/controllers/events.controller.js
import { EventService } from '../services/EventService.js';

const eventService = new EventService();

export const createEvent = async (req, res) => {
  try {
    const event = await eventService.createEvent(req.body, req.user);
    res.status(201).json({ status: 'success', payload: event });
  } catch (error) {
    if (error.message.startsWith('VALIDATION_ERROR')) {
      return res.status(400).json({ status: 'error', message: error.message.replace('VALIDATION_ERROR: ', '') });
    }
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getEvents = async (req, res) => {
  try {
    const result = await eventService.getEvents(req.query);
    res.json({ status: 'success', ...result });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getEventById = async (req, res) => {
  try {
    const event = await eventService.getEventById(req.params.id);
    res.json({ status: 'success', payload: event });
  } catch (error) {
    if (error.message.startsWith('NOT_FOUND')) {
      return res.status(404).json({ status: 'error', message: error.message.replace('NOT_FOUND: ', '') });
    }
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const updated = await eventService.updateEvent(req.params.id, req.body, req.user);
    res.json({ status: 'success', payload: updated });
  } catch (error) {
    if (error.message.startsWith('FORBIDDEN')) {
      return res.status(403).json({ status: 'error', message: error.message.replace('FORBIDDEN: ', '') });
    }
    if (error.message.startsWith('BUSINESS_ERROR')) {
      return res.status(400).json({ status: 'error', message: error.message.replace('BUSINESS_ERROR: ', '') });
    }
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const changeStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await eventService.changeStatus(req.params.id, status, req.user);
    res.json({ status: 'success', payload: updated });
  } catch (error) {
    if (error.message.startsWith('FORBIDDEN')) {
      return res.status(403).json({ status: 'error', message: error.message.replace('FORBIDDEN: ', '') });
    }
    if (error.message.startsWith('BUSINESS_ERROR')) {
      return res.status(400).json({ status: 'error', message: error.message.replace('BUSINESS_ERROR: ', '') });
    }
    res.status(500).json({ status: 'error', message: error.message });
  }
};