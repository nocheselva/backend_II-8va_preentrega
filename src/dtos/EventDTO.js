export class EventDTO {
  constructor(event) {
    this.id = event._id || event.id;
    this.title = event.title;
    this.description = event.description;
    this.date = event.date;
    this.capacity = event.capacity;
    this.available_tickets = event.available_tickets;
  }
}