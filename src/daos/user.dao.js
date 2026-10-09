import UserModel from '../models/user.model.js';

export class UserDAO {
  async findById(id) {
    return await UserModel.findById(id).lean();
  }

  async findByEmail(email) {
    return await UserModel.findOne({ email }).lean();
  }

  async create(userData) {
    return await UserModel.create(userData);
  }
}