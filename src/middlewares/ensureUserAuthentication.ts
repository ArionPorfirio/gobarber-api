import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import auth from '../config/auth';
import AppError from '../errors/AppError';

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function (
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const { authorization } = request.headers;

  if (!authorization) {
    throw new AppError('JSON Web Token is missing', 401);
  }

  const [, token] = authorization.split(' ');

  const { secret } = auth.jwt;

  try {
    const parsedToken = verify(token, secret);
    const { sub } = parsedToken as TokenPayload;

    request.user = { id: sub };

    next();
  } catch {
    throw new AppError('Invalid JSON Web Token', 401);
  }
}
