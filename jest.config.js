module.exports = {
  preset: "jest-expo",

  // Transform node_modules for React Native and Expo packages
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg)",
  ],

  // Test environment
  testEnvironment: "node",

  // Module paths
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],

  // Setup files
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],

  // Coverage configuration
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.web.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/*.types.ts",
    "!**/__tests__/**",
    "!**/__mocks__/**",
  ],

  coverageDirectory: "coverage",

  coverageReporters: ["text", "lcov", "html"],

  // Test match patterns
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],

  // Module name mapper for path aliases
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  // Coverage thresholds (optional but recommended)
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};
