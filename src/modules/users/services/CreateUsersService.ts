import { injectable, inject } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entities/User';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import AppError from '@shared/errors/AppError';

interface IRequest {
  name: string;
  email: string;
  password: string;
}

@injectable()
class CreateUsersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ name, email, password }: IRequest): Promise<User> {
    const userEmailAlreadyTaken = await this.usersRepository.findByEmail(email);

    if (userEmailAlreadyTaken) {
      throw new AppError('Email address already in use');
    }

    const encryptedPassword = await this.hashProvider.generateHash(password);

    const user = await this.usersRepository.create({
      name,
      email,
      password: encryptedPassword,
    });

    return user;
  }
}

export default CreateUsersService;
