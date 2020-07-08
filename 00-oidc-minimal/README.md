# oidc-minimal

A minimal OP with no configuration, just a client to verify the deployment

1) Clone the repo  
```bash
git clone https://github.com/panva/node-oidc-provider-example.git my-provider
cd my-provider
```

2) Create a heroku app  
```bash
heroku create --addons securekey,heroku-redis:hobby-dev
```

3) Enable (experimental) runtime-dyno-metadata
```bash
heroku labs:enable runtime-dyno-metadata
```

4) Copy the minimal setup  
```bash
cp 00-oidc-minimal/index.js src
```

5) Commit to your local repo  
```bash
git add .
git commit -a -m 'my initial commit'
```

6) Deploy to heroku  
```bash
git push heroku master
```

7) Done!  
```bash
heroku open '/.well-known/openid-configuration' # to see your openid-configuration  
heroku open '/auth?client_id=foo&response_type=code&scope=openid&nonce=test' # to start your first Authentication Request
```

You should see a login screen promting you to enter any login and password, after doing so your
Request will be resolved and you will be redirected to lvh.me (your localhost) with an authorization_code
in the query.

Next up [01-oidc-configured](../01-oidc-configured/README.md)

> **HINT**: For more details consider documentation, configuration and details found in the [oidc-provider documentation](https://github.com/panva/node-oidc-provider)
