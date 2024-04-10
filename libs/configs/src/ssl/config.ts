import * as env from '@libs/core/utils/env';

const options = {
  ssl: env.boolean('SSL', false),
  key: env.string('SSL_KEY_PATH'),
  cert: env.string('SSL_CERT_PATH'),
};

export default options;
