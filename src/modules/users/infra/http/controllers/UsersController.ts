import { Request, Response } from 'express';

import { container } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entities/User';
import CreateUsersService from '@modules/users/services/CreateUsersService';

class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body;

    const createUserService = container.resolve(CreateUsersService);

    const user: Partial<User> = await createUserService.execute({
      name,
      email,
      password,
    });

    delete user.password;

    return response.status(201).json(user);
  }
}

export default UsersController;
