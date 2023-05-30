// This file is used to configure Next.js
const config = require('./gem5.config.json');

assetPrefix = undefined;
basePath = '';

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
