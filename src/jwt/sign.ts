import {
  DEFAULT_HASH_METHODS,
  DEFAULT_SIGNATURE_METHOD,
  createSignature,
  encodeToBase64Url,
  importKey,
} from "./utils";
import type { JWTRegisteredClaims } from "./types";

const signatureMap: Record<string, string> = {
  HMAC: "HS",
  RSA: "RS",
  ECDSA: "ES",
};

export async function signJWT<
  T extends Record<string, any> = Record<string, any>
>({
  payload = {} as T,
  secret,
  issuer,
  audience,
  expires = 30,
  signatureMethod = DEFAULT_SIGNATURE_METHOD,
  hashMethod = DEFAULT_HASH_METHODS,
}: {
  payload?: T;
  secret: string;
  issuer: string;
  audience: string;
  /**
   * Expiration time in days
   * @default 30
   */
  expires?: number;
  /** @default 'HMAC' */
  signatureMethod?: string;
  /** @default 'SHA-256' */
  hashMethod?: string;
}) {
  const key = await importKey({
    secret,
    name: signatureMethod,
    hash: hashMethod,
  });
  const header = {
    typ: "JWT",
    alg: `${signatureMap[signatureMethod]}${hashMethod.replace("-", "")}`,
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
