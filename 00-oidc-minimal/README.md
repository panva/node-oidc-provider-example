# oidc-minimal

A minimal OP with no configuration, just a client to verify the deployment

1) Clone the repo  
```
git clone https://github.com/panva/node-oidc-provider-example.git my-provider
cd my-provider
```

2) Create a heroku app  
```
heroku create --addons securekey,heroku-redis:hobby-dev
```

3) Enable (unavailable) runtime-dyno-metadata workaround  
```
heroku config:set X_HEROKU_REMOTE=`git remote get-url heroku`
```

4) Copy the minimal setup  
```
cp 00-oidc-minimal/index.js src
```

5) Commit to your local repo  
```
git add .
git commit -a -m 'my initial commit'
```

6) Deploy to heroku  
```
git push heroku master
```

7) Done!  
```
heroku open '/.well-known/openid-configuration' # to see your openid-configuration  
heroku open '/auth?client_id=foo&response_type=code&scope=openid' # to start your first Authentication Request
```

You should see a login screen promting you to enter any login and password, after doing so your
Request will be resolved and you will be redirected to lvh.me (your localhost) with an authorization_code
in the query.

Next up [01-oidc-configured](../01-oidc-configured/README.md)
