import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../config/database';
import { env } from '../config/env';
import { AppError } from '../shared/errors/AppError';

export class AuthService {
  static async register(userData: any) {
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email }
    });

    if (existingUser) {
      throw AppError.badRequest('El email ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(userData.password, env.BCRYPT_SALT_ROUNDS);

    const user = await prisma.user.create({
      data: {
        email: userData.email,
        password: hashedPassword,
        role: userData.role || 'USER'
      }
    });

    return this.generateTokens(user);
  }

  static async login(credentials: any) {
    const user = await prisma.user.findUnique({
      where: { email: credentials.email }
    });

    if (!user || !(await bcrypt.compare(credentials.password, user.password))) {
      throw AppError.unauthorized('Credenciales inválidas');
    }

    return this.generateTokens(user);
  }

  private static generateTokens(user: any) {
    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      env.JWT_ACCESS_SECRET,
      { expiresIn: env.JWT_ACCESS_EXPIRES_IN as any }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      env.JWT_REFRESH_SECRET,
      { expiresIn: env.JWT_REFRESH_EXPIRES_IN as any }
    );

    return { user: { id: user.id, email: user.email, role: user.role }, accessToken, refreshToken };
  }
}
