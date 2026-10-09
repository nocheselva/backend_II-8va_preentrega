import { TicketRepository } from '../repositories/ticket.repository.js';
import { EventRepository } from '../repositories/event.repository.js';
import crypto from 'crypto';
import { sendTicketConfirmationEmail } from '../utils/mailer.js';

export class TicketService {
  constructor() {
    this.ticketRepository = new TicketRepository();
    this.eventRepository = new EventRepository();
  }

  async createTicket(userId, eventId, quantity = 1, userDetails) {
    const qty = Number(quantity);
    if (!qty || qty < 1) {
      throw { status: 400, message: 'La cantidad debe ser un número entero mayor a 0' };
    }

    const event = await this.eventRepository.findById(eventId);
    if (!event) {
      throw { status: 404, message: 'El evento solicitado no existe' };
    }

    if (event.status !== 'published') {
      throw { status: 400, message: 'No se pueden realizar inscripciones a un evento no publicado' };
    }

    if (new Date(event.date) < new Date()) {
      throw { status: 400, message: 'El evento ya ha finalizado' };
    }

    const existingTicket = await this.ticketRepository.findByUserAndEvent(userId, eventId);
    if (existingTicket) {
      throw { status: 400, message: 'Ya posees una inscripción activa para este evento' };
    }

    const reservationCode = 'TICK-' + crypto.randomBytes(4).toString('hex').toUpperCase();

    const newTicket = await this.ticketRepository.create({
      user: userId,
      event: eventId,
      quantity: qty,
      status: 'confirmed',
      reservationCode
    });

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

  async cancelTicket(ticketId, user) {
    const ticket = await this.ticketRepository.findById(ticketId);
    if (!ticket) {
      throw { status: 404, message: 'Ticket no encontrado' };
    }

    if (ticket.status === 'cancelled') {
      throw { status: 400, message: 'El ticket ya se encuentra cancelado' };
    }

    const isOwner = (ticket.user._id || ticket.user).toString() === (user.id || user._id).toString();
    const isAdmin = user.role === 'admin';

    if (!isOwner && !isAdmin) {
      throw { status: 403, message: 'No tienes permisos para cancelar este ticket' };
    }

    return await this.ticketRepository.updateStatus(ticketId, 'cancelled');
  }

  async getMyTickets(userId) {
    return await this.ticketRepository.findByUser(userId);
  }
}