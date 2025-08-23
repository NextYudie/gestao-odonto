import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserModel } from '@/models/User';
import { ApiResponse, LoginRequest, LoginResponse, AuthTokenPayload } from '@/types';
import { validateLoginInput } from '@/utils/validation';

export class AuthController {
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password }: LoginRequest = req.body;

      // Validate input
      const validation = validateLoginInput({ email, password });
      if (!validation.isValid) {
        res.status(400).json({
          success: false,
          message: 'Dados de entrada inválidos',
          error: validation.errors.join(', ')
        } as ApiResponse);
        return;
      }

      // Find user by email
      const user = await UserModel.findByEmail(email);
      if (!user) {
        res.status(401).json({
          success: false,
          message: 'Credenciais inválidas'
        } as ApiResponse);
        return;
      }

      // Validate password
      const isValidPassword = await UserModel.validatePassword(password, user.password);
      if (!isValidPassword) {
        res.status(401).json({
          success: false,
          message: 'Credenciais inválidas'
        } as ApiResponse);
        return;
      }

      // Generate JWT token
      const tokenPayload: AuthTokenPayload = {
        userId: user.id,
        email: user.email,
        role: user.role
      };

      const token = jwt.sign(
        tokenPayload,
        process.env.JWT_SECRET!,
        { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
      );

      const refreshToken = jwt.sign(
        tokenPayload,
        process.env.JWT_REFRESH_SECRET!,
        { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
      );

      // Remove password from user object
      const { password: _, ...userResponse } = user;

      const response: LoginResponse = {
        user: userResponse,
        token,
        refreshToken,
        expires_in: process.env.JWT_EXPIRES_IN || '15m'
      };

      res.status(200).json({
        success: true,
        message: 'Login realizado com sucesso',
        data: response
      } as ApiResponse<LoginResponse>);

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      } as ApiResponse);
    }
  }

  static async me(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      
      const user = await UserModel.findById(userId);
      if (!user) {
        res.status(404).json({
          success: false,
          message: 'Usuário não encontrado'
        } as ApiResponse);
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Dados do usuário recuperados com sucesso',
        data: user
      } as ApiResponse);

    } catch (error) {
      console.error('Get user info error:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      } as ApiResponse);
    }
  }

  static async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      
      const user = await UserModel.findById(userId);
      if (!user) {
        res.status(404).json({
          success: false,
          message: 'Usuário não encontrado'
        } as ApiResponse);
        return;
      }

      // Generate new token
      const tokenPayload: AuthTokenPayload = {
        userId: user.id,
        email: user.email,
        role: user.role
      };

      const token = jwt.sign(
        tokenPayload,
        process.env.JWT_SECRET!,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      res.status(200).json({
        success: true,
        message: 'Token renovado com sucesso',
        data: {
          token,
          expires_in: process.env.JWT_EXPIRES_IN || '7d'
        }
      } as ApiResponse);

    } catch (error) {
      console.error('Refresh token error:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      } as ApiResponse);
    }
  }

  static async logout(req: Request, res: Response): Promise<void> {
    // In a real application, you might want to blacklist the token
    // For now, we'll just return a success message
    res.status(200).json({
      success: true,
      message: 'Logout realizado com sucesso'
    } as ApiResponse);
  }
}