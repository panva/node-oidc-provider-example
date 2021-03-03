# oidc-adapter

Previous [02-oidc-adapter](../02-oidc-adapter/README.md)

As the application is starting up you've noticed the devInteractions warning. Let's create our own
view structure using express. This is a good point to also hook in your own Account Model.

1) Copy the configured index, views and account model, feel free to check the diff after you do  
```bash
cp 03-oidc-views-accounts/*.js src
cp -r 03-oidc-views-accounts/views src
```

2) Commit to your local repo  
```bash
git add .
git commit -a -m 'added an account model and barebone views'
```

3) Deploy to heroku  
```bash
git push heroku main
```

4) Done!  
```bash
# check your 'new' views, enter either of the configured emails to be logged in
# enter foo@example.com or bar@example.com and any password
heroku open '/auth?client_id=foo&response_type=id_token&redirect_uri=https%3A%2F%2Fjwt.io&scope=openid%20email&nonce=foobar&prompt=login'
```

5) You may now proceed to plug in your real user/account model, expand the views with password resets,
  registrations, social signup, as long as your routes are in the same `/interaction/${interaction.uid}`
  path namespace you have access to the original authentication request parameters and interaction
  details, those are referenced by a path specific cookie and stored using your data adapter.

> **HINT**: For more details consider documentation, configuration and details found in the [oidc-provider repository](https://github.com/panva/node-oidc-provider).
