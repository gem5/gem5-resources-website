// This file is used to configure Next.js
const config = require('./gem5.config.json');

basePath = "";
if (basePath === "") {
  assetPrefix = ""
} else {
  assetPrefix = basePath + '/'
}

let isProd = process.env.NODE_ENV === 'production'
if (!isProd) {
  basePath = ""
  assetPrefix = ""
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
