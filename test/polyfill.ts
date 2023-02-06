import _crypto from "node:crypto";

globalThis.crypto = _crypto.webcrypto as any;
