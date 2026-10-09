import { UserDTO } from './user.dto.js';

export class TicketDTO {
  constructor(ticket) {
    this.id = ticket._id || ticket.id;
    this.event = ticket.event;
    this.status = ticket.status;
    this.createdAt = ticket.createdAt;
    
    if (ticket.user) {
      this.user = typeof ticket.user === 'object' ? new UserDTO(ticket.user) : ticket.user;
    }
  }
}