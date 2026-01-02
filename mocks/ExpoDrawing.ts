// Mock implementation of the ExpoDrawing native module
const ExpoDrawingModule = {
  // Mock constant
  PI: Math.PI,

  // Mock methods
  hello: jest.fn(() => "Hello from ExpoDrawing!"),
  setValueAsync: jest.fn((value: string) => Promise.resolve()),

  // Add EventEmitter methods for events support
  addListener: jest.fn(),
  removeListeners: jest.fn(),
};

export default ExpoDrawingModule;
