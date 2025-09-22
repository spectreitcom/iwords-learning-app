import { Injectable } from '@nestjs/common';
import { AccessTokenService } from '../../application/ports/access-token.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../../application/types';

@Injectable()
export class JwtAccessTokenService implements AccessTokenService {
  constructor(private readonly jwtService: JwtService) {}

  createToken(adminUserId: string): string {
    return this.jwtService.sign({
      sub: adminUserId,
    });
  }

  verifyToken(token: string): JwtPayload | false {
    try {
      return this.jwtService.verify<JwtPayload>(token);
    } catch {
      return false;
    }
  }
}
