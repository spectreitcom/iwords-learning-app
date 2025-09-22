import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { HashingService } from '../../application/ports/hashing.service';

@Injectable()
export class ArgonHashingService implements HashingService {
  async compare(password: string, hash: string): Promise<boolean> {
    try {
      return await argon2.verify(hash, password);
    } catch {
      return false;
    }
  }

  async hash(password: string): Promise<string> {
    return await argon2.hash(password);
  }
}
