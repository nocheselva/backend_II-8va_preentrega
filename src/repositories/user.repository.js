import { UserDAO } from '../daos/user.dao.js';

export class UserRepository {
  constructor(dao = new UserDAO()) {
    this.dao = dao;
  }

  async getById(id) {
    return await this.dao.findById(id);
  }

  async getByEmail(email) {
    return await this.dao.findByEmail(email);
  }

  async createUser(userData) {
    return await this.dao.create(userData);
  }
}