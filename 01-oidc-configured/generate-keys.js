const fs = require('fs');
const path = require('path');
const { createKeyStore } = require('oidc-provider');

const keystore = createKeyStore();

Promise.all([
  keystore.generate('RSA', 2048),
  keystore.generate('EC', 'P-256'),
  keystore.generate('EC', 'P-384'),
  keystore.generate('EC', 'P-521'),
]).then(() => {
  fs.writeFileSync(path.resolve('src/keystore.json'), JSON.stringify(keystore.toJSON(true), null, 2));
});
