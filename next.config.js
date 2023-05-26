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

if (!isProd) {
  assetPrefix = undefined;
  basePath = '';
}

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
    SOURCES: config.config.sources,
    TABS: config.ui.tabs,
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader',
    });
    return config;
  },
}