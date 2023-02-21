// This file is used to configure Next.js
const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  // assetPrefix: isProd ? '/gem5-resources-website/' : '',
  // basePath: isProd ? '/gem5-resources-website' : '',
  images: {
    unoptimized: true,
    loader: 'imgix',
    path: '',
  },
  env: {
    IS_MONGODB_ENABLED: process.env.IS_MONGODB_ENABLED,
    MONGODB_URI: process.env.MONGODB_URI,
    MONGODB_API_KEY: process.env.MONGODB_API_KEY,
  }
}