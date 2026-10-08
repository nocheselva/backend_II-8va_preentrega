import { EventModel } from '../models/Event.js'; // Nombre correcto de exportación

export const checkEventOwnership = async (req, res, next) => {
  try {
    const { id } = req.params;
    const event = await EventModel.findById(id);

    if (!event) {
      return res.status(404).json({ status: 'error', message: 'Evento no encontrado' });
    }

    if (req.user?.role === 'admin') {
      req.event = event;
      return next();
    }

    const organizerId = event.organizer?.toString();
    const currentUserId = req.user?._id?.toString() || req.user?.id?.toString();

    if (req.user?.role === 'organizer' && organizerId === currentUserId) {
      req.event = event;
      return next();
    }

    return res.status(403).json({
      status: 'error',
      message: 'No tenés permisos para modificar este evento'
    });
  } catch (error) {
    next(error);
  }
};