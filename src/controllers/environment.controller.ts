import { Request, Response } from 'express';

export class EnvironmentController {
  public static getEnvironments = (req: Request, res: Response): void => {
    // TODO: llamar al servicio y responder 200 con todos los ambientes y laboratorios.
    res.status(501).json({
      success: false,
      message: 'El listado de ambientes todavía no está implementado.'
    });
  };

  public static createEnvironment = (req: Request, res: Response): void => {
    // TODO: llamar al servicio con req.body (capacidad y ubicación) y responder 201.
    res.status(501).json({
      success: false,
      message: 'La creación de ambientes todavía no está implementada.'
    });
  };

  public static updateEnvironment = (req: Request, res: Response): void => {
    const { id } = req.params;
    // TODO: aplicar solo los campos presentes en req.body (ej. capacidad o estado operativo).
    res.status(501).json({
      success: false,
      message: `La actualización parcial del ambiente ${id} todavía no está implementada.`
    });
  };
}
