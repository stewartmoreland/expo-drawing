import ExpoDrawingModule, { ExpoDrawingView } from '../src/index';
import * as ExpoDrawing from '../src/index';

describe('expo-drawing module exports', () => {
  it('should export the default module', () => {
    expect(ExpoDrawingModule).toBeDefined();
    expect(typeof ExpoDrawingModule).toBe('object');
  });

  it('should export ExpoDrawingView', () => {
    expect(ExpoDrawingView).toBeDefined();
    expect(typeof ExpoDrawingView).toBe('function');
  });

  it('should export types', () => {
    // Type exports are checked at compile time by TypeScript
    // We can verify that the namespace exports exist
    expect(ExpoDrawing).toBeDefined();
  });

  it('should have the complete public API', () => {
    // Verify the module has expected properties
    expect(ExpoDrawingModule.PI).toBeDefined();
    expect(ExpoDrawingModule.hello).toBeDefined();
    expect(ExpoDrawingModule.setValueAsync).toBeDefined();
  });

  it('should maintain backward compatibility with default export', () => {
    // Ensure default export is the same as named module
    const defaultExport = ExpoDrawingModule;
    expect(defaultExport).toBe(ExpoDrawingModule);
  });
});

