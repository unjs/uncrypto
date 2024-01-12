/*!
 * base-32.js
 * Copyright(c) 2024 Reaper
 * MIT Licensed
 */

// Simple implementation based of RFC 4648 for base32 encoding and decoding

const pad = "=";
const base32alphaMap = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
];

export const encode = (str: string) => {
  const splits = [...str];

  if (splits.length === 0) {
    return "";
  }

  const binaryGroup = [];
  let bitText = "";

  for (const c of splits) {
    bitText += toBinary(c);

    if (bitText.length === 40) {
      binaryGroup.push(bitText);
      bitText = "";
    }
  }

  if (bitText.length > 0) {
    binaryGroup.push(bitText);
    bitText = "";
  }

  return binaryGroup
    .map((x) => {
      const fiveBitGrouping = [];
      let lex = "";
      const bitOn = x;

      for (const d of bitOn) {
        lex += d;
        if (lex.length === 5) {
          fiveBitGrouping.push(lex);
          lex = "";
        }
      }

      if (lex.length > 0) {
        fiveBitGrouping.push(lex.padEnd(5, "0"));
        lex = "";
      }

      let paddedArray = [...fiveBitGrouping];
      paddedArray.length = 8;
      paddedArray = paddedArray.fill("-1", fiveBitGrouping.length, 8);

      return paddedArray
        .map((f) => {
          if (f === "-1") {
            return pad;
          }
          const key = Number.parseInt(f, 2).toString(
            10
          ) as unknown as keyof typeof base32alphaMap;
          return base32alphaMap[key];
        })
        .join("");
    })
    .join("");
};

export const decode = (str: string) => {
  const overallBinary = [...str]
    .map((x) => {
      if (x === pad) {
        return "00000";
      }
      const decodePoint = base32alphaMap.indexOf(x);
      const binary = decodePoint.toString(2);
      return binary.padStart(5, "0");
    })
    .join("");

  const characterBitGrouping = chunk([...overallBinary], 8);
  return characterBitGrouping
    .map((x) => {
      const binaryL = x.join("");
      const str = String.fromCodePoint(
        +Number.parseInt(binaryL, 2).toString(10)
      );
      return str.replace("\u0000", "");
    })
    .join("");
};

const toBinary = (char: string, padLimit = 8) => {
  // need ascii values
  // eslint-disable-next-line unicorn/prefer-code-point
  const binary = String(char).charCodeAt(0).toString(2);
  return binary.padStart(padLimit, "0");
};

const chunk = <T>(
  arr: Array<T>,
  chunkSize = 1,
  cache: Array<Array<T>> = []
) => {
  const tmp = [...arr];
  if (chunkSize <= 0) {
    return cache;
  }
  while (tmp.length > 0) {
    cache.push(tmp.splice(0, chunkSize));
  }
  return cache;
};
