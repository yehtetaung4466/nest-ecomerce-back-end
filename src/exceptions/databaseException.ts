import {
  Catch,
  ArgumentsHost,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { PostgresError } from 'postgres';
import { Response } from 'express';
enum dbErrorDetail {
  emailUnique = 'users_email_unique',
}
@Catch(PostgresError)
export class DatabaseException implements ExceptionFilter {
  catch(exception: PostgresError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let message: string = 'database error';
    let status: number = 500;
    function setMsgAndStatus(msg: string, sts: HttpStatus) {
      message = msg;
      status = sts;
    }
    switch (exception.constraint_name) {
      case dbErrorDetail.emailUnique:
        setMsgAndStatus('email already exit', HttpStatus.BAD_REQUEST);
    }
    response.status(status).json({
      response: message,
    });
    // Handle the specific database error here
    // You can customize the response based on the database error
    // For example, return a meaningful error message or status code
  }
}
