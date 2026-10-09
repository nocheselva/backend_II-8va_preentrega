import TicketModel from '../models/Ticket.js';

export class TicketDAO {
  async findById(id) {
    return await TicketModel.findById(id).populate('user').populate('event');
  }

  async findByUserAndEvent(userId, eventId) {
    return await TicketModel.findOne({ user: userId, event: eventId, status: 'active' });
  }

  async findByUser(userId) {
    return await TicketModel.find({ user: userId }).populate('event').lean();
  }

  async create(ticketData) {
    return await TicketModel.create(ticketData);
  }

  async updateStatus(id, status) {
    return await TicketModel.findByIdAndUpdate(id, { status }, { new: true });
  }
}