import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from 'express';

/**
 * The authenticated user
 */
export const AuthUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.user;
  }
);