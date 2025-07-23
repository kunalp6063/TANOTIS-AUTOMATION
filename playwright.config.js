const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30000,

  
  reporter: [
    ['list'],
    ['allure-playwright']
  ],

  use: {
    headless: true,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    }
  ]
});

