'use strict';

const fs = require('fs');
const path = require('path');
const createKeyStore = require('oidc-provider').createKeyStore;

const integrity = createKeyStore();
const keystore = createKeyStore();

Promise.all([
  integrity.generate('oct', 512, { alg: 'HS512', use: 'sig' }),
  keystore.generate('RSA', 2048),
  keystore.generate('EC', 'P-256'),
  keystore.generate('EC', 'P-384'),
  keystore.generate('EC', 'P-521'),
]).then(() => {
  fs.writeFileSync(path.resolve('src/integrity.json'), JSON.stringify(integrity.toJSON(true), null, 2));
  fs.writeFileSync(path.resolve('src/keystore.json'), JSON.stringify(keystore.toJSON(true), null, 2));
});
