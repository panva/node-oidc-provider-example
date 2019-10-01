const fs = require('fs');
const path = require('path');
const jose = require('jose');

const keystore = new jose.JWKS.KeyStore();

Promise.all([
  keystore.generate('RSA', 2048, { use: 'sig' }),
  keystore.generate('RSA', 2048, { use: 'enc' }),
  keystore.generate('EC', 'P-256', { use: 'sig' }),
  keystore.generate('EC', 'P-256', { use: 'enc' }),
  keystore.generate('OKP', 'Ed25519', { use: 'sig' }),
]).then(() => {
  fs.writeFileSync(path.resolve('src/jwks.json'), JSON.stringify(keystore.toJWKS(true), null, 2));
});
