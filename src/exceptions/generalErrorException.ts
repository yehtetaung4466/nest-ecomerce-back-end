import {
  Catch,
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(Error)
export class GeneralErrorException implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = 500;
    if (exception instanceof Error && !(exception instanceof HttpException)) {
      response
        .status(status)
        .json({ message: 'internal server error', error: exception.stack });
    }
  }
}
