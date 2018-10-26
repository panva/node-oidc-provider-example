// see previous example for the things that are not commented

const assert = require('assert');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
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

// simple account model for this application, user list is defined like so
const Account = require('./account');

const oidc = new Provider(`https://${process.env.HEROKU_APP_NAME}.herokuapp.com`, {

  // oidc-provider only looks up the accounts by their ID when it has to read the claims,
  // passing it our Account model method is sufficient, it should return a Promise that resolves
  // with an object with accountId property and a claims method.
  findById: Account.findById,

  // let's tell oidc-provider we also support the email scope, which will contain email and
  // email_verified claims
  claims: {
    // scope: [claims] format
    openid: ['sub'],
    email: ['email', 'email_verified'],
  },

  // let's tell oidc-provider where our own interactions will be
  // setting a nested route is just good practice so that users
  // don't run into weird issues with multiple interactions open
  // at a time.
  interactionUrl(ctx) {
    return `/interaction/${ctx.oidc.uuid}`;
  },
  formats: {
    AccessToken: 'jwt',
  },
  features: {
    // disable the packaged interactions
    devInteractions: false,

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
}).then(() => {
  // let's work with express here, below is just the interaction definition
  const expressApp = express();
  expressApp.set('trust proxy', true);
  expressApp.set('view engine', 'ejs');
  expressApp.set('views', path.resolve(__dirname, 'views'));

  const parse = bodyParser.urlencoded({ extended: false });

  expressApp.get('/interaction/:grant', async (req, res) => {
    oidc.interactionDetails(req).then((details) => {
      console.log('see what else is available to you for interaction views', details);

      const view = (() => {
        switch (details.interaction.reason) {
          case 'consent_prompt':
          case 'client_not_authorized':
            return 'interaction';
          default:
            return 'login';
        }
      })();

      res.render(view, { details });
    });
  });

  expressApp.post('/interaction/:grant/confirm', parse, (req, res) => {
    oidc.interactionFinished(req, res, {
      consent: {
        // TODO: add offline_access checkbox to confirm too
      },
    });
  });

  expressApp.post('/interaction/:grant/login', parse, (req, res, next) => {
    Account.authenticate(req.body.email, req.body.password)
      .then(account => oidc.interactionFinished(req, res, {
        login: {
          account: account.accountId,
          remember: !!req.body.remember,
          ts: Math.floor(Date.now() / 1000),
        },
        consent: {
          rejectedScopes: req.body.remember ? [] : ['offline_access'],
        },
      })).catch(next);
  });

  // leave the rest of the requests to be handled by oidc-provider, there's a catch all 404 there
  expressApp.use(oidc.callback);

  // express listen
  expressApp.listen(process.env.PORT);
});
