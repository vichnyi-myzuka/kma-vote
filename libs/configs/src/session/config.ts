import { SessionOptions } from 'express-session';
import * as crypto from 'crypto';
import * as env from '@libs/core/utils/env';

const options: SessionOptions = {
  name: env.string('SESSION_NAME', 'kma.vote.sid'),
  secret: env.string('SESSION_SECRET', crypto.randomBytes(64).toString('hex')),
  resave: false,
  saveUninitialized: false,
};

if (env.string('NODE_ENV') === 'development') {
  options.cookie = {
    maxAge: 84600 * 1000,
    secure: true,
    sameSite: 'none',
  };
}

export default options;
