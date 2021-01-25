import { Request, Response } from 'express';

import { container } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entities/User';
import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';

class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
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
  }
}

export default SessionsController;
