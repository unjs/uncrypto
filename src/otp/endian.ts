export function bigEndian64(hash: bigint) {
  const buf = Buffer.allocUnsafe(64 / 8);
  buf.writeBigInt64BE(hash, 0);
  return buf;
}
