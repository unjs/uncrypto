import {
  DEFAULT_HASH_METHODS,
  DEFAULT_SIGNATURE_METHOD,
  createSignature,
  encodeToBase64Url,
  importKey,
} from "./_utils";
import type { JWTRegisteredClaims, SignJWTOptions } from "./types";

const headerAlgMap: Record<string, string> = {
  HMAC: "HS",
  RSA: "RS",
  ECDSA: "ES",
};

export async function signJWT<
  T extends Record<string, unknown> = Record<string, unknown>
>(options: SignJWTOptions<T>) {
  const {
    payload,
    secret,
    issuer,
    audience,
    expires,
    signatureMethod,
    hashMethod,
  } = {
    payload: {} as T,
    expires: 30,
    signatureMethod: DEFAULT_SIGNATURE_METHOD,
    hashMethod: DEFAULT_HASH_METHODS,
    ...options,
  };

  const key = await importKey({
    secret,
    name: signatureMethod,
    hash: hashMethod,
  });

  const header = {
    typ: "JWT",
    alg: `${headerAlgMap[signatureMethod]}${hashMethod.split("-")[1]}`,
  };
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + expires * 24 * 60 * 60;
  const jwtPayload: JWTRegisteredClaims & T = {
    ...payload,
    iss: issuer,
    aud: audience,
    iat,
    exp,
  };

  const signature = await createSignature(
    key,
    signatureMethod,
    `${encodeToBase64Url(header)}.${encodeToBase64Url(jwtPayload)}`
  );
  return `${encodeToBase64Url(header)}.${encodeToBase64Url(
    jwtPayload
  )}.${signature}`;
}
