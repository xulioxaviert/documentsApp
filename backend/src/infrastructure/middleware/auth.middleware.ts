import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'tu_semilla_super_secreta_1978';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    // @ts-ignore (Podemos extender el tipo Request para incluir los datos del user)
    req.user = decoded; 
    next(); // El token es válido, adelante
  } catch (error) {
    return res.status(403).json({ error: 'Token inválido o expirado.' });
  }
};