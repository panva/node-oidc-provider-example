# oidc-adapter

Previous [01-oidc-configured](../01-oidc-configured/README.md)

Storing tokens in-memory is not really production ready, it does not scale and it sucks to lose
your tokens with each process restart, let's hook in an adapter. In this example a redis one.

1) Copy the configured index, feel free to check the diff after you do  
```bash
cp 02-oidc-adapter/index.js src
wget -O src/redis_adapter.js https://raw.githubusercontent.com/panva/node-oidc-provider/master/example/adapters/redis.js
```

2) Adding heroku-redis plugin takes a couple of minutes, make sure it's already created
```bash
# you should see a REDIS_URL printed
heroku config | grep REDIS_URL
```

3) Commit to your local repo  
```bash
git add .
git commit -a -m 'added a redis adapter for tokens and sessions'
```

4) Deploy to heroku  
```bash
git push heroku master
```

5) Done!  
```bash
# to get your access token > check the fragment for access_token
heroku open '/auth?client_id=foo&response_type=id_token&scope=openid&nonce=foobar'
heroku restart

# this time, since a real persistant adapter holds your session object you wont be asked for
# login again
heroku open '/auth?client_id=foo&response_type=id_token&scope=openid&nonce=foobar'
```

Next up [03-oidc-views-accounts](../03-oidc-views-accounts/README.md)

> **HINT**: For more details consider documentation, configuration and details found in the [oidc-provider documentation](https://github.com/panva/node-oidc-provider)
