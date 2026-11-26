import { defineConfig, devices } from "@playwright/test";
export default defineConfig ({
    testDir: "./tests",

    use: {
        baseURL: "https://www.saucedemo.com/",
        trace: 'on-first-retry',
    },

    reporter: 'html',

    projects: [
        {
            name: 'chromium',
            use: {...devices['Desktop Chrome']},
        },
        {
            name: 'firefox',
            use: {...devices['Desktop Firefox']},
        },
        {
            name: 'webkit',
            use: {...devices['Desktop Safari']},
        },
    ]
});