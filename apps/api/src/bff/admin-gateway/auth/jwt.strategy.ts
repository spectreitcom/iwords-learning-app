import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../../../admin-identity/application/types';
import { AdminUserApiService } from '../../../admin-identity/application/services/admin-user-api.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly adminUserApiService: AdminUserApiService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET') as string,
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayload): Promise<{ userId: string }> {
    const adminUser = await this.adminUserApiService.getUserById(payload.sub);
    if (!adminUser) throw new UnauthorizedException();
    return { userId: payload.sub };
  }
}
