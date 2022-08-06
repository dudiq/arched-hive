module.exports = {
  roots: ['<rootDir>/src'],
  resetMocks: true,
  testEnvironment: 'node',
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
  transform: {
    '^.+\\.ts$': 'esbuild-jest',
  },
  moduleFileExtensions: ['js', 'ts'],
}
