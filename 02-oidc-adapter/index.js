// see previous example for the things that are not commented

const assert = require('assert');
const Provider = require('oidc-provider');

// since dyno metadata is no longer available, we infer the app name from heroku remote we set
// manually. This is not specific to oidc-provider, just an easy way of getting up and running
if (!process.env.HEROKU_APP_NAME && process.env.X_HEROKU_REMOTE) {
  process.env.X_HEROKU_REMOTE.match(/\.com\/(.+)\.git/);
  process.env.HEROKU_APP_NAME = RegExp.$1;
}

assert(process.env.HEROKU_APP_NAME, 'process.env.HEROKU_APP_NAME missing');
assert(process.env.PORT, 'process.env.PORT missing');
assert(process.env.SECURE_KEY, 'process.env.SECURE_KEY missing, run `heroku addons:create securekey`');
assert.equal(process.env.SECURE_KEY.split(',').length, 2, 'process.env.SECURE_KEY format invalid');
assert(process.env.REDIS_URL, 'process.env.REDIS_URL missing, run `heroku-redis:hobby-dev`');

// require the redis adapter factory/class
const RedisAdapter = require('./redis_adapter');

const oidc = new Provider(`https://${process.env.HEROKU_APP_NAME}.herokuapp.com`, {
  formats: {
    AccessToken: 'jwt',
  },
  features: {
    claimsParameter: true,
    discovery: true,
    encryption: true,
    introspection: true,
    registration: true,
    request: true,
    revocation: true,
    sessionManagement: true,
  },
});

const keystore = require('./keystore.json');

oidc.initialize({
  keystore,
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
  // configure Provider to use the adapter
  adapter: RedisAdapter,
}).then(() => {
  oidc.proxy = true;
  oidc.keys = process.env.SECURE_KEY.split(',');
  oidc.listen(process.env.PORT);
});
