import { ArgumentsHost, Catch, HttpException, HttpStatus } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";
import { MyLoggerService } from "./mylogger/mylogger.service";
import { Request } from 'express';

type MyExceptionObj = {
  path: string,
  exception: string | object,
  stack?: string
}

@Catch(HttpException)
export class HttpExceptionFilter extends BaseExceptionFilter {
  private readonly logger = new MyLoggerService(HttpExceptionFilter.name)
  override catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();

    const myExceptionObj: MyExceptionObj = {
      path: request.url,
      exception: exception,
      stack: exception.stack
    };

    let skipLogging = false;
    if (request.url === '/api/auth/status' && exception.getStatus() === HttpStatus.FORBIDDEN) {
      skipLogging = true;
    }

    if (!skipLogging) {
      this.logger.error(JSON.stringify(myExceptionObj), HttpExceptionFilter.name);
    }

    super.catch(exception, host);
  }
}