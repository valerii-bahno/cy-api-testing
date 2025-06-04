import { defineConfig } from "cypress";

module.exports = defineConfig({
  projectId: '9jigtd',
})

export default defineConfig({
  viewportHeight: 1080,
  viewportWidth: 1920,
  e2e: {
    defaultCommandTimeout: 10000,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },

    baseUrl: 'https://conduit.bondaracademy.com/',
    specPattern: 'cypress/e2e/**/*.spec.{js,jsx,ts,tsx}',
  },
});
