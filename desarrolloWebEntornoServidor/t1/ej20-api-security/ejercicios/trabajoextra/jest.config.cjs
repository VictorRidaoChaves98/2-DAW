module.exports = {
    testEnvironment: "node",
    transform: {
        "^.+\\.js$": "babel-jest"
    }
    ,setupFiles: ["<rootDir>/src/tests/setup.js"]
};
