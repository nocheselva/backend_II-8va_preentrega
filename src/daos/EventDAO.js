import EventModel from '../models/Event.js';

export class EventDAO {
  async findById(id) {
    return await EventModel.findById(id);
  }

  async findAll() {
    return await EventModel.find().lean();
  }

  async create(eventData) {
    return await EventModel.create(eventData);
  }

  async updateCapacity(id, delta) {
    return await EventModel.findByIdAndUpdate(
      id,
      { $inc: { available_tickets: delta } },
      { new: true }
    );
  }
}