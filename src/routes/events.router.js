import { Router } from 'express';
import passport from 'passport';
import { 
  createEvent, 
  getEvents, 
  getEventById, 
  updateEvent, 
  changeStatus 
} from '../controllers/events.controller.js';
import { TicketsController } from '../controllers/tickets.controller.js';
import { authorizeRoles } from '../middlewares/authorize.middleware.js';
import { checkEventOwnership } from '../middlewares/ownership.middleware.js';

const router = Router();
const ticketsController = new TicketsController();
const passportAuth = passport.authenticate('jwt', { session: false });

// --- Rutas de Eventos ---
router.post('/', passportAuth, authorizeRoles('organizer', 'admin'), createEvent);
router.get('/', getEvents);
router.get('/:id', getEventById);
router.put('/:id', passportAuth, authorizeRoles('organizer', 'admin'), checkEventOwnership, updateEvent);
router.patch('/:id/status', passportAuth, authorizeRoles('organizer', 'admin'), checkEventOwnership, changeStatus);

// --- Rutas de Tickets Anidados a Eventos (Pre-entrega 7) ---
// 1. Inscripción/Crear ticket (cualquier usuario autenticado)
router.post('/:eid/tickets', passportAuth, ticketsController.create);

// 2. Ver tickets de un evento (solo el organizador de ese evento o admin)
router.get('/:eid/tickets', passportAuth, authorizeRoles('organizer', 'admin'), ticketsController.getEventTickets);

export default router;