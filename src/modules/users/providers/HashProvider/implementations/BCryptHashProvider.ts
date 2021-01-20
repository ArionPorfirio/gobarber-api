import { compare, hash } from 'bcryptjs';

import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';

class BCryptHashProvider implements IHashProvider {
  public async generateHash(payload: string): Promise<string> {
    const hashedPayload = await hash(payload, 8);

    return hashedPayload;
  }

  public async compareHash(payload: string, hashed: string): Promise<boolean> {
    const result = await compare(payload, hashed);

    return result;
  }
}

export default BCryptHashProvider;
