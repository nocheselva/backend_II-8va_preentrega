import { EventRepository } from '../repositories/EventRepository.js';

const eventRepository = new EventRepository();

export class EventService {
  async createEvent(eventData, user) {
    const eventDate = new Date(eventData.date);
    if (isNaN(eventDate.getTime()) || eventDate < new Date()) {
      throw new Error('VALIDATION_ERROR: No se pueden crear eventos con fechas pasadas o inválidas.');
    }

    if (eventData.capacity <= 0) {
      throw new Error('VALIDATION_ERROR: La capacidad debe ser mayor a 0.');
    }
    if (eventData.price < 0) {
      throw new Error('VALIDATION_ERROR: El precio no puede ser negativo.');
    }

    const newEvent = {
      ...eventData,
      organizer: user._id || user.id
    };

    return await eventRepository.create(newEvent);
  }

  async getEvents({ status, category, location, dateFrom, dateTo, page = 1, limit = 10, sort }) {
    const filters = {};

    if (status) filters.status = status;
    if (category) filters.category = category;
    if (location) filters.location = { $regex: location, $options: 'i' };

    if (dateFrom || dateTo) {
      filters.date = {};
      if (dateFrom) filters.date.$gte = new Date(dateFrom);
      if (dateTo) filters.date.$lte = new Date(dateTo);
    }

    // Asegurar parseo numérico para paginación
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 10);

    const result = await eventRepository.findWithFilters({ 
      filters, 
      page: pageNum, 
      limit: limitNum, 
      sort 
    });

    // Si el repositorio devuelve { docs, total, ... }, estructurarlo según consigna:
    return {
      data: result.docs || result.data || result,
      page: pageNum,
      limit: limitNum,
      total: result.totalDocs || result.total || 0,
      totalPages: result.totalPages || Math.ceil((result.total || 0) / limitNum) || 1
    };
  }

  async getEventById(id) {
    const event = await eventRepository.findById(id);
    if (!event) {
      throw new Error('NOT_FOUND: Evento no encontrado.');
    }
    return event;
  }

  async updateEvent(id, updateData, user) {
    const event = await this.getEventById(id);

    const organizerId = event.organizer?._id 
      ? event.organizer._id.toString() 
      : event.organizer?.toString();

    const userId = user?._id ? user._id.toString() : user?.id?.toString();

    if (!organizerId || !userId) {
      throw new Error('FORBIDDEN: No se pudo verificar la identidad del usuario u organizador.');
    }

    if (user.role !== 'admin' && organizerId !== userId) {
      throw new Error('FORBIDDEN: No tenés permisos para modificar este evento.');
    }

    if (event.status === 'cancelled') {
      throw new Error('BUSINESS_ERROR: No se puede modificar un evento cancelado.');
    }

    if (updateData.date) {
      const newDate = new Date(updateData.date);
      if (isNaN(newDate.getTime()) || newDate < new Date()) {
        throw new Error('VALIDATION_ERROR: No se puede actualizar el evento a una fecha pasada.');
      }
    }

    if (updateData.status === 'published' && (event.status === 'finished' || event.status === 'cancelled')) {
      throw new Error('BUSINESS_ERROR: No se puede publicar un evento que ya está cancelado o finalizado.');
    }

    return await eventRepository.update(id, updateData);
  }

  async changeStatus(id, newStatus, user) {
    const event = await this.getEventById(id);

    const organizerId = event.organizer?._id 
      ? event.organizer._id.toString() 
      : event.organizer?.toString();

    const userId = user?._id ? user._id.toString() : user?.id?.toString();

    if (user.role !== 'admin' && organizerId !== userId) {
      throw new Error('FORBIDDEN: No tenés permisos para cambiar el estado de este evento.');
    }

    if (event.status === 'cancelled') {
      throw new Error('BUSINESS_ERROR: El evento ya se encuentra cancelado y no puede cambiar de estado.');
    }

    const validStatuses = ['draft', 'published', 'cancelled', 'finished'];
    if (!validStatuses.includes(newStatus)) {
      throw new Error('VALIDATION_ERROR: Estado no válido.');
    }

    return await eventRepository.update(id, { status: newStatus });
  }
}