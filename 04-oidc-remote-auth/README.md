# oidc-adapter

Previous [03-oidc-views-accounts](../03-oidc-views-accounts/README.md)

Let's implement an integration with a remote authentication provider. 

1) Create a custom interactionUrl 

```js
  interactionUrl: function interactionUrl(ctx, interaction) { // eslint-disable-line no-unused-vars
    return `/auth/login`;
  },
```

2) Create a custom /auth/login endpoint

```js 
  expressApp.get('/auth/login', async (req, res) => {
    res.redirect('http://external.com/authentication');
  });
```

3) Create a custom /auth/login/callback endpoint

Validate/parse the incoming callback data and finish interaction so that the user is redirected to the oauth redirect_uri.

```js 
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
```
