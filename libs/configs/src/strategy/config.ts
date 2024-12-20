import * as env from '@libs/core/utils/env';
import { IOIDCStrategyOption } from 'passport-azure-ad';
import { URL } from 'url';

const redirectUrl: URL = new URL('auth/ukma', env.string('APP_HOST'));

const config: IOIDCStrategyOption = {
  identityMetadata: env.string(
    'UKMA_IDENTITY_META',
    //`https://login.microsoftonline.com/${env.string('TENANT')}/v2.0/.well-known/openid-configuration`,
    'https://login.microsoftonline.com/organizations/v2.0/.well-known/openid-configuration',
  ),
  clientID: env.string('CLIENT'),
  clientSecret: env.string('SECRET'),
  allowHttpForRedirectUrl: env.boolean('UKMA_ALLOW_HTTP', false),
  validateIssuer: env.boolean('UKMA_VALIDATE_ISSUER', false),
  redirectUrl: redirectUrl.toString(),
  responseType: 'id_token',
  responseMode: 'form_post',
  loggingLevel: 'warn',
  scope: ['openid', 'email', 'profile'],
  cookieSameSite: true,
};

export default config;
