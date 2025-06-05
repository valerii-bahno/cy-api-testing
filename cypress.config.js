import { defineConfig } from "cypress";
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  projectId: '9jigtd',
  viewportHeight: 1080,
  viewportWidth: 1920,
  retries: {
    runMode: 1,
    openMode: 0
  },
  screenshotOnRunFailure: true,
  screenshotsFolder: 'cypress/screenshots',
  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    configFile: 'reporter-config.json',
  },

  e2e: {
    defaultCommandTimeout: 10000,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'https://conduit.bondaracademy.com/',
    specPattern: 'cypress/e2e/**/*.spec.{js,jsx,ts,tsx}',
  },
});