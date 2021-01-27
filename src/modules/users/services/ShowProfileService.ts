import { inject, injectable } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import AppError from '@shared/errors/AppError';

interface IRequest {
  user_id: string;
}

@injectable()
class ShowProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ user_id }: IRequest): Promise<User> {
    const userProfile = await this.usersRepository.findById(user_id);

    if (!userProfile) {
      throw new AppError(
        'It was not possible to show user profile for the given id',
      );
    }

    return userProfile;
  }
}

export default ShowProfileService;
