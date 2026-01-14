import { HashingService } from '../../../ports/hashing.service';

export class FakeHashingService implements HashingService {
  async hash(password: string): Promise<string> {
    return `hashed-${password}`;
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return hash === `hashed-${password}`;
  }
}
