import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AdminIdentityApiService } from '../../../admin-identity/application/services/admin-identity-api.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly adminUserApiService: AdminIdentityApiService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<{ userId: string }> {
    try {
      const user = await this.adminUserApiService.validateUser(email, password);
      return {
        userId: user.adminUserId,
      };
    } catch {
      throw new UnauthorizedException();
    }
  }
}
