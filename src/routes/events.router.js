import { Router } from 'express';
import passport from 'passport';
import { 
  createEvent, 
  getEvents, 
  getEventById, 
  updateEvent, 
  changeStatus 
} from '../controllers/events.controller.js';
import { authorizeRoles } from '../middlewares/authorize.middleware.js';
import { checkEventOwnership } from '../middlewares/ownership.middleware.js';

const router = Router();
const passportAuth = passport.authenticate('jwt', { session: false });

router.post('/', passportAuth, authorizeRoles('organizer', 'admin'), createEvent);
router.get('/', getEvents);
router.get('/:id', getEventById);
router.put('/:id', passportAuth, authorizeRoles('organizer', 'admin'), checkEventOwnership, updateEvent);
router.patch('/:id/status', passportAuth, authorizeRoles('organizer', 'admin'), checkEventOwnership, changeStatus);

export default router;