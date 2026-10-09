import { Router } from 'express';
import { isAuthenticated } from '../middleware/auth.middleware.js'; // <- Se quitó la 's' final
import { authorizeRoles } from '../middleware/authorize.middleware.js';

const router = Router();

router.get('/', isAuthenticated, authorizeRoles('admin'), async (req, res) => {
  try {
    res.json({ status: 'success', payload: [] });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

export default router;