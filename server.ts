import 'dotenv/config'; // Forma recomendada en TS para reemplazar require('dotenv').config()
import app from './src/app';
import { database } from './src/config/database';

const PORT = process.env.PORT || 5000;

database.query('SELECT 1')
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Servidor ControlLabs corriendo en http://localhost:${PORT}`);
    });
  })
  .catch(async (error: unknown) => {
    console.error('No se pudo establecer conexión con PostgreSQL:', error);
    try {
      await database.end();
    } catch (shutdownError) {
      console.error('No se pudo cerrar el pool de PostgreSQL:', shutdownError);
    }
    process.exitCode = 1;
  });
