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
const oidc = new Provider(`http://localhost:3000`,{
  interactionUrl: function interactionUrl(ctx, interaction) { // eslint-disable-line no-unused-vars
    return `/auth/login`;
  },
  features: {
    devInteractions: false, 
  },
});
// http://localhost:3000/auth?client_id=foo&response_type=id_token&scope=openid&nonce=d



// initialize with no keystores, dev ones will be provided
oidc.initialize({
  // just a foobar client to be able to start an Authentication Request
  clients: [{
    client_id: 'foo',
    client_secret: 'bar',
    redirect_uris: ['https://yourapp.com/cb'],
    grant_types: ['implicit'],
    response_types: ['id_token'],
  }
  ]
}).then(() => {
  // Heroku has a proxy in front that terminates ssl, you should trust the proxy.
  oidc.proxy = true;

  // set the cookie signing keys (securekey plugin is taking care of those)
  oidc.keys = process.env.SECURE_KEY.split(',');
}).then(() => {
  // let's work with express here, below is just the interaction definition
  const expressApp = express();
  expressApp.set('trust proxy', true);
  const parse = bodyParser.urlencoded({ extended: false });

  expressApp.get('/auth/login', async (req, res) => {
    console.log('/auth/login')
    res.redirect('/auth/login/callback?userId=123');
  });

  expressApp.get('/auth/login/callback', async (req, res) => {
    console.log('/auth/login/callback')
    console.log(req.query.userId)

    const dateTime = Date.now();
    const timestamp = Math.floor(dateTime / 1000);
    var results = {
      // authentication/login prompt got resolved, omit if no authentication happened, i.e. the user
      // cancelled
      login: {
        account: req.query.userId, // logged-in account id
        acr: 'acr string', // acr value for the authentication
        remember: false, // true if provider should use a persistent cookie rather than a session one
        ts: timestamp, // unix timestamp of the authentication
      },
    
      // consent was given by the user to the client for this session
      consent: {
        // use the scope property if you wish to remove/add scopes from the request, otherwise don't
        // include it use when i.e. offline_access was not given, or user declined to provide address
        scope: 'space separated list of scopes',
      },
    
      // meta is a free object you may store alongside an authorization. It can be useful
      // during the interactionCheck to verify information on the ongoing session.
      meta: {
        // object structure up-to-you
      },
    
      ['custom prompt name resolved']: {},
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
      /*
      const redirectTo = await oidc.interactionResult(req, res, results);
      return res.redirect(redirectTo);
      */
      // const session = await oidc.setProviderSession(req, res, { account: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxx' });
      return oidc.interactionFinished(req, res, results); // result object below

      
    } catch (error) {
      console.log(error)
      
    }



    res.send('ok');
  });

  // leave the rest of the requests to be handled by oidc-provider, there's a catch all 404 there
  expressApp.use(oidc.callback);

  // express listen
  expressApp.listen(process.env.PORT);
});
