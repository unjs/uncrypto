/*!
 * base-32.js
 * Copyright(c) 2024 Reaper
 * MIT Licensed
 */

// Simple implementation based of RFC 4648 for base32 encoding and decoding

const pad = "=";
const base32alphaMap = {
  0: "A",
  1: "B",
  2: "C",
  3: "D",
  4: "E",
  5: "F",
  6: "G",
  7: "H",
  8: "I",
  9: "J",
  10: "K",
  11: "L",
  12: "M",
  13: "N",
  14: "O",
  15: "P",
  16: "Q",
  17: "R",
  18: "S",
  19: "T",
  20: "U",
  21: "V",
  22: "W",
  23: "X",
  24: "Y",
  25: "Z",
  26: "2",
  27: "3",
  28: "4",
  29: "5",
  30: "6",
  31: "7",
};

const base32alphaMapDecode = Object.fromEntries(
  Object.entries(base32alphaMap).map(([k, v]) => [v, k])
);

export const encode = (str: string) => {
  const splits = str.split("");

  if (!splits.length) {
    return "";
  }

  let binaryGroup = [];
  let bitText = "";

  splits.forEach((c) => {
    bitText += toBinary(c);

    if (bitText.length == 40) {
      binaryGroup.push(bitText);
      bitText = "";
    }
  });

  if (bitText.length > 0) {
    binaryGroup.push(bitText);
    bitText = "";
  }

  return binaryGroup
    .map((x) => {
      let fiveBitGrouping = [];
      let lex = "";
      let bitOn = x;

      bitOn.split("").forEach((d) => {
        lex += d;
        if (lex.length == 5) {
          fiveBitGrouping.push(lex);
          lex = "";
        }
      });

      if (lex.length > 0) {
        fiveBitGrouping.push(lex.padEnd(5, "0"));
        lex = "";
      }

      let paddedArray = Array.from(fiveBitGrouping);
      paddedArray.length = 8;
      paddedArray = paddedArray.fill("-1", fiveBitGrouping.length, 8);

      return paddedArray
        .map((f) => {
          if (f == "-1") {
            return pad;
          }
          const key = parseInt(f, 2).toString(
            10
          ) as unknown as keyof typeof base32alphaMap;
          return base32alphaMap[key];
        })
        .join("");
    })
    .join("");
};

export const decode = (str: string) => {
  const overallBinary = str
    .split("")
    .map((x) => {
      if (x === pad) {
        return "00000";
      }
      const d = base32alphaMapDecode[x];
      const binary = parseInt(d, 10).toString(2);
      return binary.padStart(5, "0");
    })
    .join("");

  const characterBitGrouping = chunk(overallBinary.split(""), 8);
  return characterBitGrouping
    .map((x) => {
      const binaryL = x.join("");
      const str = String.fromCharCode(+parseInt(binaryL, 2).toString(10));
      return str.replace("\x00", "");
    })
    .join("");

  return "";
};

const toBinary = (char: string, padLimit = 8) => {
  const binary = String(char).charCodeAt(0).toString(2);
  return binary.padStart(padLimit, "0");
};

const chunk = <T>(
  arr: Array<T>,
  chunkSize = 1,
  cache: Array<Array<T>> = []
) => {
  const tmp = [...arr];
  if (chunkSize <= 0) return cache;
  while (tmp.length) cache.push(tmp.splice(0, chunkSize));
  return cache;
};
