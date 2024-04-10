import * as env from '@libs/core/utils/env';
import { IOIDCStrategyOption } from 'passport-azure-ad';
import { URL } from 'url';

const baseUrl = `https://localhost:${env.number('PORT', 8683)}`;

const redirectUrl: URL = new URL('auth/ukma', baseUrl);

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
};

export default config;
