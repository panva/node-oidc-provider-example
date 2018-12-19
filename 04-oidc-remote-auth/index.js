const assert = require('assert');
const Provider = require('oidc-provider');
const express = require('express');
const bodyParser = require('body-parser');

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

// new Provider instance with no extra configuration, will run in default, just needs the issuer
// identifier, uses data from runtime-dyno-metadata heroku here
// const oidc = new Provider(`https://${process.env.HEROKU_APP_NAME}.herokuapp.com`);
const oidc = new Provider(`https://${process.env.HEROKU_APP_NAME}.herokuapp.com`, {
  interactionUrl: function interactionUrl(ctx, interaction) { // eslint-disable-line no-unused-vars
    return `/auth/login`;
  },
  features: {
    devInteractions: false,
  },
});

// initialize with no keystores, dev ones will be provided
oidc.initialize({
  // just a foobar client to be able to start an Authentication Request
  clients: [{
    client_id: 'foo',
    client_secret: 'bar',
    redirect_uris: ['https://yourapp.com/cb'],
    grant_types: ['implicit'],
    response_types: ['id_token'],
  },
  ],
}).then(() => {
  // Heroku has a proxy in front that terminates ssl, you should trust the proxy.
  oidc.proxy = true;

  // set the cookie signing keys (securekey plugin is taking care of those)
  oidc.keys = process.env.SECURE_KEY.split(',');
}).then(() => {
  // let's work with express here, below is just the interaction definition
  const expressApp = express();
  expressApp.set('trust proxy', true);

  expressApp.get('/auth/login', async (req, res) => {
    res.redirect('/auth/login/callback?userId=123');
  });

  expressApp.get('/auth/login/callback', async (req, res) => {
    const userId = req.query.userId;

    const dateTime = Date.now();
    const timestamp = Math.floor(dateTime / 1000);
    const results = {
      // authentication/login prompt got resolved, omit if no authentication happened, i.e. the user
      // cancelled
      login: {
        account: userId, // logged-in account id
        acr: 'acr string', // acr value for the authentication
        remember: false, // true if provider should use a persistent cookie rather than a session one
        ts: timestamp, // unix timestamp of the authentication
      },

      // consent was given by the user to the client for this session
      consent: {
        rejectedScopes: [], // array of strings, scope names the end-user has not granted
        rejectedClaims: [], // array of strings, claim names the end-user has not granted
      },

      // meta is a free object you may store alongside an authorization. It can be useful
      // during the interactionCheck to verify information on the ongoing session.
      meta: {
        // object structure up-to-you
        customVariable: 'my custom var',
      },

      'custom prompt name resolved': {},
    };
    /*
    results = {
      // an error field used as error code indicating a failure during the interaction
      error: 'custom_error',
      // an optional description for this error
      error_description: 'Custom Error description',
    }
    */

    try {
      return oidc.interactionFinished(req, res, results); // result object below
    } catch (error) {
      console.log(error);
    }
  });

  // leave the rest of the requests to be handled by oidc-provider, there's a catch all 404 there
  expressApp.use(oidc.callback);

  // express listen
  expressApp.listen(process.env.PORT);
});
