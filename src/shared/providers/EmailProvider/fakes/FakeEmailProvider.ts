import IEmailProvider from '@shared/providers/EmailProvider/models/IEmailProvider';

interface IEmailMessage {
  to: string;
  subject: string;
  content: string;
}

class FakeEmailProvider implements IEmailProvider {
  private storage: IEmailMessage[] = [];

  public async sendEmail(email: string, body: string): Promise<void> {
    this.storage.push({
      to: email,
      subject: 'Recuperação de email',
      content: body,
    });
  }
}

export default FakeEmailProvider;
