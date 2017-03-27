'use strict';

// see previous example for the things that are not commented

const assert = require('assert');
const Provider = require('oidc-provider');

assert(process.env.HEROKU_APP_NAME, 'process.env.HEROKU_APP_NAME missing, run `heroku labs:enable runtime-dyno-metadata`');
assert(process.env.PORT, 'process.env.PORT missing');
assert(process.env.SECURE_KEY, 'process.env.SECURE_KEY missing, run `heroku addons:create securekey`');
assert.equal(process.env.SECURE_KEY.split(',').length, 2, 'process.env.SECURE_KEY format invalid');

const oidc = new Provider(`https://${process.env.HEROKU_APP_NAME}.herokuapp.com`, {

  // enable some of the feature, see the oidc-provider readme for more
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
  clients: [{ client_id: 'foo', client_secret: 'bar', redirect_uris: ['http://lvh.me/cb'] }],
}).then(() => {
  oidc.app.proxy = true;
  oidc.app.keys = process.env.SECURE_KEY.split(',');
  oidc.app.listen(process.env.PORT);
});
