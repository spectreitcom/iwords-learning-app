import { JwtPayload } from '../types';

export abstract class RefreshTokenService {
  abstract createToken(adminUserId: string): string;
  abstract verifyToken(token: string): JwtPayload | false;
}
