import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { AppErrorCode, codeToStatus } from '../../../common/errors';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(
    exception: { code?: AppErrorCode; message?: string },
    host: ArgumentsHost,
  ) {
    const res: Response = host.switchToHttp().getResponse();

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
