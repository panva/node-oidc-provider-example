# example setup of oidc-provider

By following this example you will set up an [oidc-provider](https://github.com/panva/node-oidc-provider)
instance on Heroku.

Prerequisites

- node ^12.19.0 || ^14.15.0
- heroku cli installed (`which heroku`)
- heroku cli authenticated (`heroku whoami`)
- wget
- git


Start [here](00-oidc-minimal).

NB
---
By no means is oidc-provider limited to only run on heroku or only using the showcased options. The user-interactions are also ONLY intended to show how these are to be provided and maintained. Features such as sign-up, password resets and security measures like csrf, rate limiting, captcha - that's all on you and isn't a part of the protocol implementation provided by oidc-provider.

Supported deployments include mounting the OP to an existing nodejs application, e.g. connect, express, fastify, hapi, koa, or nest. Running those using cluster mode spread across several hosts, behind haproxy, nginx,
ELB or exposing an https server directly.

It is possible to run a completely standalone app for interactions and it's also possible to run
oidc-provider on AWS Lambda.

Adapters that have been seen include MongoDB, PostgreSQL, redis, DynamoDB, REST Api

> **HINT**: For more details consider documentation, configuration and details found in the [oidc-provider repository](https://github.com/panva/node-oidc-provider).
