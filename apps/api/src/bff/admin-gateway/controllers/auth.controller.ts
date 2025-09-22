import { Controller, Post, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { AdminIdentityApiService } from '../../../admin-identity/application/services/admin-identity-api.service';
import { CurrentAdminUserId } from '../auth/current-admin-user-id.decorator';
import { Public } from '../auth/public.decorator';

@Public()
@Controller('admin/auth')
export class AuthController {
  constructor(
    private readonly adminIdentityApiService: AdminIdentityApiService,
  ) {}

  @Post('sign-in')
  @UseGuards(LocalAuthGuard)
  signIn(@CurrentAdminUserId() userId: string) {
    return this.adminIdentityApiService.signIn(userId);
  }
}
