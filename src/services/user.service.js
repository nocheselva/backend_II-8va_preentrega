import { UserRepository } from '../repositories/user.repository.js';
import { UserDTO } from '../dtos/user.dto.js';
import { CustomError } from '../middleware/error.middleware.js';
import bcrypt from 'bcrypt'; // O la librería de hasheo que estés usando

export class UserService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async registerUser(userData) {
    const existingUser = await this.userRepository.getByEmail(userData.email);
    if (existingUser) {
      throw new CustomError('El email ya está registrado', 409);
    }

    // Hashear contraseña antes de guardar
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = await this.userRepository.createUser({
      ...userData,
      password: hashedPassword
    });

    return new UserDTO(newUser);
  }

  async getUserByEmail(email) {
    const user = await this.userRepository.getByEmail(email);
    if (!user) {
      throw new CustomError('Usuario no encontrado', 404);
    }
    return user;
  }

  async getUserCurrent(id) {
    const user = await this.userRepository.getById(id);
    if (!user) {
      throw new CustomError('Usuario no encontrado', 404);
    }
    // Devuelve los datos filtrados por el DTO sin contraseña
    return new UserDTO(user);
  }
}