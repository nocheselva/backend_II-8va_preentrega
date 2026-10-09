import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy } from 'passport-jwt';
import User from '../models/user.model.js';
import { createHash, isValidPassword } from '../utils/hash.js';
import { cookieExtractor } from '../utils/jwtExtractor.js';

export const initializePassport = () => {
  // 1. Estrategia de Registro ('register')
  passport.use(
    'register',
    new LocalStrategy(
      { usernameField: 'email', passReqToCallback: true },
      async (req, email, password, done) => {
        try {
          const { first_name, last_name, role } = req.body;

          if (!first_name || !last_name || !email || !password) {
            return done(null, false, { message: 'Faltan campos obligatorios' });
          }

          const existingUser = await User.findOne({ email });
          if (existingUser) {
            return done(null, false, { message: 'El usuario ya existe' });
          }

          // Permitir el rol del req.body si es válido, si no por defecto 'user'
          const validRoles = ['user', 'organizer', 'admin'];
          const userRole = validRoles.includes(role) ? role : 'user';

          const newUser = await User.create({
            first_name,
            last_name,
            email,
            password: createHash(password),
            role: userRole
          });

          return done(null, newUser);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // 2. Estrategia de Login ('login')
  passport.use(
    'login',
    new LocalStrategy(
      { usernameField: 'email' },
      async (email, password, done) => {
        try {
          const user = await User.findOne({ email });
          if (!user) {
            return done(null, false, { message: 'Credenciales inválidas' });
          }

          const isValid = isValidPassword(password, user.password);
          if (!isValid) {
            return done(null, false, { message: 'Credenciales inválidas' });
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // 3. Estrategia JWT ('current' y 'jwt')
  const jwtStrategyConfig = new JwtStrategy(
    {
      jwtFromRequest: cookieExtractor,
      secretOrKey: process.env.JWT_SECRET || 'secretkey'
    },
    async (jwt_payload, done) => {
      try {
        // Consultar el usuario actualizado de la DB para garantizar que tenga el rol más reciente
        const userId = jwt_payload.id || jwt_payload._id || jwt_payload.user?._id || jwt_payload.user?.id;
        if (userId) {
          const dbUser = await User.findById(userId).lean();
          if (dbUser) {
            return done(null, {
              id: dbUser._id.toString(),
              _id: dbUser._id.toString(),
              email: dbUser.email,
              role: dbUser.role,
              first_name: dbUser.first_name,
              last_name: dbUser.last_name
            });
          }
        }
        return done(null, jwt_payload);
      } catch (error) {
        return done(error);
      }
    }
  );

  // La registramos con ambos nombres para evitar errores
  passport.use('current', jwtStrategyConfig);
  passport.use('jwt', jwtStrategyConfig);
};