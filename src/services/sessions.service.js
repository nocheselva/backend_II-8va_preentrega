import { UserRepository } from '../repositories/user.repository.js';
import { UserDTO } from '../dtos/user.dto.js';
import { createHash, isValidPassword } from '../utils/hash.js';

export class SessionsService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async registerUser(userData) {
    const { first_name, last_name, email, password } = userData;

    const existingUser = await this.userRepository.getByEmail(email);
    if (existingUser) {
      throw new Error('El email ya se encuentra registrado');
    }

    const hashedPassword = createHash(password);

    const newUser = await this.userRepository.createUser({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      role: 'user'
    });

    return new UserDTO(newUser);
  }

  async loginUser(email, password) {
    const user = await this.userRepository.getByEmail(email);

    if (!user) return null;

    const validPassword = isValidPassword(password, user.password);
    if (!validPassword) return null;

    return user;
  }
}