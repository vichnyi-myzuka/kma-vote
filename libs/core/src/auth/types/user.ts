import { User } from '@libs/core/database/entities';
import { Request } from 'express';

export type TUser = {
  id?: number;
  email?: string;
  username?: string;
};

export type TUserSerialized = Pick<TUser, 'username' | 'email' | 'id'>;

export type UserRequest = Request & {
  readonly user?: Readonly<User>;
};
