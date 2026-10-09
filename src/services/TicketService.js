import Ticket from '../models/Ticket.js';
import Event from '../models/Event.js'; // <- SIN llaves { }
import crypto from 'crypto';
import { sendTicketConfirmationEmail } from '../utils/mailer.js';

export class TicketService {
  // Crear Inscripción
  async createTicket(userId, eventId, quantity = 1, userDetails) {
    // 1. Validar cantidad positiva
    const qty = Number(quantity);
    if (!qty || qty < 1) {
      throw { status: 400, message: 'La cantidad (quantity) debe ser un número entero mayor a 0' };
    }

    // 2. Validar que el evento existe
    const event = await Event.findById(eventId);
    if (!event) {
      throw { status: 404, message: 'El evento solicitado no existe' };
    }

    // 3. Validar estado del evento
    if (event.status !== 'published') {
      throw { status: 400, message: 'No se pueden realizar inscripciones a un evento que no está publicado' };
    }

    const now = new Date();
    if (new Date(event.date) < now) {
      throw { status: 400, message: 'El evento ya ha finalizado o pasó la fecha de realización' };
    }

    // 4. Validar ticket activo duplicado
    const existingTicket = await Ticket.findOne({
      user: userId,
      event: eventId,
      status: { $in: ['confirmed', 'pending'] }
    });

    if (existingTicket) {
      throw { status: 400, message: 'Ya posees una inscripción activa para este evento' };
    }

    // 5. Calcular cupos ocupados (Ignorar los 'cancelled')
    const activeTickets = await Ticket.aggregate([
      { $match: { event: event._id, status: {$in: ['confirmed', 'pending'] } } },
      { $group: { _id: null, totalOccupied: { $sum: '$quantity' } } }
    ]);

    const currentOccupied = activeTickets[0]?.totalOccupied || 0;
    const availableCapacity = event.capacity - currentOccupied;

    if (qty > availableCapacity) {
      throw { status: 400, message: `Cupos insuficientes. Disponibles: ${availableCapacity}, solicitados: ${qty}` };
    }

    // 6. Generar ticket
    const reservationCode = 'TICK-' + crypto.randomBytes(4).toString('hex').toUpperCase();

    const newTicket = await Ticket.create({
      user: userId,
      event: eventId,
      quantity: qty,
      status: 'confirmed',
      reservationCode
    });

    // 7. Notificación asíncrona por email
    if (userDetails?.email) {
      sendTicketConfirmationEmail(
        userDetails.email,
        `${userDetails.first_name || ''} ${userDetails.last_name || ''}`.trim() || 'Usuario',
        event.title,
        reservationCode,
        qty
      );
    }

    return newTicket;
  }

  // Cancelar Ticket
  async cancelTicket(ticketId, user) {
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw { status: 404, message: 'Ticket no encontrado' };
    }

    if (ticket.status === 'cancelled') {
      throw { status: 400, message: 'El ticket ya se encuentra cancelado' };
    }

    // Permisos: Dueño del ticket o rol admin
    const isOwner = ticket.user.toString() === (user.id || user._id).toString();
    const isAdmin = user.role === 'admin';

    if (!isOwner && !isAdmin) {
      throw { status: 403, message: 'No tienes permisos para cancelar este ticket' };
    }

    ticket.status = 'cancelled';
    ticket.cancelledAt = new Date();
    await ticket.save();

    return ticket;
  }

  // Mis Tickets (Inscripciones del usuario autenticado)
  async getMyTickets(userId) {
    return await Ticket.find({ user: userId })
      .populate({
        path: 'event',
        select: 'title date location price'
      })
      .sort({ createdAt: -1 });
  }

  // Tickets de un Evento (Organizer de ese evento o Admin)
  async getEventTickets(eventId, user) {
    const event = await Event.findById(eventId);
    if (!event) {
      throw { status: 404, message: 'Evento no encontrado' };
    }

    const isOrganizerOwner = event.organizer?.toString() === (user.id || user._id).toString();
    const isAdmin = user.role === 'admin';

    if (!isOrganizerOwner && !isAdmin) {
      throw { status: 403, message: 'No tienes permisos para consultar los tickets de este evento' };
    }

    return await Ticket.find({ event: eventId })
      .populate('user', 'first_name last_name email')
      .sort({ createdAt: -1 });
  }
}