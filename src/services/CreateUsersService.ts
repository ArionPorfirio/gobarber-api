import { getRepository } from 'typeorm';
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
      throw new Error('Email address already in use');
    }

    const createUser = usersRepository.create({ name, email, password });

    return usersRepository.save(createUser);
  }
}

export default CreateUsersService;
