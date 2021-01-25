import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';

import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let authenticateUser: AuthenticateUserService;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to authenticate a user', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456',
    });

    const authentication = await authenticateUser.execute({
      email: 'johndoe@gmail.com',
      password: '123456',
    });

    expect(authentication).toHaveProperty('token');
    expect(authentication).toHaveProperty('user.id');
    expect(authentication).toHaveProperty('user.name', 'John Doe');
    expect(authentication).toHaveProperty('user.email', 'johndoe@gmail.com');
  });

  it('should NOT be able user authentication with invalid email', async () => {
    await expect(
      authenticateUser.execute({
        email: 'wrongjohnemail@gmail.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should NOT be able user authentication with invalid password', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456',
    });

    await expect(
      authenticateUser.execute({
        email: 'johndoe@gmail.com',
        password: 'wrongjohnpassword',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
