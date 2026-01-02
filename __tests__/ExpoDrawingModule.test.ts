import ExpoDrawingModule from '../src/ExpoDrawingModule';

describe('ExpoDrawingModule', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should export the module', () => {
    expect(ExpoDrawingModule).toBeDefined();
  });

  it('should have PI constant', () => {
    expect(ExpoDrawingModule.PI).toBeDefined();
    expect(typeof ExpoDrawingModule.PI).toBe('number');
    expect(ExpoDrawingModule.PI).toBe(Math.PI);
  });

  it('should have hello method', () => {
    expect(ExpoDrawingModule.hello).toBeDefined();
    expect(typeof ExpoDrawingModule.hello).toBe('function');
  });

  it('should return greeting from hello method', () => {
    const result = ExpoDrawingModule.hello();
    expect(result).toBe('Hello from ExpoDrawing!');
  });

  it('should have setValueAsync method', () => {
    expect(ExpoDrawingModule.setValueAsync).toBeDefined();
    expect(typeof ExpoDrawingModule.setValueAsync).toBe('function');
  });

  it('should call setValueAsync with correct parameters', async () => {
    const testValue = 'test-value';
    await ExpoDrawingModule.setValueAsync(testValue);
    
    expect(ExpoDrawingModule.setValueAsync).toHaveBeenCalledWith(testValue);
    expect(ExpoDrawingModule.setValueAsync).toHaveBeenCalledTimes(1);
  });

  it('should resolve setValueAsync promise', async () => {
    const testValue = 'another-test-value';
    await expect(ExpoDrawingModule.setValueAsync(testValue)).resolves.toBeUndefined();
  });
});

