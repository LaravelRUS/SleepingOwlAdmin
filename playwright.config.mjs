import { defineConfig } from '@playwright/test'

const baseURL = 'http://127.0.0.1:4173'

export default defineConfig({
    outputDir: 'test-results/playwright',
    testDir: 'tests/frontend/browser',
    testMatch: '**/*.spec.js',
    use: {
        baseURL,
        trace: 'retain-on-failure',
    },
    webServer: {
        command: 'node tests/frontend/browser/fixture-server.mjs',
        reuseExistingServer: false,
        url: baseURL,
    },
})
