import { inject, injectable } from 'tsyringe';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';

import AppError from '@shared/errors/AppError';
import IEmailProvider from '@shared/providers/EmailProvider/models/IEmailProvider';

interface IRequest {
  email: string;
}

@injectable()
class SendForgotPasswordEmailService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('EmailProvider')
    private emailProvider: IEmailProvider,

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

    await this.userTokensRepository.generate(user.id);

    await this.emailProvider.sendEmail(
      email,
      'Você solicitou uma recuperação de email.',
    );
  }
}

export default SendForgotPasswordEmailService;
