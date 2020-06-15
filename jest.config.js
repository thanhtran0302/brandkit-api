module.exports = {
  testPathIgnorePatterns: ['<rootDir>/build/', '<rootDir>/node_modules/'],
  collectCoverageFrom: ['./**/*.{ts}', '!./**/*.d.ts'],
  coverageReporters: ['text', 'json-summary'],
  preset: 'ts-jest',
  testEnvironment: 'node'
};
