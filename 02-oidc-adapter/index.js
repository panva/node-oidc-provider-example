'use strict';

// see previous example for the things that are not commented

const assert = require('assert');
const Provider = require('oidc-provider');

assert(process.env.HEROKU_APP_NAME, 'process.env.HEROKU_APP_NAME missing, run `heroku labs:enable runtime-dyno-metadata`');
assert(process.env.PORT, 'process.env.PORT missing');
assert(process.env.SECURE_KEY, 'process.env.SECURE_KEY missing, run `heroku addons:create securekey`');
assert.equal(process.env.SECURE_KEY.split(',').length, 2, 'process.env.SECURE_KEY format invalid');
assert(process.env.REDIS_URL, 'process.env.REDIS_URL missing, run `heroku-redis:hobby-dev`');

// require the redis adapter factory/class
const RedisAdapter = require('./redis_adapter');

const oidc = new Provider(`https://${process.env.HEROKU_APP_NAME}.herokuapp.com`, {
  // configure Provider to use the adapter
  adapter: RedisAdapter,
  features: {
    claimsParameter: true,
    clientCredentials: true,
    discovery: true,
    encryption: true,
    introspection: true,
    registration: true,
    request: true,
    requestUri: true,
    revocation: true,
    sessionManagement: true,
  },
});

const keystore = require('./keystore.json');
const integrity = require('./integrity.json');

oidc.initialize({
  keystore,
  integrity,
  clients: [
    // reconfigured the foo client for the purpose of showing the adapter working
    {
      client_id: 'foo',
      redirect_uris: ['https://example.com'],
      response_types: ['id_token token'],
      grant_types: ['implicit'],
      token_endpoint_auth_method: 'none',
    },
  ],
}).then(() => {
  oidc.app.proxy = true;
  oidc.app.keys = process.env.SECURE_KEY.split(',');
  oidc.app.listen(process.env.PORT);
});
