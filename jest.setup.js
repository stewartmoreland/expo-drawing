// Jest setup file for configuring the test environment

// Mock the native module using expo's mocking system
jest.mock("expo", () => {
  const actualExpo = jest.requireActual("expo");
  return {
    ...actualExpo,
    requireNativeModule: jest.fn((moduleName) => {
      if (moduleName === "ExpoDrawing") {
        return require("./mocks/ExpoDrawing").default;
      }
      return actualExpo.requireNativeModule(moduleName);
    }),
    requireNativeView: jest.fn(() => {
      const React = require("react");
      return React.forwardRef((props, ref) => {
        const { View } = require("react-native");
        
        // Expose the native methods through the ref using useImperativeHandle
        React.useImperativeHandle(ref, () => ({
          undo: jest.fn(() => Promise.resolve()),
          redo: jest.fn(() => Promise.resolve()),
          clearDrawing: jest.fn(() => Promise.resolve()),
          getCanvasDataAsBase64: jest.fn(() => Promise.resolve("mock-base64-data")),
          showToolPicker: jest.fn(() => Promise.resolve()),
          hideToolPicker: jest.fn(() => Promise.resolve()),
        }));
        
        return React.createElement(View, {
          ...props,
          testID: "mocked-native-view",
        });
      });
    }),
  };
});

// Silence console warnings during tests (optional)
// global.console = {
//   ...console,
//   warn: jest.fn(),
//   error: jest.fn(),
// };

// Setup any global test utilities or mocks here
