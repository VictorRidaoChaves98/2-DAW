module.exports = {
    testEnvironment: "node",
    transform: {
        "^.+\\.js$": "babel-jest"
    }
    ,setupFiles: ["<rootDir>/tests/setup.js"],
    testMatch: ["<rootDir>/tests/**/*.test.js"],
    testPathIgnorePatterns: ["/node_modules/", "<rootDir>/src/tests/"]
};
