# oidc-adapter

Previous [02-oidc-adapter](../02-oidc-adapter/README.md)

As the application is starting up you've noticed the devInteractions warning. Let's create our own
view structure using express. This is a good point to also hook in your own Account Model.

1) Copy the configured index, views and account model, feel free to check the diff after you do  
```
cp 03-oidc-views-accounts/*.js src
cp -r 03-oidc-views-accounts/views src
```

2) Commit to your local repo  
```
git add .
git commit -a -m 'added an account model and barebone views'
```

3) Deploy to heroku  
```
git push heroku master
```

4) Done!  
```
# check your 'new' views, enter either of the configured emails to be logged in
heroku open '/auth?client_id=foo&response_type=id_token+token&scope=openid+email&nonce=foobar&prompt=login'
```

5) You may now proceed to plug in your real user/account model, expand the views with password resets,
  registrations, social signup, as long as your routes are in the same namespace you have access
  to the original authentication request parameters and interaction details, those are stored in a
  path specific cookie which is signed (in the example) so it cannot be fiddled with. oidc-provider
  expects that you resolve all interactions in this one go, if you fail or purposefully omit one
  the resumed authentication will fail with a corresponding error.

> **HINT**: For more details consider documentation, configuration and details found in the [oidc-provider documentation](https://github.com/panva/node-oidc-provider#oidc-provider)
