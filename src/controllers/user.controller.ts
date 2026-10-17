import { Request, Response } from 'express';

export class UserController {
  public static getUsers = (req: Request, res: Response): void => {
    // TODO: llamar al servicio de usuarios y responder 200 con el listado completo.
    res.status(501).json({
      success: false,
      message: 'El listado de usuarios todavía no está implementado.'
    });
  };

  public static createUser = (req: Request, res: Response): void => {
    // TODO: llamar al servicio con req.body (estudiante, docente o administrador) y responder 201.
    res.status(501).json({
      success: false,
      message: 'El registro de usuarios todavía no está implementado.'
    });
  };

  public static getUserById = (req: Request, res: Response): void => {
    const { id } = req.params;
    // TODO: pasar id a la operación de consulta y responder con el usuario encontrado (o 404).
    res.status(501).json({
      success: false,
      message: `La consulta del usuario ${id} todavía no está implementada.`
    });
  };

  public static updateUser = (req: Request, res: Response): void => {
    const { id } = req.params;
    // TODO: aplicar solo los campos presentes en req.body (rol, estado de cuenta o contraseña).
    res.status(501).json({
      success: false,
      message: `La actualización parcial del usuario ${id} todavía no está implementada.`
    });
  };

  public static deleteUser = (req: Request, res: Response): void => {
    const { id } = req.params;
    // TODO: marcar el usuario como eliminado (borrado lógico), sin borrar el registro.
    res.status(501).json({
      success: false,
      message: `La eliminación lógica del usuario ${id} todavía no está implementada.`
    });
  };
}
