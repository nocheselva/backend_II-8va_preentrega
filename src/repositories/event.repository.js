import { EventDAO } from '../daos/event.dao.js';

export class EventRepository {
  constructor(dao = new EventDAO()) {
    this.dao = dao;
  }

  async create(data) {
    return await this.dao.create(data);
  }

  async findById(id) {
    return await this.dao.findById(id);
  }

  async update(id, data) {
    return await this.dao.update(id, data);
  }

  async findWithFilters(params) {
    return await this.dao.findWithFilters(params);
  }
}