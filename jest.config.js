// jest.config.js
module.exports = {
  testEnvironment: 'node',
  verbose: true,
  // Stop running tests after first failure
  bail: 1, 
  // Ignore frontend React app tests; they are run separately via CRA
  testPathIgnorePatterns: [
    "/node_modules/",
    "<rootDir>/insurance-frontend/"
  ],
  // Setup coverage
  collectCoverage: false,
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 75,
      lines: 75,
      statements: 75
    }
  }
};
