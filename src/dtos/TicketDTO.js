import { UserDTO } from './UserDTO.js';

export class TicketDTO {
  constructor(ticket) {
    this.id = ticket._id || ticket.id;
    this.event = ticket.event;
    this.status = ticket.status;
    this.createdAt = ticket.createdAt;
    
    // Si el usuario viene populado, lo pasamos por UserDTO para ocultar el password
    if (ticket.user) {
      this.user = typeof ticket.user === 'object' ? new UserDTO(ticket.user) : ticket.user;
    }
  }
}