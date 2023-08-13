const webCrypto = globalThis.crypto;

export const subtle: Crypto["subtle"] = webCrypto.subtle;

export const randomUUID: Crypto["randomUUID"] = () => {
  return webCrypto.randomUUID();
};

export const getRandomValues: Crypto["getRandomValues"] = (array: any) => {
  return webCrypto.getRandomValues(array);
};

const _crypto: Crypto = {
  randomUUID,
  getRandomValues,
  subtle,
};

export default _crypto;
