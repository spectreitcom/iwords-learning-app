import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { UserView } from '../../../user-identity/views/user.view';

export const CurrentUserId = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request: Request & { user?: UserView } = ctx
      .switchToHttp()
      .getRequest();
    return request.user?.userId;
  },
);
