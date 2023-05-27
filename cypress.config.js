const { defineConfig } = require("cypress");
const config = require("./gem5.config.json")
const schema = require("./cypress/fixtures/schema.json")

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: "http://localhost:3000",
    experimentalRunAllSpecs: true,
  },
  video: false,
  screenshot: false,
  env: {
    BASE_PATH: "",
    SOURCES: config.config.sources,
    TABS: config.ui.tabs,
    SCHEMA: schema,
  },
});
