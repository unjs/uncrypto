import subtle from "uncrypto";

const algoMap = {
  sha1: "SHA-1",
  sha256: "SHA-256",
  sha512: "SHA-512",
};

export type AlgoEnum = "sha1" | "sha256" | "sha512";

export async function createHmac(
  algorithm: AlgoEnum,
  secret: string,
  data: Buffer
) {
  // let enc
  // if (TextEncoder.constructor.length == 1) {
  //   // @ts-ignore
  //   enc = new TextEncoder('utf-8')
  // } else {
  //   enc = new TextEncoder()
  // }

  const key = await subtle.importKey(
    "raw", // raw format of the key - should be Uint8Array
    secret,
    {
      // algorithm details
      name: "HMAC",
      hash: { name: algoMap[algorithm] },
    },
    false, // export = false
    ["sign", "verify"] // what this key can do
  );
  const signature = await subtle.sign("HMAC", key, data);
  return Buffer.from(signature);
}
