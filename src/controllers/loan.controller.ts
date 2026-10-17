import { Request, Response } from 'express';

export class LoanController {
  public static createLoan = (req: Request, res: Response): void => {
    // TODO: llamar al servicio con req.body y responder 201 con el préstamo creado.
    res.status(501).json({
      success: false,
      message: 'El registro de préstamos todavía no está implementado.'
    });
  };

  public static getLoansByFilter = (req: Request, res: Response): void => {
    // TODO: tomar los filtros de req.query, llamar al servicio y responder con los resultados.
    res.status(501).json({
      success: false,
      message: 'La consulta del historial todavía no está implementada.'
    });
  };

  public static getLoanById = (req: Request, res: Response): void => {
    const { id } = req.params;
    // TODO: pasar id a la operación de consulta y responder con el préstamo encontrado.
    res.status(501).json({
      success: false,
      message: `La consulta del préstamo ${id} todavía no está implementada.`
    });
  };

  public static acceptLoanInventory = (req: Request, res: Response): void => {
    const { id } = req.params;
    // TODO: pasar id a la operación de aceptación y responder con el resultado.
    res.status(501).json({
      success: false,
      message: `La aceptación del préstamo ${id} todavía no está implementada.`
    });
  };
}   

// El error 501 Not Implemented indica que el servidor todavia no ha hecho la implementación de la funcionalidad solicitada. 
// Es un código de estado HTTP que se utiliza para indicar que el servidor no puede cumplir con la solicitud porque no tiene la capacidad de hacerlo en ese momento. 
// En este caso, se está utilizando para indicar que las operaciones relacionadas con los préstamos aún no han sido implementadas en el controlador.