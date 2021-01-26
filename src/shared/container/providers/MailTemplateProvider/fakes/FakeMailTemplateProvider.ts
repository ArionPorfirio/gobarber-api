import IMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider';

class FakeMailTemplateProvider implements IMailTemplateProvider {
  public async parse(): Promise<string> {
    return new Promise((resolve, _) => resolve('MailTemplate'));
  }
}

export default FakeMailTemplateProvider;
