import { Router } from 'express';

import { container } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entities/Users';
import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';

const sessionsRouter = Router();

sessionsRouter.post('/', async (request, response) => {
  const { email, password } = request.body;

  const authenticateUserService = container.resolve(AuthenticateUserService);

  const {
    user,
    token,
  }: {
    user: Partial<User>;
    token: string;
  } = await authenticateUserService.execute({
    email,
    password,
  });

  delete user.password;

  return response.json({ user, token });
});

export default sessionsRouter;
