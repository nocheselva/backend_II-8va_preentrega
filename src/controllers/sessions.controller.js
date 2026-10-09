import { generateToken } from '../utils/jwt.js';
import { UserDTO } from '../dtos/user.dto.js'; // <- Importar UserDTO

export class SessionsController {
  // Callback tras autenticación exitosa en 'register'
  async register(req, res) {
    const user = req.user;
    return res.status(201).json({
      status: 'success',
      payload: new UserDTO(user)
    });
  }

  // Genera JWT y establece la cookie HttpOnly
  async login(req, res) {
    const token = generateToken(req.user);

    res.cookie('currentUser', token, {
      httpOnly: true,
      maxAge: 3600000 // 1 hora
    });

    return res.json({
      status: 'success',
      message: 'Login correcto'
    });
  }

  // Retorna el usuario autenticado formateado con DTO
  async current(req, res) {
    if (!req.user) {
      return res.status(401).json({ status: 'error', message: 'No autenticado' });
    }

    const userDTO = new UserDTO(req.user);

    return res.json({
      status: 'success',
      payload: userDTO
    });
  }

  // Elimina la cookie activa
  async logout(req, res) {
    res.clearCookie('currentUser');
    return res.json({
      status: 'success',
      message: 'Sesión cerrada'
    });
  }
}