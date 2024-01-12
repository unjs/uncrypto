import { getRandomValues } from "uncrypto";

import { decode, encode } from "./base32.js";
import { AlgoEnum, createHmac } from "./hmac.js";
import { bigEndian64 } from "./endian";

interface TOTPURLOptions {
  company: string;
  email: string;
}

const { floor } = Math;

/**
 * @param {string} secret - the secret to be used, needs to be a base32 encoded string
 * @param {number} when - point of time in seconds (default: Date.now()/1000)
 * @param {object} [options]
 * @param {number} [options.period] in seconds (eg: 30 => 30 seconds)
 * @param {import("./hmac.js").AlgoEnum} [options.algorithm] (default: sha512)
 * @returns {Promise<string>}
 */
export async function totp(
  secret: string,
  when = floor(Date.now() / 1000),
  options = {}
) {
  const _options = Object.assign(
    {
      period: 30,
      algorithm: "sha512" as AlgoEnum,
    },
    options
  );
  const now = floor(when / _options.period);
  const key = decode(secret);
  const buff = bigEndian64(BigInt(now));
  const hmac = await createHmac(_options.algorithm, key, buff);
  const offset = hmac[hmac.length - 1] & 0xf;
  const truncatedHash = hmac.subarray(offset, offset + 4);
  const otp = (
    (truncatedHash.readInt32BE() & 0x7f_ff_ff_ff) %
    1_000_000
  ).toString(10);
  return otp.length < 6 ? `${otp}`.padStart(6, "0") : otp;
}

/**
 * @param {string} secret - the secret to be used, needs to be a base32 encoded string
 * @param {string} totpToken - the totp token
 * @param {object} [options]
 * @param {number} [options.period] in seconds (eg: 30 => 30 seconds)
 * @param {import("./hmac.js").AlgoEnum} [options.algorithm] (default: sha512)
 * @returns {Promise<boolean>}
 */
export async function isTOTPValid(
  secret: string,
  totpToken: string,
  options = {}
) {
  const _options = Object.assign({ period: 30, algorithm: "sha512" }, options);
  for (let index = -2; index < 3; index += 1) {
    const fromSys = await totp(secret, Date.now() / 1000 + index, _options);
    const valid = fromSys === totpToken;
    if (valid) return true;
  }
  return false;
}

export function generateTOTPURL(secret: string, options: TOTPURLOptions) {
  const parameters = new URLSearchParams();
  parameters.append("secret", secret);
  parameters.append("issuer", options.company);
  parameters.append("digits", "6");
  const url = `otpauth://totp/${options.company}:${
    options.email
  }?${parameters.toString()}`;
  return new URL(url).toString();
}

export function generateTOTPSecret(num = 32) {
  const array = new Uint32Array(num);
  const vals = getRandomValues(array);
  return encode(Buffer.from(vals).toString("ascii"));
}
