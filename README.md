# uncrypto

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![Github Actions][github-actions-src]][github-actions-href]
[![Codecov][codecov-src]][codecov-href]

This library provides a single API to use [web-crypto](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API) and [Subtle Crypto](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto) in both Node.js using [Crypto Module](https://nodejs.org/api/crypto.html#crypto) and Web targets using [Web Crypto API](https://nodejs.org/api/crypto.html#crypto) using [Conditional Exports](https://nodejs.org/api/packages.html#conditional-exports).

**Requirements:**

- **Node.js**: Version **15 and above** (this library provides no polyfills for older versions!)
- **Browser**: [Secure Context](https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts) (HTTPS/Localhost) in [Supported Browsers](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto#browser_compatibility)
- **Other Runtimes:** Exposed `globalThis.crypto` and `globalThis.crypto.subtle`. (you can polyfill if neeeded)

## Usage

Install package:

```sh
# npm
npm install uncrypto

# yarn
yarn add uncrypto

# pnpm
pnpm add uncrypto
```

Import:

```js
// ESM
import { subtle, randomUUID, getRandomValues } from "uncrypto";

// CommonJS
const { subtle, randomUUID, getRandomValues } = require("uncrypto");
```

To use JWT utilities, import from `uncrypto/jwt`:

```js
// ESM
import { decodeJWT, signJWT, verifyJWT } from "uncrypto/jwt";

// CommonJS
const { decodeJWT, signJWT, verifyJWT } = require("uncrypto/jwt");
```

## Development

- Clone this repository
- Install latest LTS version of [Node.js](https://nodejs.org/en/)
- Enable [Corepack](https://github.com/nodejs/corepack) using `corepack enable`
- Install dependencies using `pnpm install`
- Run interactive tests using `pnpm dev`

## License

Made with 💛

Published under [MIT License](./LICENSE).

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/uncrypto?style=flat-square
[npm-version-href]: https://npmjs.com/package/uncrypto
[npm-downloads-src]: https://img.shields.io/npm/dm/uncrypto?style=flat-square
[npm-downloads-href]: https://npmjs.com/package/uncrypto
[github-actions-src]: https://img.shields.io/github/actions/workflow/status/unjs/uncrypto/ci.yml?branch=main&style=flat-square
[github-actions-href]: https://github.com/unjs/uncrypto/actions?query=workflow%3Aci
[codecov-src]: https://img.shields.io/codecov/c/gh/unjs/uncrypto/main?style=flat-square
[codecov-href]: https://codecov.io/gh/unjs/uncrypto
