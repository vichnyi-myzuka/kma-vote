import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { TUser, TUserSerialized } from '@libs/core/auth/types';
import { User } from '@libs/core/database/entities';

@Injectable()
export class CookieSerializer extends PassportSerializer {
  constructor() {
    super();
  }

  public serializeUser(
    user: TUser,
    done: (err, serialized: TUserSerialized) => void,
  ): void {
    done(null, {
      id: user.id,
    });
  }

  public deserializeUser(
    serialized: TUserSerialized,
    done: (err, user: TUser) => void,
  ): void {
    console.log('Serialized:', serialized);
    if (serialized?.id) {
      User.findOne({
        where: {
          id: serialized?.id,
        },
      })
        .then((user: User): void => void done(null, user))
        .catch((err) => {
          done(
            new UnauthorizedException(err?.message ?? err ?? undefined),
            null,
          );
        });
    } else {
      done(null, null);
    }
  }
}
