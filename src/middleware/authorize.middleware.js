export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    console.log('=== DEBUG AUTORIZACIÓN ===');
    console.log('Objeto req.user completo:', JSON.stringify(req.user, null, 2));

    if (!req.user) {
      return res.status(401).json({ status: 'error', message: 'No autenticado' });
    }

    const roles = allowedRoles.flat();
    
    // Intenta extraer el rol de cualquier nivel posible
    let userRole = req.user.role || req.user.user?.role || req.user._doc?.role;

    console.log('Rol extraído:', userRole);
    console.log('Roles autorizados:', roles);

    if (!userRole || !roles.includes(userRole)) {
      console.log('--> RECHAZADO: El rol no coincide');
      return res.status(403).json({ status: 'error', message: 'No tenés permisos para realizar esta acción' });
    }

    console.log('--> AUTORIZADO EXITOSAMENTE');
    next();
  };
};

export const authorize = authorizeRoles;