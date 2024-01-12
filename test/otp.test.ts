import { expect, it, describe } from "vitest";
import { generateTOTPSecret, isTOTPValid, totp } from "../src/otp/otp";

describe("uncrypto:otp", () => {
  it("will generate 2 different secrets", () => {
    const secret = generateTOTPSecret();
    const secret2 = generateTOTPSecret();
    expect(secret).not.eq(secret2);
  });

  it("dynamic isValid", async () => {
    const secret = generateTOTPSecret();
    const period = 60;
    const opts = {
      period: period,
    };
    const otp = await totp(secret, undefined, opts);
    expect(await isTOTPValid(secret, otp, opts)).is.true;
  });

  it("static is valid", async () => {
    const secret = "JFLVYRQGJ5ZFOLSYO5HVOWIZGAYHOCTEGNLE2JYMNAMTCET3A5VQ====";
    const d = 1704875845134;
    const otp = await totp(secret, d / 1000);
    expect(otp).is.eq("" + 881718);
  });
});
