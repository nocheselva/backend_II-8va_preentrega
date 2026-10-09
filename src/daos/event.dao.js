import { EventModel } from '../models/event.model.js';

export class EventDAO {
  async create(data) {
    return await EventModel.create(data);
  }

  async findById(id) {
    return await EventModel.findById(id).populate('organizer', 'first_name last_name email role');
  }

  async update(id, data) {
    return await EventModel.findByIdAndUpdate(id, data, { new: true });
  }

  async findWithFilters({ filters, page = 1, limit = 10, sort = 'date' }) {
    const skip = (page - 1) * limit;
    
    const sortOption = {};
    if (sort) {
      const field = sort.startsWith('-') ? sort.substring(1) : sort;
      const order = sort.startsWith('-') ? -1 : 1;
      sortOption[field] = order;
    }

    const [data, total] = await Promise.all([
      EventModel.find(filters)
        .populate('organizer', 'first_name last_name email')
        .sort(sortOption)
        .skip(skip)
        .limit(Number(limit)),
      EventModel.countDocuments(filters)
    ]);

    return {
      data,
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / limit)
    };
  }
}