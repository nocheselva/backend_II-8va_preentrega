import { TicketService } from '../services/TicketService.js';

const ticketService = new TicketService();

export class TicketsController {
  async create(req, res) {
    try {
      const { eid } = req.params;
      const { quantity } = req.body;
      const userId = req.user.id || req.user._id;

      const ticket = await ticketService.createTicket(userId, eid, quantity, req.user);
      return res.status(201).json({ status: 'success', payload: ticket });
    } catch (error) {
      return res.status(error.status || 500).json({ status: 'error', message: error.message });
    }
  }

  async cancel(req, res) {
    try {
      const { tid } = req.params;
      const ticket = await ticketService.cancelTicket(tid, req.user);
      return res.json({ status: 'success', message: 'Ticket cancelado correctamente', payload: ticket });
    } catch (error) {
      return res.status(error.status || 500).json({ status: 'error', message: error.message });
    }
  }

  async getMyTickets(req, res) {
    try {
      const userId = req.user.id || req.user._id;
      const tickets = await ticketService.getMyTickets(userId);
      return res.json({ status: 'success', payload: tickets });
    } catch (error) {
      return res.status(500).json({ status: 'error', message: error.message });
    }
  }

  async getEventTickets(req, res) {
    try {
      const { eid } = req.params;
      const tickets = await ticketService.getEventTickets(eid, req.user);
      return res.json({ status: 'success', payload: tickets });
    } catch (error) {
      return res.status(error.status || 500).json({ status: 'error', message: error.message });
    }
  }
}