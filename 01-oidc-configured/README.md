# oidc-configured

Previous [00-oidc-minimal](../00-oidc-minimal/README.md)

Extending the minimal configuration with custom signing keys. Steps assume you've finished
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
git commit -a -m 'added signing keys'
```

4) Deploy to heroku  
```bash
git push heroku main
```

5) Done!  
```bash
heroku open '/jwks' # to see your configured JWKS in effect
```

Next up [02-oidc-adapter](../02-oidc-adapter/README.md)

> **HINT**: For more details consider documentation, configuration and details found in the [oidc-provider repository](https://github.com/panva/node-oidc-provider).
