module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\\.js$": "babel-jest",
  },
  setupFilesAfterEnv: ["<rootDir>/src/tests/setupHooks.js"],
};