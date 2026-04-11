const { connectDB, closeDB, clearDB } = require("./setup");

const path = require('path');

beforeAll(async () => {
  // Skip for integration tests that handle their own DB connection
  const testPath = expect.getState().testPath;
  if (testPath && testPath.includes('integration')) {
    return;
  }
  await connectDB();
});

afterEach(async () => {
  const testPath = expect.getState().testPath;
  if (testPath && testPath.includes('integration')) {
    return;
  }
  await clearDB();
});

afterAll(async () => {
  const testPath = expect.getState().testPath;
  if (testPath && testPath.includes('integration')) {
    return;
  }
  await closeDB();
}, 10000);
