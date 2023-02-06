import nodeCrypto from "node:crypto";

export const subtle: Crypto["subtle"] = nodeCrypto.webcrypto?.subtle || {};

export const randomUUID: Crypto["randomUUID"] = () => {
  return nodeCrypto.randomUUID();
};

export const getRandomValues: Crypto["getRandomValues"] = (array: any) => {
  return nodeCrypto.webcrypto.getRandomValues(array);
};

const _crypto: Crypto = {
  randomUUID,
  getRandomValues,
  subtle,
};

export default _crypto;
