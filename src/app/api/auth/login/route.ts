import prisma from '../../../lib/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { tryResponseFunction, catchResponseFunction } from '../../../lib/response_function';
import { convertJwtExpirationToSeconds } from '../../../lib/jwtUtils';
import { loginValidator } from './loginValidator';

export async function POST(req: Request) {
  try {
    // Parse and validate request body
    const body = await req.json();
    const { email, password } = await loginValidator.parseAsync(body);

    // Find admin by email
    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      return tryResponseFunction({ message: 'Invalid email' }, 404);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return tryResponseFunction({ message: 'Invalid password' }, 401);
    }

    // Validate JWT configuration
    const jwtSecret = process.env.JWT_SECRET;
    const jwtExpiration = process.env.JWT_EXPIRATION;

    if (!jwtSecret || !jwtExpiration) {
      throw new Error('JWT_SECRET or JWT_EXPIRATION is not defined in environment variables.');
    }

    if (typeof jwtSecret !== 'string' || typeof jwtExpiration !== 'string') {
      throw new Error('JWT_SECRET and JWT_EXPIRATION must be strings.');
    }

    // Generate JWT token
    const expiresInSeconds = convertJwtExpirationToSeconds(jwtExpiration) || 3600; // Default to 1 hour
    const token = jwt.sign(
      { adminId: admin.id, email: admin.email },
      jwtSecret,
      { expiresIn: expiresInSeconds }
    );

    // Return response
    return tryResponseFunction(
      {
        token,
        adminId: admin.id,
        message: 'Login successful',
      },
      200
    );
  } catch (error) {
    return catchResponseFunction(error, 'Error logging in admin');
  }
}