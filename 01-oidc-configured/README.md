# oidc-configured

Previous [00-oidc-minimal](../00-oidc-minimal/README.md)

Extending the minimal configuration with a custom signing and encryption keystore, internal
token integrity keys as well as enabling a set of optional features. Steps assume you've finished
the previous steps.

1) Copy the configured index, feel free to check the diff after you do  
```bash
cp 01-oidc-configured/index.js src
```

2) Install the dependencies and generate keystores  
```bash
npm i
node 01-oidc-configured/generate-keys
```

3) Commit to your local repo  
```bash
git add .
git commit -a -m 'added keystores, enabled features'
```

4) Deploy to heroku  
```bash
git push heroku master
```

5) Done!  
```bash
heroku open '/.well-known/openid-configuration' # to see your new openid-configuration, now much with much more content
```

Next up [02-oidc-adapter](../02-oidc-adapter/README.md)

> **HINT**: For more details consider documentation, configuration and details found in the [oidc-provider documentation](https://github.com/panva/node-oidc-provider)
