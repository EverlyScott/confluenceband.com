/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  images: {
    remotePatterns: [
      new URL("https://r2.everly.page/**"),
      new URL("https://r2.confluenceband.com/**"),
    ],
    imageSizes: [1024, 3000],
  },
};

export default config;
