import { AccessTokenService } from '../../../ports/access-token.service';
import { JwtPayload } from '../../../types';

export class FakeAccessTokenService implements AccessTokenService {
  createToken(adminUserId: string): string {
    return `access-token-${adminUserId}`;
  }

  verifyToken(token: string): JwtPayload | false {
    if (token.startsWith('access-token-')) {
      return { sub: token.replace('access-token-', '') };
    }
    return false;
  }
}
