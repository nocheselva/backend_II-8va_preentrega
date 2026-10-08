import { eventModel } from '../models/Event.js';

export const checkEventOwnership = async (req, res, next) => {
  try {
    const { id } = req.params;
    const event = await eventModel.findById(id);

    if (!event) {
      return res.status(404).json({ status: 'error', message: 'Evento no encontrado' });
    }

    // El admin puede modificar cualquier evento
    if (req.user?.role === 'admin') {
      req.event = event;
      return next();
    }

    // Obtenemos el ID del creador sin importar la clave usada
    const organizerId = event.organizer || event.createdBy || event.user;

    // Convertimos ambos IDs a string de forma segura
    const eventOwnerId = organizerId ? organizerId.toString() : null;
    const currentUserId = req.user?._id ? req.user._id.toString() : null;

    // Si es organizer y coincide el ID con el creador, lo dejamos pasar
    if (req.user?.role === 'organizer' && eventOwnerId && eventOwnerId === currentUserId) {
      req.event = event;
      return next();
    }

    // Si no coincide o es otro organizador, devuelve 403
    return res.status(403).json({
      status: 'error',
      message: 'No tenés permisos para modificar este evento'
    });
  } catch (error) {
    next(error);
  }
};