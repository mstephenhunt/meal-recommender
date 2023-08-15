import * as path from 'path';

module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  preset: 'ts-jest',
  testEnvironment: path.join(__dirname, './test/prisma-test-environment.ts'),
  modulePaths: ['<rootDir>/src'],
  testMatch: ['**/*.integration.test.ts'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  globalSetup: path.join(__dirname, './test/global-test-setup.ts'),
};
