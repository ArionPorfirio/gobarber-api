import 'reflect-metadata';

import express, { NextFunction, Request, Response } from 'express';
import 'express-async-error';

import '@shared/infra/typeorm';

import uploadConfig from '@config/upload';

import AppError from '@shared/errors/AppError';
import routes from '@shared/infra/http/routes';

const app = express();

app.use(express.json());
app.use('/files', express.static(uploadConfig.directory));
app.use(routes);

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  // eslint-disable-next-line no-console
  console.error(err.message);

  return response.status(500).json({
    status: 'error',
    message: 'Unknow server error',
  });
});

app.listen(3333, () => {
  // eslint-disable-next-line no-console
  console.log('🤘 Server running on http://localhost:3333');
});