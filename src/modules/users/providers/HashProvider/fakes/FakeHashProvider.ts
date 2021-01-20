import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';

class FakeHashProvider implements IHashProvider {
  public async generateHash(payload: string): Promise<string> {
    return new Promise((resolve, _) => resolve(payload));
  }

  public async compareHash(payload: string, hashed: string): Promise<boolean> {
    const result = payload === hashed;

    return new Promise((resolve, _) => resolve(result));
  }
}

export default FakeHashProvider;
