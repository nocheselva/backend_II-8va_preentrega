# Backend II - 7ma Pre-Entrega: Sistema de Eventos y Tickets

Este proyecto es una API REST desarrollada con **Node.js**, **Express**, **MongoDB (Mongoose)** y **Nodemailer**, diseñada para la gestión de eventos, reserva de tickets y autenticación de usuarios.

---

## Tecnologías Utilizadas

* **Entorno de Ejecución:** Node.js
* **Framework Web:** Express.js
* **Base de Datos:** MongoDB & Mongoose
* **Autenticación:** JWT / Sessions & Cookies
* **Envío de Correos:** Nodemailer
* **Herramienta de Pruebas:** Postman
* **Passport.js** & **JSON Web Tokens (JWT)** (con cookies `HttpOnly`)
* **Bcrypt** para encriptación de contraseñas
* **Nodemon** para entorno de desarrollo

---

##  Configuración del Entorno

1. **Clonar el repositorio e instalar dependencias:**
   ```bash
   npm install

---

## Estructura del Proyecto

```text
src/
├── config/         # Configuración de Passport y estrategias de autenticación
├── controllers/    # Manejo de peticiones HTTP y respuestas
├── daos/           # Persistencia de datos con Mongoose
├── dtos/           # Transformación y filtrado de datos expuestos (UserDTO)
├── middleware/     # Autenticación, autorización por rol y ownership
├── models/         # Esquemas de Mongoose
├── repositories/   # Abstracción entre la capa de negocio y la persistencia
├── routes/         # Definición de endpoints de la aplicación
├── services/       # Lógica de negocio principal
├── utils/          # Utilidades (JWT, Bcrypt, helpers)
├── app.js          # Configuración e inicialización de Express
└── server.js       # Punto de entrada y conexión a MongoDB