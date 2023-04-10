// This file is used to configure Next.js
let isProd = process.env.NODE_ENV === 'production'
// isProd = false;
// isProd = true;

// get path of the websie hosted on github pages from the environment variable
// https://realm.mongodb.com/api/client/v2.0/app/data-ejhjf/graphql
module.exports = {
  assetPrefix: isProd ? '/gem5-resources-website/' : '',
  basePath: isProd ? '/gem5-resources-website' : '',
  images: {
    unoptimized: true,
    loader: 'imgix',
    path: '',
  },
  env: {
    IS_MONGODB_ENABLED: true,
    MONGODB_API_KEY: "pKkhRJGJaQ3NdJyDt69u4GPGQTDUIhHlx4a3lrKUNx2hxuc8uba8NrP3IVRvlzlo",
    COLLECTION: "resources",
    MONGODB_URI: "https://data.mongodb-api.com/app/data-ejhjf/endpoint/data/v1",
    BASE_PATH: isProd ? '/gem5-resources-website' : '',
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader',
    });
    return config;
  },
}