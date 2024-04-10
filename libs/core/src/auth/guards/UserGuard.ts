import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class UserGuard implements CanActivate {
  constructor() {
    console.debug(`Building ${this.constructor.name} guard ... `);
  }

  public canActivate(context: ExecutionContext): boolean {
    const req: Request = context.switchToHttp().getRequest();
    if (req?.isAuthenticated()) {
      return !!req.user;
    }
    throw new UnauthorizedException();
  }
}
