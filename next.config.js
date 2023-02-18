// This file is used to configure Next.js
const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  reactStrictMode: true,
  assetPrefix: isProd ? '/gem5-resources-website/' : '',
  images: {
    loader: 'akamai',
    unoptimized: true,
  },
}