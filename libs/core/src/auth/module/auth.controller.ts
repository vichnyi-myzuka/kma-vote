import {
  Controller,
  UseInterceptors,
  ClassSerializerInterceptor,
  Post,
  Res,
  Get,
  Req,
  InternalServerErrorException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import type { Request, Response } from 'express';
import * as passport from 'passport';

import { User } from '@libs/core/database/entities';
import { UserGuard } from '@libs/core/auth';
import type { UserRequest } from '@libs/core/auth';
import env from '@libs/core/utils/env';
import { Role } from '@libs/core/database/enums';
import { UserOutputDto } from '@libs/core/dto';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Get('me')
  @UseGuards(UserGuard)
  public async me(@Req() req: UserRequest): Promise<UserOutputDto> {
    return new UserOutputDto(req?.user);
  }

  @Get('me/roles')
  @UseGuards(UserGuard)
  public async getRoles(@Req() req: UserRequest): Promise<Role[]> {
    return req?.user.roles;
  }

  @Get('logout')
  @UseGuards(UserGuard)
  public async logout(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<boolean> {
    req.logout((err) => {
      res.redirect('/');
      return !err;
    });
    return false;
  }

  @Get('ukma')
  public async ukma(
    @Req() req: UserRequest,
    @Res() res: Response,
  ): Promise<void> {
    passport.authenticate('UkmaStrategy', {}, (err, user, info) => {
      console.debug(err);
      console.debug(user);
      console.debug(info);
    })(req, res, (...args) => {
      console.debug('next from authenticate');
      console.debug(...args);
    });
  }

  @Post('ukma')
  public async ukmaResult(
    @Req() req: UserRequest,
    @Res() res: Response,
  ): Promise<void> {
    const result: User = await new Promise((resolve, reject): void =>
      passport.authenticate(
        'UkmaStrategy',
        {},
        async (err, data, info, ...args) => {
          if (err) {
            console.debug('Here we go to reject');
            reject(err);
          } else if (info) {
            console.debug('Here we go to reject');
            reject(new InternalServerErrorException(info));
          } else {
            console.debug('Here we go to resolve', data);
            const user = await this.service
              .processAzureProfile(data)
              .catch((err) => {
                reject(err);
              });
            if (user) {
              return resolve(user);
            } else {
              reject(
                new BadRequestException(
                  'Помилка при аутентифікації користувача',
                ),
              );
            }
          }
        },
      )(req, res),
    );

    if (result) {
      req.user = result;

      req.login(result, (err, ...args) => {
        if (err) {
          console.error(err);
          throw new UnauthorizedException(err?.message ?? err ?? undefined);
        }
        if (result) {
          res.redirect(env.string('REDIRECT_PATH_AFTER_LOGIN'));
        }
      });
    }
  }
}
