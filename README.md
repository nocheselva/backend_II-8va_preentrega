#  Plataforma de Eventos e Inscripciones - Pre-entrega 4

Refactorización del sistema de autenticación centralizado incorporando **Passport.js** mediante estrategias modulares, manteniendo el contrato externo de la API y garantizando compatibilidad con JWT y cookies HTTP-Only.

---

##  Estrategias de Passport Implementadas

La lógica de autenticación se encuentra centralizada en `src/config/passport.config.js`:

1. **`register` (LocalStrategy):** Valida los campos requeridos (`first_name`, `last_name`, `email`, `password`), verifica la unicidad del correo electrónico en MongoDB y hashea la contraseña antes de persistir al usuario.
2. **`login` (LocalStrategy):** Valida las credenciales contra la base de datos de manera genérica. Tras la autenticación exitosa, el controlador genera el token JWT y setea la cookie `currentUser` (`HttpOnly`).
3. **`current` (JwtStrategy):** Extrae el token JWT desde la cookie `currentUser` mediante `cookieExtractor` y expone la información del usuario autenticado en `req.user`.

---

##  Escalabilidad y Futuras Estrategias (OAuth)

El archivo `src/config/passport.config.js` está estructurado de forma completamente modular. Esto permite agregar nuevos proveedores de autenticación externa (como **Google**, **GitHub** o **Facebook**) añadiendo sus respectivas estrategias dentro de dicho archivo sin necesidad de modificar `src/app.js` ni alterar las rutas existentes.

---

##  Endpoints de Sesión (`/api/sessions`)

| Método | Endpoint | Descripción | Requiere Cookie |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/sessions/register` | Registro de nuevo usuario (Passport 'register') | No |
| `POST` | `/api/sessions/login` | Login y emisión de cookie `currentUser` (Passport 'login') | No |
| `GET` | `/api/sessions/current` | Devuelve los datos del usuario logueado (Passport 'current') | Sí |
| `POST` | `/api/sessions/logout` | Elimina la cookie de sesión active | No |

---

##  Variables de Entorno

Consulta el archivo `.env.example` para configurar las variables necesarias:
- `PORT`: Puerto de ejecución del servidor Express.
- `MONGO_URI`: Cadena de conexión a MongoDB Atlas / Local.
- `JWT_SECRET`: Clave secreta para firmar y verificar tokens JWT.


---

## Matriz de Permisos y Autorización

| Acción | `user` | `organizer` | `admin` |
| :--- | :---: | :---: | :---: |
| Consultar eventos publicads | ✅ | ✅ | ✅ |
| Crear eventos | ❌ | ✅ | ✅ |
| Modificar/cancelar eventos propios | ❌ | ✅ | ✅ |
| Modificar cualquier evento | ❌ | ❌ | ✅ |
| Ver todos los usuarios (Ruta Admin) | ❌ | ❌ | ✅ |

### 🛑 Manejo Estándar de Errores de Acceso

* **`401 Unauthorized`**: Ocurre cuando la petición **no posee una sesion válida** (ausencia de cookie JWT o token expirado/inválido).
* **`403 Forbidden`**: Ocurre cuando el usuario **posee una sesion válida pero carece del rol necesario** o no es propietario del recurso solicitado.