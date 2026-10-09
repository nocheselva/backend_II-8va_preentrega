import dotenv from 'dotenv';
dotenv.config(); // <--- Debe ir aquí arriba, ANTES de importar app o mongoose

import mongoose from 'mongoose';
import app from './app.js';

const PORT = process.env.PORT || 8080;

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log('Conectado a MongoDB correctamente');
    
    app.listen(PORT, () => {
      console.log(`Servidor escuchando en el puerto ${PORT}`);
    });
  })
  .catch((err) => console.error('Error conectando a MongoDB:', err));

