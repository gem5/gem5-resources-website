// This file is used to configure Next.js
let isProd = process.env.NODE_ENV === 'production'
// isProd = false;

// get path of the websie hosted on github pages from the environment variable
module.exports = {
  assetPrefix: isProd ? '/gem5-resources-website/' : '',
  basePath: isProd ? '/gem5-resources-website' : '',
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