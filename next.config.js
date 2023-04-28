// This file is used to configure Next.js
const config = require('./gem5.config.json');

const isGithubActions = process.env.GITHUB_ACTIONS || false;
let assetPrefix = undefined
let basePath = ''

if (isGithubActions) {
  const repo = process.env.GITHUB_REPOSITORY.replace(/.*?\//, '')

  assetPrefix = `/${repo}/`
  basePath = `/${repo}`
}
let isProd = process.env.NODE_ENV === 'production'
// isProd = false;
// isProd = true;

if (!isProd) {
  assetPrefix = undefined;
  basePath = '';
}

// get path of the websie hosted on github pages from the environment variable
// https://realm.mongodb.com/api/client/v2.0/app/data-ejhjf/graphql
module.exports = {
  assetPrefix: assetPrefix,
  basePath: basePath,
  images: {
    unoptimized: true,
    loader: 'akamai',
    path: '',
  },
  env: {
    BASE_PATH: basePath,
    SCHEMA_URL: config.config.schemaUrl,
    PRIVATE_RESOURCES: config.config.resources,
    TABS: config.ui.tabs,
  },
  /* env: {
    BASE_PATH: basePath,
    SCHEMA_URL: "https://raw.githubusercontent.com/Gem5Vision/json-to-mongodb/simentic-version/schema/test.json",
    PRIVATE_RESOURCES: {
      "gem5-resources": {
        dataSource: "gem5-vision",
        database: "gem5-vision",
        collection: "resources",
        url: "https://data.mongodb-api.com/app/data-ejhjf/endpoint/data/v1",
        name: "data-ejhjf",
        apiKey: "pKkhRJGJaQ3NdJyDt69u4GPGQTDUIhHlx4a3lrKUNx2hxuc8uba8NrP3IVRvlzlo",
        isMongo: true,
      },
      "versions": {
        url: "https://raw.githubusercontent.com/Gem5Vision/json-to-mongodb/simentic-version/kiwi.json",
        isMongo: false,
      },
      "local": {
        url: "resources.json",
        isMongo: false,
      },
    },
  }, */
  webpack: (config) => {
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader',
    });
    return config;
  },
}