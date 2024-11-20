module.exports = {
    testEnvironment: "jest-environment-jsdom", // Explicitly specify JSDOM
    roots: ["<rootDir>/tests"], // Directory containing the test files
    testMatch: ["**/*.test.(ts|tsx)"], // Matches test files with .test.ts/.test.tsx extensions
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest", // Use ts-jest for TypeScript files
    },
    moduleNameMapper: {
        "\\.(css|scss)$": "identity-obj-proxy", // Mock CSS imports
    },
    setupFilesAfterEnv: ["<rootDir>/tests/setupTests.ts"], // Setup file for testing environment
    testEnvironment: "jsdom", // Simulates a browser environment
};
