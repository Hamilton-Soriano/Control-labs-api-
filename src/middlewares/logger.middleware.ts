import { Request, Response, NextFunction } from 'express';

export const requestLogger = ( // Middleware para registrar las solicitudes entrantes
  req: Request, 
  res: Response, 
  next: NextFunction 
): void => { 
  const timestamp = new Date().toISOString(); // Obtener la fecha y hora actual en formato ISO
  console.log(`[AUDIT SENA] [${timestamp}] ${req.method} ${req.originalUrl}`); // Registrar el método HTTP y la URL de la solicitud
  next(); // Llamar a next() para pasar al siguiente middleware o ruta
};  