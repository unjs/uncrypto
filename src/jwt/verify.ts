import {
  DEFAULT_HASH_METHODS,
  DEFAULT_SIGNATURE_METHOD,
  decodeFromBase64Url,
  decodeFromBase64UrlToBuffer,
  importKey,
  textEncoder,
} from "./utils";
import type { JWTRegisteredClaims } from "./types";
// @ts-expect-error: will resolve at runtime
import { subtle } from "uncrypto";

export async function verifyJWT({
  token,
  secret,
  issuer,
  audience,
  leeway = 60,
  signatureMethod = DEFAULT_SIGNATURE_METHOD,
  hashMethod = DEFAULT_HASH_METHODS,
}: {
  token: string;
  secret: string;
  issuer: string;
  audience: string;
  /** @default 60 */
  leeway?: number;
  /** @default 'HMAC' */
  signatureMethod?: string;
  /** @default 'SHA-256' */
  hashMethod?: string;
}) {
  const [header, payload, signature] = token.split(".");
  const key = await importKey({
    secret,
    usage: "verify",
    name: signatureMethod,
    hash: hashMethod,
  });

  const isValid = await subtle.verify(
    signatureMethod,
    key,
    decodeFromBase64UrlToBuffer(signature),
    textEncoder.encode(`${header}.${payload}`)
  );

  if (!isValid) {
    throw new Error("Invalid JWT signature");
  }

  const decodedPayload = JSON.parse(
    decodeFromBase64Url(payload)
  ) as JWTRegisteredClaims;
  const now = Math.floor(Date.now() / 1000);

  if (
    issuer !== decodedPayload.iss ||
    (Array.isArray(decodedPayload.aud)
      ? !decodedPayload.aud.includes(audience)
      : audience !== decodedPayload.aud) ||
    (decodedPayload.exp && now > decodedPayload.exp + leeway) ||
    (decodedPayload.nbf && now < decodedPayload.nbf - leeway)
  ) {
    throw new Error("Invalid JWT claims");
  }
}
