# Testing Guide

This document describes the testing setup for the expo-drawing module.

## Overview

The project uses Jest with the `jest-expo` preset for unit testing. Tests are configured to work with Expo's native module mocking system and generate coverage reports compatible with Codecov.

## Running Tests

### Basic Commands

```bash
# Run all tests
yarn test

# Run tests in watch mode (for development)
yarn test:watch

# Run tests with coverage report
yarn test:coverage
```

### CI Command

The CI pipeline runs tests with the following command:

```bash
yarn test --coverage --maxWorkers=2
```

## Test Structure

Tests are organized in the `__tests__/` directory at the root of the project:

```
__tests__/
├── ExpoDrawingModule.test.ts    # Tests for the native module interface
├── ExpoDrawingView.test.tsx     # Tests for the React component
└── index.test.ts                # Tests for module exports
```

## Mocking Native Modules

Native module mocking is handled through the `mocks/ExpoDrawing.ts` file and configured in `jest.setup.js`. The mock intercepts calls to `requireNativeModule('ExpoDrawing')` and returns Jest mock functions.

### Mock Structure

The mock provides:

- `PI`: A constant property (Math.PI)
- `hello()`: A mock function returning 'Hello from ExpoDrawing!'
- `setValueAsync(value)`: A mock async function
- `addListener()` and `removeListeners()`: Mock event emitter methods

## Writing Tests

### Testing the Module

```typescript
import ExpoDrawingModule from "../src/ExpoDrawingModule";

describe("ExpoDrawingModule", () => {
  it("should call native methods", () => {
    const result = ExpoDrawingModule.hello();
    expect(result).toBe("Hello from ExpoDrawing!");
  });
});
```

### Testing Components

```typescript
import React from 'react';
import { render } from '@testing-library/react-native';
import ExpoDrawingView from '../src/ExpoDrawingView';

describe('ExpoDrawingView', () => {
  it('should render', () => {
    const { getByTestId } = render(
      <ExpoDrawingView url="test.png" onLoad={jest.fn()} />
    );
    expect(getByTestId('mocked-native-view')).toBeDefined();
  });
});
```

## Coverage Reports

### Local Coverage

After running `yarn test:coverage`, coverage reports are available in:

- `coverage/lcov-report/index.html` - HTML report (open in browser)
- `coverage/lcov.info` - LCOV format for Codecov

### CI Coverage

The CI pipeline automatically:

1. Runs tests with coverage on Node 18 and 20
2. Uploads `coverage/lcov.info` to Codecov (Node 20 only)
3. Generates coverage badges and reports

### Coverage Thresholds

The project maintains the following minimum coverage thresholds:

- Branches: 70%
- Functions: 70%
- Lines: 70%
- Statements: 70%

These thresholds are configured in `jest.config.js` and will cause tests to fail if not met.

## Configuration Files

### jest.config.js

Main Jest configuration:

- Uses `jest-expo` preset
- Configures coverage collection from `src/**/*.{ts,tsx}`
- Excludes web platform files (`*.web.*`)
- Sets up coverage thresholds

### jest.setup.js

Test environment setup:

- Mocks the `expo` module
- Configures native module mocking
- Provides test utilities

## Troubleshooting

### Tests fail with "Cannot find module"

Make sure all dependencies are installed:

```bash
yarn install
```

### Coverage not generated

Ensure you're running with the `--coverage` flag:

```bash
yarn test:coverage
```

### Mock not working

Check that:

1. `jest.setup.js` is listed in `setupFilesAfterEnv` in jest.config.js
2. The mock file exists at `mocks/ExpoDrawing.ts`
3. You're importing from the correct path in tests

## CI Integration

The testing setup integrates with GitHub Actions CI:

- `.github/workflows/ci.yml` runs tests on every push and PR
- Coverage reports are uploaded to Codecov automatically
- Tests run on Node 18 and 20 to ensure compatibility

## Additional Resources

- [Jest Documentation](https://jestjs.io/)
- [Expo Testing Documentation](https://docs.expo.dev/develop/unit-testing/)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [Codecov Documentation](https://docs.codecov.com/)
