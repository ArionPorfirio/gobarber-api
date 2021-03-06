import { NextFunction, Request, Response } from 'express';

import { verify } from 'jsonwebtoken';

import authConfig from '@config/auth';

import AppError from '@shared/errors/AppError';

interface ITokenPayload {
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

  const { secret } = authConfig.jwt;

  try {
    const parsedToken = verify(token, secret);
    const { sub } = parsedToken as ITokenPayload;

    request.user = { id: sub };

    next();
  } catch {
    throw new AppError('Invalid JSON Web Token', 401);
  }
}
