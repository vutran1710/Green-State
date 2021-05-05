module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  bail: 1,
  collectCoverage: true,
  coverageDirectory: '__coverage__',
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
    }
  }
};
