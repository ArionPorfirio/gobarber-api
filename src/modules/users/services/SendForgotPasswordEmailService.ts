import path from 'path';

import { inject, injectable } from 'tsyringe';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';

import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import AppError from '@shared/errors/AppError';

interface IRequest {
  email: string;
}

@injectable()
class SendForgotPasswordEmailService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('MailProvider')
    private mailProvider: IMailProvider,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,
  ) {}

  public async execute({ email }: IRequest): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError(
        'E-mail inválido. Nenhum usuário foi cadastrado com esse email.',
      );
    }

    const { token } = await this.userTokensRepository.generate(user.id);

    const templatePath = path.resolve(
      __dirname,
      '..',
      'views',
      'forgot_password.hbs',
    );

    await this.mailProvider.sendEmail({
      to: {
        name: user.name,
        email,
      },
      subject: '[GoBarber] Recuperação de senha',
      templateData: {
        file: templatePath,
        variables: {
          name: user.name,
          link: `http://localhost:3000/forgot_password?token=${token}`,
        },
      },
    });
  }
}

export default SendForgotPasswordEmailService;
