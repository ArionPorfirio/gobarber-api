import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import CreateUsersService from '@modules/users/services/CreateUsersService';

import AppError from '@shared/errors/AppError';

describe('CreateUserService', () => {
  it('should be able to create a new user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const createUserService = new CreateUsersService(fakeUsersRepository);

    const userData = {
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456',
    };

    const user = await createUserService.execute(userData);

    expect(user).toMatchObject({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
    });
  });

  it('should NOT be able to create users with same email', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const createUserService = new CreateUsersService(fakeUsersRepository);

    const userData = {
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456',
    };

    await createUserService.execute(userData);

    await expect(createUserService.execute(userData)).rejects.toBeInstanceOf(
      AppError,
    );
  });
});
