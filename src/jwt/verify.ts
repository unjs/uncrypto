import {
  DEFAULT_HASH_METHODS,
  DEFAULT_SIGNATURE_METHOD,
  decodeFromBase64Url,
  decodeFromBase64UrlToBuffer,
  importKey,
  textEncoder,
} from "./_utils";
import type { JWTRegisteredClaims, VerifyJWTOptions } from "./types";
// @ts-expect-error: will resolve at runtime
import { subtle } from "uncrypto";

export async function verifyJWT(options: VerifyJWTOptions) {
  const {
    token,
    secret,
    issuer,
    audience,
    leeway = 60,
    signatureMethod = DEFAULT_SIGNATURE_METHOD,
    hashMethod = DEFAULT_HASH_METHODS,
  } = { ...options };

  const [header, payload, signature] = String(token).split(".");
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

  let decodedPayload: JWTRegisteredClaims;

  try {
    decodedPayload = JSON.parse(decodeFromBase64Url(payload));
  } catch {
    throw new Error("Invalid JWT payload");
  }

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
