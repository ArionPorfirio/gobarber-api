import { Request, Response } from 'express';

import { classToClass } from 'class-transformer';
import { container } from 'tsyringe';

import CreateUsersService from '@modules/users/services/CreateUsersService';

class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body;

    const createUserService = container.resolve(CreateUsersService);

    const user = await createUserService.execute({
      name,
      email,
      password,
    });

    return response.status(201).json(classToClass(user));
  }
}

export default UsersController;
