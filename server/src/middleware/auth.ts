import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthTokenPayload, ApiResponse } from '@/types';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: AuthTokenPayload;
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Token de acesso requerido'
    } as ApiResponse);
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthTokenPayload;
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        message: 'Token expirado'
      } as ApiResponse);
      return;
    }

    if (error instanceof jwt.JsonWebTokenError) {
      res.status(403).json({
        success: false,
        message: 'Token inválido'
      } as ApiResponse);
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    } as ApiResponse);
  }
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Usuário não autenticado'
      } as ApiResponse);
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: 'Acesso negado. Permissões insuficientes'
      } as ApiResponse);
      return;
    }

    next();
  };
};

// Middleware to check if user is admin
export const requireAdmin = authorizeRoles('admin');

// Middleware to check if user is doctor or admin
export const requireDoctor = authorizeRoles('admin', 'doctor');

// Middleware to check if user is staff (any role except patient)
export const requireStaff = authorizeRoles('admin', 'doctor', 'nurse', 'receptionist');