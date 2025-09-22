import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const CurrentUserId = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();
    const user = request.user as { userId: string };
    return user?.userId;
  },
);
