# example setup of oidc-provider

By following this example you will set up an [oidc-provider](https://github.com/panva/node-oidc-provider)
instance on Heroku.

Prerequisites

- node 8.0.0 or newer
- heroku cli installed (`which heroku`)
- heroku cli authenticated (`heroku whoami`)
- wget
- git
- yarn


Start [here](00-oidc-minimal).

NB
---
By no means is oidc-provider limited to only run on heroku or only using the showcased options.

Supported deployments include mounting the OP to an existing nodejs application, either
koa or express. Running those using cluster mode spread across several hosts, behind haproxy, nginx,
ELB or exposing an https server directly.

It is possible to run a completely standalone app for interactions and it's also possible to run
oidc-provider on AWS Lambda.

Adapters that have been seen include MongoDB, PostgreSQL, redis, DynamoDB, REST Api
