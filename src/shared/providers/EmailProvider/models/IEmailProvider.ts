export default interface IEmailProvider {
  sendEmail(email: string, body: string): Promise<void>;
}
