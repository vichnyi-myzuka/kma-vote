import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request, Response } from 'express';
import config from '@libs/configs/next';

@Injectable()
export class NotUserGuard implements CanActivate {
  constructor() {
    console.debug(`Building ${this.constructor.name} guard ... `);
  }

  public canActivate(context: ExecutionContext): boolean {
    const req: Request = context.switchToHttp().getRequest();
    const res: Response = context.switchToHttp().getResponse();
    if (!req?.isAuthenticated()) {
      console.log('not auth');
      return true;
    }
    res.redirect(config.routes.elections.path);
  }
}
