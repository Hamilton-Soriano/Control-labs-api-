import express, { Request, Response } from 'express';
import cors from 'cors';
import apiRoutes from './routes';

const app = express();

app.use(cors());
app.use(express.json());

// Health Check Endpoint
app.get('/api/v1/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'ControlLabs API operando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Todas las rutas de la API se montan bajo /api/v1
app.use('/api/v1', apiRoutes);

export default app;