import { inject, injectable } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entities/User';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import AppError from '@shared/errors/AppError';

interface IRequest {
  user_id: string;
  name: string;
  email: string;
  password?: string;
  old_password?: string;
}

@injectable()
class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    user_id,
    name,
    email,
    password,
    old_password,
  }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError(
        'It was not possible update profile with given user id',
      );
    }

    const userEmailAlreadyTaken = await this.usersRepository.findByEmail(email);

    if (userEmailAlreadyTaken && userEmailAlreadyTaken.id !== user_id) {
      throw new AppError(
        'It was not possible to update profile. The given email is already taken.',
      );
    }

    if (password) {
      if (!old_password) {
        throw new AppError(
          'It is not possible update password without the old one',
        );
      }

      const oldPasswordMatchesCurrent = await this.hashProvider.compareHash(
        old_password,
        user.password,
      );

      if (!oldPasswordMatchesCurrent) {
        throw new AppError('Incorrect old passsword');
      }

      user.password = await this.hashProvider.generateHash(password);
    }

    user.name = name;
    user.email = email;

    return this.usersRepository.save(user);
  }
}

export default UpdateProfileService;
