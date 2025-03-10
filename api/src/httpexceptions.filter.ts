import { ArgumentsHost, Catch, HttpException } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";
import { MyLoggerService } from "./mylogger/mylogger.service";
import { Request } from 'express';

type MyExceptionObj = {
  path: string,
  exception: string | object,
}

@Catch(HttpException)
export class HttpExceptionFilter extends BaseExceptionFilter {
  private readonly logger = new MyLoggerService(HttpExceptionFilter.name)
  override catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();

    const myExceptionObj: MyExceptionObj = {
      path: request.url,
      exception: exception.getResponse()
    };

    this.logger.error(JSON.stringify(myExceptionObj), HttpExceptionFilter.name);

    super.catch(exception, host);
  }
}