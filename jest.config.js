module.exports = {
  roots: ['<rootDir>/test'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['<rootDir>/test/**/*.ts'],
  testEnvironment: 'node',
  transform: {
    '.+\\.ts$': 'ts-jest'
  },
  clearMocks: true,
  collectCoverage: true,
  coverageProvider: 'v8'
}
