
/**
 * Jest configuration for visual regression testing
 */

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testMatch: [
    "**/tests/visual/**/*.visual.test.{ts,tsx}"
  ],
  setupFilesAfterEnv: [
    "<rootDir>/src/tests/visual/setup.ts"
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy"
  },
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};
