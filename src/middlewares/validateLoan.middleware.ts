import { Request, Response, NextFunction } from 'express'; // Importar los tipos Request, Response y NextFunction de Express
import { ICreateLoanDTO } from '../dtos/loan.dto'; // Importar la interfaz ICreateLoanDTO desde el archivo loan.dto.ts

const isCreateLoanDTO = (value: unknown): value is ICreateLoanDTO => { // Función de tipo que verifica si un valor es del tipo ICreateLoanDTO
    if (typeof value !== 'object' || value === null || Array.isArray(value)) { // Verificar si el valor no es un objeto, es nulo o es un array
        return false;
    } 

    const loan = value as Record<string, unknown>; // Convertir el valor a un objeto genérico para acceder a sus propiedades
    return (
        typeof loan.aula === 'string' && loan.aula.trim() !== '' && // Verificar si la propiedad 'aula' es una cadena no vacía
        typeof loan.numeroPC === 'number' && Number.isInteger(loan.numeroPC) && // Verificar si la propiedad 'numeroPC' es un número entero
        typeof loan.nombreGuardaEntrega === 'string' && loan.nombreGuardaEntrega.trim() !== '' && // Verificar si la propiedad 'nombreGuardaEntrega' es una cadena no vacía
        typeof loan.instructorRecibe === 'string' && loan.instructorRecibe.trim() !== '' // Verificar si la propiedad 'instructorRecibe' es una cadena no vacía
    );
};

export const validateLoanPayload = ( // Middleware para validar el payload de un préstamo
    req: Request, // Solicitud entrante
    res: Response, // Respuesta a enviar
    next: NextFunction // Función para pasar al siguiente middleware o ruta
): void => {
    const body: unknown = req.body; // Obtener el cuerpo de la solicitud como un valor desconocido
    if (!isCreateLoanDTO(body)) { // Verificar si el cuerpo de la solicitud no es del tipo ICreateLoanDTO
        res.status(400).json({ // Enviar una respuesta con estado 400 (Bad Request) y un mensaje de error
            success: false, // Indicar que la solicitud no fue exitosa
            error: 'Datos del préstamo inválidos.' // Mensaje de error indicando que los datos del préstamo son inválidos
        }); 
        return; // Salir del middleware sin llamar a next() para evitar que la solicitud continúe
    }
    next(); // Llamar a next() para pasar al siguiente middleware o ruta si la validación es exitosa
};