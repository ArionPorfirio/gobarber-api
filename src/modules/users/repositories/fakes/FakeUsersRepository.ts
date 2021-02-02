import { v4 as uuid } from 'uuid';

import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IFindAllProvidersDTO from '@modules/users/dtos/IFindAllProvidersDTO';
import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

class FakeUsersRepository implements IUsersRepository {
  private users: User[] = [];

  public async findAllProviders({
    except_user_id,
  }: IFindAllProvidersDTO): Promise<User[]> {
    let providers: User[];

    if (except_user_id) {
      providers = this.users.filter(user => user.id !== except_user_id);
    } else {
      providers = this.users;
    }

    return providers;
  }

  findByEmail(email: string): Promise<User | undefined> {
    const userByEmail = this.users.find(user => user.email === email);

    return new Promise((resolve, _) => resolve(userByEmail));
  }

  findById(id: string): Promise<User | undefined> {
    const userById = this.users.find(user => user.id === id);

    return new Promise((resolve, _) => resolve(userById));
  }

  create({ name, email, password }: ICreateUserDTO): Promise<User> {
    const user = new User();

    Object.assign(user, { id: uuid(), name, email, password });

    this.users.push(user);

    return new Promise((resolve, _) => resolve(user));
  }

  save(user: User): Promise<User> {
    const userIndex = this.users.findIndex(findUser => findUser.id === user.id);

    this.users[userIndex] = user;

    return new Promise((resolve, _) => resolve(user));
  }
}

export default FakeUsersRepository;
