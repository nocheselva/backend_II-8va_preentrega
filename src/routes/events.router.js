
import { Router } from 'express';
import { isAuthenticated } from '../middlewares/auth.middlewares.js';
import { authorizeRoles } from '../middlewares/authorize.middleware.js';
import { checkEventOwnership } from '../middlewares/ownership.middleware.js';
import { createEvent, updateEvent, getEvents } from '../controllers/events.controller.js';

const router = Router();

// Pública (Consultar eventos)
router.get('/', getEvents);

// Protegida: Solo organizer y admin pueden crear eventos
router.post('/', isAuthenticated, authorizeRoles('organizer', 'admin'), createEvent);

// Protegida con validación de propiedad
router.put('/:id', isAuthenticated, authorizeRoles('organizer', 'admin'), checkEventOwnership, updateEvent);

export default router;