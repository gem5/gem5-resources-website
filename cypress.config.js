const { defineConfig } = require("cypress");

const isGithubActions = process.env.GITHUB_ACTIONS || false;
let assetPrefix = undefined
let basePath = ''

if (isGithubActions) {
  const repo = process.env.GITHUB_REPOSITORY.replace(/.*?\//, '')

  assetPrefix = `/${repo}/`
  basePath = `/${repo}`
}

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: "http://localhost:3000" + basePath,
  },
});
