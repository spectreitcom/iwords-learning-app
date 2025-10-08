import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { AppErrorCode, codeToStatus } from '../../../common/errors';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(
    exception:
      | { code?: AppErrorCode; message?: string }
      | UnauthorizedException,
    host: ArgumentsHost,
  ) {
    const res: Response = host.switchToHttp().getResponse();

    if (exception instanceof HttpException) {
      return res.status(exception.getStatus()).json({
        title: exception.getStatus().toString(),
        detail: exception.message,
        status: exception.getStatus(),
      });
    }

    // if (exception instanceof UnauthorizedException) {
    //   return res.status(HttpStatus.UNAUTHORIZED).json({
    //     title: 'UNAUTHORIZED',
    //     detail: 'Unauthorized',
    //     status: HttpStatus.UNAUTHORIZED,
    //   });
    // }

    if (exception?.code && codeToStatus[exception.code]) {
      const status = codeToStatus[exception.code];
      return res.status(status).json({
        title: exception.code,
        detail: exception.message,
        status,
      });
    }

    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      title: 'INTERNAL_SERVER_ERROR',
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  }
}
