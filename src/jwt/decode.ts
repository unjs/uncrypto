import { decodeFromBase64Url } from "./utils";
import type { JWTRegisteredClaims } from "./types";

export function decodeJWT<T extends Record<string, any> = Record<string, any>>(
  token: string
) {
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new Error("Invalid token format");
  }

  const [, payload] = parts;
  return JSON.parse(decodeFromBase64Url(payload)) as JWTRegisteredClaims & T;
}
