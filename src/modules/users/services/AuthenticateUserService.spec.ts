import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';
import CreateUsersService from '@modules/users/services/CreateUsersService';

import AppError from '@shared/errors/AppError';

describe('AuthenticateUser', () => {
  it('should be able to authenticate a user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUserService = new CreateUsersService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const userData = {
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456',
    };

    await createUserService.execute(userData);

    const authenticateUserService = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const authentication = await authenticateUserService.execute({
      email: userData.email,
      password: userData.password,
    });

    expect(authentication).toHaveProperty('token');
    expect(authentication).toHaveProperty('user.id');
    expect(authentication).toHaveProperty('user.name', userData.name);
    expect(authentication).toHaveProperty('user.email', userData.email);
  });

  it('should NOT be able user authentication with invalid email', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const authenticateUserService = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    await expect(
      authenticateUserService.execute({
        email: 'wrongjohnemail@gmail.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should NOT be able user authentication with invalid password', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUserService = new CreateUsersService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const userData = {
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456',
    };

    await createUserService.execute(userData);

    const authenticateUserService = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    await expect(
      authenticateUserService.execute({
        email: userData.email,
        password: 'wrongjohnpassword',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
