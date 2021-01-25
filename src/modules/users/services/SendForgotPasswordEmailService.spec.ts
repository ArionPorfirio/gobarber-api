import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '@modules/users/repositories/fakes/FakeUserTokensRepository';
import SendForgotPasswordEmailService from '@modules/users/services/SendForgotPasswordEmailService';

import AppError from '@shared/errors/AppError';
import FakeEmailProvider from '@shared/providers/EmailProvider/fakes/FakeEmailProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeEmailProvider: FakeEmailProvider;
let fakeUserTokensRepository: FakeUserTokensRepository;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeEmailProvider = new FakeEmailProvider();
    fakeUserTokensRepository = new FakeUserTokensRepository();

    sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeEmailProvider,
      fakeUserTokensRepository,
    );
  });

  it('should be able to recover password with email', async () => {
    const sendEmail = jest.spyOn(fakeEmailProvider, 'sendEmail');

    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456',
    });

    await sendForgotPasswordEmail.execute({
      email: 'johndoe@gmail.com',
    });

    expect(sendEmail).toHaveBeenCalled();
  });

  it('should NOT be able recover password of nonexistent user', async () => {
    await expect(
      sendForgotPasswordEmail.execute({
        email: 'invaliduseremail@gmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to generate forgot password token', async () => {
    const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456',
    });

    await sendForgotPasswordEmail.execute({ email: user.email });

    expect(generateToken).toHaveBeenCalledWith(user.id);
  });
});
