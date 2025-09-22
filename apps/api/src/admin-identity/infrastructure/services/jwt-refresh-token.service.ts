import { Injectable } from '@nestjs/common';
import { RefreshTokenService } from '../../application/ports/refresh-token.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../../application/types';

@Injectable()
export class JwtRefreshTokenService implements RefreshTokenService {
  constructor(private readonly jwtService: JwtService) {}

  createToken(adminUserId: string): string {
    return this.jwtService.sign(
      { sub: adminUserId },
      {
        expiresIn: '7d',
      },
    );
  }

  verifyToken(token: string): JwtPayload | false {
    try {
      return this.jwtService.verify<JwtPayload>(token);
    } catch {
      return false;
    }
  }
}
