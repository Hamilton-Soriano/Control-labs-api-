import { Request, Response } from 'express';

export class EquipmentController {
  public static getEquipment = (req: Request, res: Response): void => {
    const { environmentId } = req.query;
    // TODO: si llega environmentId filtrar por ambiente; si no, responder con todos los equipos.
    res.status(501).json({
      success: false,
      message: environmentId
        ? `La consulta de equipos del ambiente ${environmentId} todavía no está implementada.`
        : 'El listado de equipos todavía no está implementado.'
    });
  };

  public static createEquipment = (req: Request, res: Response): void => {
    // TODO: llamar al servicio con req.body (incluye environmentId del ambiente) y responder 201.
    res.status(501).json({
      success: false,
      message: 'El registro de equipos todavía no está implementado.'
    });
  };

  public static updateEquipment = (req: Request, res: Response): void => {
    const { id } = req.params;
    // TODO: aplicar solo los campos presentes en req.body (ej. estado técnico "en mantenimiento" o ubicación).
    res.status(501).json({
      success: false,
      message: `La actualización parcial del equipo ${id} todavía no está implementada.`
    });
  };
}
