import { hash } from 'bcryptjs';
import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import User from '../models/Users';

interface Request {
  name: string;
  email: string;
  password: string;
}

class CreateUsersService {
  public async execute({ name, email, password }: Request): Promise<User> {
    const usersRepository = getRepository(User);

    const findUserByEmail = await usersRepository.findOne({ where: { email } });

    if (findUserByEmail) {
      throw new AppError('Email address already in use');
    }

    const encryptedPassword = await hash(password, 8);

    const user = usersRepository.create({
      name,
      email,
      password: encryptedPassword,
    });

    return usersRepository.save(user);
  }
}

export default CreateUsersService;
