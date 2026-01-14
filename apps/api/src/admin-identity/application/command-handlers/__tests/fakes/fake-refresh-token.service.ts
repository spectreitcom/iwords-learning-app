import { RefreshTokenService } from '../../../ports/refresh-token.service';
import { RefreshTokenPayload } from '../../../types';

export class FakeRefreshTokenService implements RefreshTokenService {
  createToken(adminUserId: string, refreshTokenId: string): string {
    return `refresh-token:${adminUserId}:${refreshTokenId}`;
  }

  verifyToken(token: string): RefreshTokenPayload | false {
    if (token.startsWith('refresh-token:')) {
      const parts = token.replace('refresh-token:', '').split(':');
      return { sub: parts[0], refreshTokenId: parts[1] };
    }
    return false;
  }
}
