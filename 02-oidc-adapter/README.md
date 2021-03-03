# oidc-adapter

Previous [01-oidc-configured](../01-oidc-configured/README.md)

Storing data in-memory is not really production ready, it does not scale and it blows to lose
your tokens and sessions with each process restart, let's add a storage adapter. In this example a redis one.

1) Copy the configured index, feel free to check the diff after you do  
```bash
cp 02-oidc-adapter/index.js src
wget -O src/redis_adapter.js https://raw.githubusercontent.com/panva/node-oidc-provider/main/example/adapters/redis.js
```

2) Adding heroku-redis plugin takes a couple of minutes, make sure it's already created
```bash
# you should see a REDIS_URL printed
heroku config | grep REDIS_URL
```

3) Commit to your local repo  
```bash
git add .
git commit -a -m 'added a redis adapter for persisting data'
```

4) Deploy to heroku  
```bash
git push heroku main
```

5) Done!  
```bash
heroku open '/auth?client_id=foo&response_type=id_token&redirect_uri=https%3A%2F%2Fjwt.io&scope=openid&nonce=foobar'
# finish the login

heroku restart

# this time, since a real persistant adapter holds your session object you wont be asked for
# login again
heroku open '/auth?client_id=foo&response_type=id_token&redirect_uri=https%3A%2F%2Fjwt.io&scope=openid&nonce=foobar'
```

Next up [03-oidc-views-accounts](../03-oidc-views-accounts/README.md)

> **HINT**: For more details consider documentation, configuration and details found in the [oidc-provider repository](https://github.com/panva/node-oidc-provider).
