import { Router } from 'express';
import { TicketsController } from '../controllers/tickets.controller.js';
import { isAuthenticated } from '../middleware/auth.middleware.js'; // <- Se quitó la 's' final

const router = Router();
const controller = new TicketsController();

router.get('/my-tickets', isAuthenticated, controller.getMyTickets);
router.patch('/:tid/cancel', isAuthenticated, controller.cancel);

export default router;