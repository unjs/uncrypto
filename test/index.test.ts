import { expect, it, describe } from "vitest";
import "./polyfill";

import * as uncryptoNode from "../src/crypto.node";
import * as uncryptoWeb from "../src/crypto.web";

describe("uncrypto:node", () => {
  runTests(uncryptoNode);
});

describe("uncrypto:web", () => {
  runTests(uncryptoWeb);
});

function runTests(crypto: Crypto) {
  it("randomUUID", () => {
    expect(crypto.randomUUID()).toMatch(
      /^[\dA-Fa-f]{8}(?:\b-[\dA-Fa-f]{4}){3}\b-[\dA-Fa-f]{12}$/
    );
  });

  it("getRandomValues", () => {
    const array = new Uint32Array(3);
    crypto.getRandomValues(array);
    expect(array[0]).not.toBe(0);
    expect(array[1]).not.toBe(0);
    expect(array[2]).not.toBe(0);
  });

  it("subtle", () => {
    expect(Object.keys(crypto.subtle)).toMatchInlineSnapshot("[]");
  });
}
