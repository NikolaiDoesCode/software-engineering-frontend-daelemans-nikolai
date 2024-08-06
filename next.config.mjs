/** @type {import('next').NextConfig} */
import { i18n } from './next-i18next.config.js';

const nextConfig = {
  reactStrictMode: true,
  output:'standalone',
  hasteImplModulePathIgnorePatterns: [".next/standalone/package.json"],
  i18n,
};
/* module.exports = nextConfig*/
export default nextConfig;

