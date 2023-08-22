import { decodeFromBase64Url } from "./_utils";
import type { JWTRegisteredClaims } from "./types";

export function decodeJWT<
  T extends Record<string, unknown> = Record<string, unknown>
>(token: string) {
  try {
    return _decodeJWT<T>(token);
  } catch {}
}

// --- Internal ---

function _decodeJWT<
  T extends Record<string, unknown> = Record<string, unknown>
>(token: string) {
  const parts = String(token).split(".");
  if (parts.length !== 3) {
    throw new Error("Invalid token format");
  }

  const [, payload] = parts;
  return JSON.parse(decodeFromBase64Url(payload)) as JWTRegisteredClaims & T;
}
