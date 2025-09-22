import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AdminUserApiService } from '../../../admin-identity/application/services/admin-user-api.service';
import { WrongEmailOrPasswordError } from '../../../admin-identity/application/errors';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly adminUserApiService: AdminUserApiService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<{ userId: string }> {
    try {
      const result = await this.adminUserApiService.signIn(email, password);
      return {
        userId: result.user.adminUserId,
      };
    } catch (e) {
      if (e instanceof WrongEmailOrPasswordError)
        throw new UnauthorizedException();
      throw e;
    }
  }
}
