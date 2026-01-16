import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname, // ensure Nest.js uses app/ as root
  },
  /* you can keep other config option here */
};

export default nextConfig;
