import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  entries: [
    "src/crypto-node", "src/crypto-web", "src/jwt"],
  clean: true,
  declaration: true,
  externals: ["uncrypto"],
  rollup: {
    emitCJS: true,
  }
});
