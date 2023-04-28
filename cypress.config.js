const { defineConfig } = require("cypress");
const config = require("./gem5.config.json")

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
    SCHEMA_URL: config.config.schemaUrl,
    PRIVATE_RESOURCES: config.config.resources,
    TABS: config.ui.tabs,
  },
});
