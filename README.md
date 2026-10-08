# API REST de Gestión de Eventos (Event Management API)

API RESTful desarrollada con **Node.js**, **Express** y **MongoDB** (Mongoose) para la administración, organización y control de acceso a eventos. Implementa autenticación mediante **JWT**, control de acceso basado en roles (**RBAC**), paginación de resultados y validación de reglas de negocio en la capa de servicio/controlador.

---

## Tecnologías Utilizadas

- **Runtime:** Node.js
- **Framework Web:** Express.js
- **Base de Datos:** MongoDB & Mongoose ORM
- **Autenticación & Autorización:** Passport.js / JSON Web Tokens (JWT) / bcrypt
- **Paginación:** Mongoose Custom Pagination / `mongoose-paginate-v2`

---

## Roles y Permisos (RBAC)

La API implementa tres niveles de acceso según el rol del usuario autenticado:

| Rol | Permisos |
| :--- | :--- |
| `user` | Consultar la lista de eventos y obtener un evento por ID. No posee permisos de creación ni edición. |
| `organizer` | Permisos de `user` + crear nuevos eventos y modificar/actualizar únicamente los eventos que él haya creado. |
| `admin` | Permisos totales sobre el sistema: crear, modificar, actualizar o cancelar cualquier evento del catálogo. |

---

## Reglas de Negocio Implementadas

1. **Fecha Futura:** No se permite crear ni reprogramar eventos con fechas pasadas respecto a la fecha actual (`date >= Date.now()`).
2. **Capacidad Válida:** La capacidad mínima permitida debe ser estrictamente mayor a 0 (`capacity > 0`).
3. **Precio Válido:** El precio no puede ser un valor negativo (`price >= 0`).
4. **Bloqueo por Estado Cancelado:** Se prohíbe la modificación o actualización de eventos que hayan sido marcados previamente en estado `cancelled`.
5. **Propiedad de Modificación:** Un `organizer` solo puede modificar eventos asignados a su ID (`organizer === user._id`). Un `admin` tiene permiso universal para modificar cualquier evento.

---

## Endpoints de la API

### Autenticación y Sesiones (`/api/sessions`)

| Método | Ruta | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/sessions/register` | Público | Registro de nuevo usuario. |
| `POST` | `/api/sessions/login` | Público | Autenticación y generación de Token JWT (Cookie/Bearer). |
| `GET` | `/api/sessions/current` | Autenticado | Devuelve los datos del usuario logueado. |
| `POST` | `/api/sessions/logout` | Autenticado | Cierre de sesión y limpieza de credenciales. |

### Eventos (`/api/events`)

| Método | Ruta | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/events` | Público | Obtiene lista paginada de eventos con filtros opcionales. |
| `GET` | `/api/events/:id` | Público | Obtiene los detalles de un evento específico por ID. |
| `POST` | `/api/events` | `organizer`, `admin` | Crea un nuevo evento en el sistema. |
| `PUT` | `/api/events/:id` | Dueño / `admin` | Actualiza los datos de un evento existente. |
| `PATCH` | `/api/events/:id/status` | Dueño / `admin` | Modifica el estado de un evento (`draft`, `published`, `cancelled`, `finished`). |

#### Parámetros de Búsqueda y Paginación en `GET /api/events`:
- **`status`**: Filtrar por estado (`draft`, `published`, `cancelled`, `finished`).
- **`category`**: Filtrar por categoría.
- **`location`**: Búsqueda por ubicación (coincidencia parcial insensible a mayúsculas).
- **`dateFrom` / `dateTo`**: Filtro por rango de fechas (`YYYY-MM-DD`).
- **`page`**: Número de página (por defecto: `1`).
- **`limit`**: Cantidad de resultados por página (por defecto: `10`).

---

## Configuración e Instalación

### 1. Clonar el repositorio e instalar dependencias

```bash
git clone <URL_DEL_REPOSITORIO>
cd <NOMBRE_DEL_PROYECTO>
npm install