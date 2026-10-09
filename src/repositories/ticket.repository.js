import { TicketDAO } from '../daos/ticket.dao.js';

export class TicketRepository {
  constructor(dao = new TicketDAO()) {
    this.dao = dao;
  }

  async findById(id) {
    return await this.dao.findById(id);
  }

  async findByUserAndEvent(userId, eventId) {
    return await this.dao.findByUserAndEvent(userId, eventId);
  }

  async findByUser(userId) {
    return await this.dao.findByUser(userId);
  }

  async create(ticketData) {
    return await this.dao.create(ticketData);
  }

  async updateStatus(id, status) {
    return await this.dao.updateStatus(id, status);
  }
}