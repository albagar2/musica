import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { asyncHandler } from '../shared/utils/asyncHandler';

export class AuthController {
  static register = asyncHandler(async (req: Request, res: Response) => {
    const result = await AuthService.register(req.body);
    res.status(201).json({
      success: true,
      data: result
    });
  });

  static login = asyncHandler(async (req: Request, res: Response) => {
    const result = await AuthService.login(req.body);
    res.json({
      success: true,
      data: result
    });
  });
}
