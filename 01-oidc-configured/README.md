# oidc-configured

Previous [00-oidc-minimal](../00-oidc-minimal/README.md)

Extending the minimal configuration with a custom signing and encryption keystore, internal
token integrity keys as well as enabling a set of optional features. Steps assume you've finished
the previous steps.

1) Copy the configured index, feel free to check the diff after you do  
```
cp 01-oidc-configured/index.js src
```

2) Install the dependencies and generate keystores  
```
yarn
node 01-oidc-configured/generate-keys
```

3) Commit to your local repo  
```
git add .
git commit -a -m 'added keystores, enabled features'
```

4) Deploy to heroku  
```
git push heroku master
```

5) Done!  
```
heroku open '/.well-known/openid-configuration' # to see your new openid-configuration, now much with much more content
```

Next up [02-oidc-adapter](../02-oidc-adapter/README.md)
