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
    BASE_PATH: isProd ? '/gem5-resources-website' : '',
    PRIVATE_RESOURCES: {
      "versions": {
        dataSource: "gem5-vision",
        database: "gem5-vision",
        collection: "versions_test",
        url: "https://data.mongodb-api.com/app/data-ejhjf/endpoint/data/v1",
        name: "data-ejhjf",
        apiKey: "pKkhRJGJaQ3NdJyDt69u4GPGQTDUIhHlx4a3lrKUNx2hxuc8uba8NrP3IVRvlzlo",
      },
      "atharav": {
        dataSource: "gem5-vision",
        database: "gem5-vision",
        collection: "versions_test",
        url: "https://data.mongodb-api.com/app/data-ejhjf/endpoint/data/v1",
        name: "data-ejhjf",
        apiKey: "pKkhRJGJaQ3NdJyDt69u4GPGQTDUIhHlx4a3lrKUNx2hxuc8uba8NrP3IVRvlzlo",
      },
      /* "gem5-resources": {
        dataSource: "gem5-vision",
        database: "gem5-vision",
        collection: "resources",
        url: "https://data.mongodb-api.com/app/data-ejhjf/endpoint/data/v1",
        name: "data-ejhjf",
        apiKey: "pKkhRJGJaQ3NdJyDt69u4GPGQTDUIhHlx4a3lrKUNx2hxuc8uba8NrP3IVRvlzlo",
      },
      "test": {
        name: "data-ejhjf",
        url: "https://data.mongodb-api.com/app/data-ejhjf/endpoint/data/v1",
        dataSource: "gem5-vision",
        database: "gem5-vision",
        collection: "resources_test",
        apiKey: "pKkhRJGJaQ3NdJyDt69u4GPGQTDUIhHlx4a3lrKUNx2hxuc8uba8NrP3IVRvlzlo",
      } */
    },
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader',
    });
    return config;
  },
}