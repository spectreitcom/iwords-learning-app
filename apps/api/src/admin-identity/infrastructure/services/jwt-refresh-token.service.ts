import { Injectable } from '@nestjs/common';
import { RefreshTokenService } from '../../application/ports/refresh-token.service';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenPayload } from '../../application/types';

@Injectable()
export class JwtRefreshTokenService implements RefreshTokenService {
  constructor(private readonly jwtService: JwtService) {}

  createToken(adminUserId: string, refreshTokenId: string): string {
    return this.jwtService.sign(
      { sub: adminUserId, refreshTokenId },
      {
        expiresIn: '7d',
      },
    );
  }

  verifyToken(token: string): RefreshTokenPayload | false {
    try {
      return this.jwtService.verify<RefreshTokenPayload>(token);
    } catch {
      return false;
    }
  }
}
