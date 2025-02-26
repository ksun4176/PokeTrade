import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

/**
 * Log in to API
 */
export class DiscordAuthGuard extends AuthGuard('discord') {
  override async canActivate(context: ExecutionContext) {
    const activate = await super.canActivate(context) as boolean;
    const request = context.switchToHttp().getRequest<Request>();
    await super.logIn(request);
    return activate;
  }
}

/**
 * Guard routes unless the request has been authenticated
 */
@Injectable()
export class AuthenticatedGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<Request>();
    return req.isAuthenticated();
  }
}