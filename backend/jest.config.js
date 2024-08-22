/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  preset: 'ts-jest',
  testEnvironment: "node",
  testMatch: ['**/__tests__/**/*.test.ts'],
  setupFilesAfterEnv: ['./jest.setup.ts'],
  // Transform TypeScript files using ts-jest
  transform: {
    "^.+.ts?$": ["ts-jest", {}],
  },
};