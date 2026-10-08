import express from 'express';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import { initializePassport } from './config/passport.config.js';
import sessionsRouter from './routes/sessions.router.js';
import eventsRouter from './routes/events.router.js';
import usersRouter from './routes/users.router.js'; // 1. Importamos usersRouter arriba

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Inicialización de Passport
initializePassport();
app.use(passport.initialize());

// Rutas
app.use('/api/sessions', sessionsRouter);
app.use('/api/events', eventsRouter);
app.use('/api/users', usersRouter); // 2. Registramos la ruta de usuarios aquí

export default app; // 3. El export debe ir SIEMPRE al final de todo