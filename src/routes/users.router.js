import { Router } from 'express';
import { isAuthenticated } from '../middlewares/auth.middlewares.js';
import { authorize } from '../middlewares/authorize.middleware.js'; // <- Se quitó la 'tion'

const router = Router();

// GET /api/users
router.get('/', isAuthenticated, authorize(['admin']), async (req, res) => {
  try {
    // Código para obtener los usuarios
    res.json({ status: 'success', payload: [] });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

export default router;