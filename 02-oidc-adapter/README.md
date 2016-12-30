# oidc-adapter

Previous [01-oidc-configured](../01-oidc-configured/README.md)

Storing tokens in-memory is not really production ready, it does not scale and it sucks to lose
your tokens with each process restart, let's hook in an adapter. In this example a redis one.

1) Copy the configured index, feel free to check the diff after you do  
```
cp 02-oidc-adapter/index.js src
wget -O src/redis_adapter.js https://raw.githubusercontent.com/panva/node-oidc-provider/master/example/adapters/redis.js
```

2) Adding heroku-redis plugin takes a couple of minutes, make sure it's already created
```
# you should see a REDIS_URL printed
heroku config | grep REDIS_URL
```

3) Commit to your local repo  
```
git add .
git commit -a -m 'added a redis adapter for tokens and sessions'
```

4) Deploy to heroku  
```
git push heroku master
```

5) Done!  
```
# to get your access token > check the fragment for access_token
heroku open '/auth?client_id=foo&response_type=id_token+token&scope=openid&nonce=foobar'
heroku open /me?access_token=ENTER_TOKEN_HERE
heroku restart
heroku open /me?access_token=ENTER_TOKEN_HERE
```

Next up [03-oidc-views-accounts](../03-oidc-views-accounts/README.md)
