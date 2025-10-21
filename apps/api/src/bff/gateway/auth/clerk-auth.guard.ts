import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './public.decorator';
import { getAuth } from '@clerk/express';
import { AppError } from '../../../common/errors';
import { UserApiService } from '../../../user-identity/appliaction/services/user-api.service';
import { Request } from 'express';

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userApiService: UserApiService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request: Request = context.switchToHttp().getRequest();

    const { isAuthenticated, userId } = getAuth(request);

    if (!isAuthenticated) {
      throw new AppError('UNAUTHORIZED');
    }

    const user = await this.userApiService.getUserByClerkId(userId);

    request.user = { ...user };

    if (!user || user.blocked) {
      throw new AppError('UNAUTHORIZED');
    }

    return isAuthenticated;
  }
}
