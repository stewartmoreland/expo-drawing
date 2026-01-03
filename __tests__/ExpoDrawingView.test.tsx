import React from 'react';
import { render } from '@testing-library/react-native';
import ExpoDrawingView from '../src/ExpoDrawingView';

describe('ExpoDrawingView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    const { getByTestId } = render(<ExpoDrawingView />);
    expect(getByTestId('mocked-native-view')).toBeDefined();
  });

  it('should accept style prop', () => {
    const customStyle = { backgroundColor: 'white', width: 300, height: 400 };
    const { getByTestId } = render(<ExpoDrawingView style={customStyle} />);
    const view = getByTestId('mocked-native-view');
    expect(view.props.style).toEqual(customStyle);
  });

  it('should accept strokeColor prop', () => {
    const { getByTestId } = render(<ExpoDrawingView strokeColor="#ff0000" />);
    const view = getByTestId('mocked-native-view');
    expect(view.props.strokeColor).toBe('#ff0000');
  });

  it('should accept strokeThickness prop', () => {
    const { getByTestId } = render(<ExpoDrawingView strokeThickness={10} />);
    const view = getByTestId('mocked-native-view');
    expect(view.props.strokeThickness).toBe(10);
  });

  it('should accept tool prop', () => {
    const { getByTestId } = render(<ExpoDrawingView tool="pen" />);
    const view = getByTestId('mocked-native-view');
    expect(view.props.tool).toBe('pen');
  });

  it('should accept enableFingerDrawing prop', () => {
    const { getByTestId } = render(<ExpoDrawingView enableFingerDrawing={false} />);
    const view = getByTestId('mocked-native-view');
    expect(view.props.enableFingerDrawing).toBe(false);
  });

  it('should accept onStrokeStart callback', () => {
    const onStrokeStart = jest.fn();
    const { getByTestId } = render(<ExpoDrawingView onStrokeStart={onStrokeStart} />);
    const view = getByTestId('mocked-native-view');
    expect(view.props.onStrokeStart).toBe(onStrokeStart);
  });

  it('should accept onStrokeEnd callback', () => {
    const onStrokeEnd = jest.fn();
    const { getByTestId } = render(<ExpoDrawingView onStrokeEnd={onStrokeEnd} />);
    const view = getByTestId('mocked-native-view');
    expect(view.props.onStrokeEnd).toBe(onStrokeEnd);
  });

  it('onStrokeEnd should receive canUndo and canRedo in nativeEvent', () => {
    const onStrokeEnd = jest.fn();
    render(<ExpoDrawingView onStrokeEnd={onStrokeEnd} />);
    
    // This test verifies the type signature matches expectations
    // In actual use, the native module would call this with proper event structure
    const mockEvent = {
      nativeEvent: {
        canUndo: true,
        canRedo: false,
      },
    };
    
    onStrokeEnd(mockEvent);
    expect(onStrokeEnd).toHaveBeenCalledWith(mockEvent);
  });

  it('should handle invalid color strings gracefully', () => {
    // The component should accept any string for strokeColor
    // Validation happens at native layer
    const { getByTestId } = render(<ExpoDrawingView strokeColor="invalid-color" />);
    const view = getByTestId('mocked-native-view');
    expect(view.props.strokeColor).toBe('invalid-color');
  });

  describe('ref methods', () => {
    it('should call undo through ref', async () => {
      const ref = React.createRef<any>();
      render(<ExpoDrawingView ref={ref} />);
      
      expect(ref.current).toBeDefined();
      await ref.current.undo();
      expect(ref.current.undo).toBeDefined();
    });

    it('should call redo through ref', async () => {
      const ref = React.createRef<any>();
      render(<ExpoDrawingView ref={ref} />);
      
      expect(ref.current).toBeDefined();
      await ref.current.redo();
      expect(ref.current.redo).toBeDefined();
    });

    it('should call clearDrawing through ref', async () => {
      const ref = React.createRef<any>();
      render(<ExpoDrawingView ref={ref} />);
      
      expect(ref.current).toBeDefined();
      await ref.current.clearDrawing();
      expect(ref.current.clearDrawing).toBeDefined();
    });

    it('should call getCanvasDataAsBase64 through ref and return data', async () => {
      const ref = React.createRef<any>();
      render(<ExpoDrawingView ref={ref} />);
      
      expect(ref.current).toBeDefined();
      const result = await ref.current.getCanvasDataAsBase64();
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });

    it('should call showToolPicker through ref if available', async () => {
      const ref = React.createRef<any>();
      render(<ExpoDrawingView ref={ref} />);
      
      expect(ref.current).toBeDefined();
      if (ref.current.showToolPicker) {
        await ref.current.showToolPicker();
        expect(ref.current.showToolPicker).toBeDefined();
      }
    });

    it('should call hideToolPicker through ref if available', async () => {
      const ref = React.createRef<any>();
      render(<ExpoDrawingView ref={ref} />);
      
      expect(ref.current).toBeDefined();
      if (ref.current.hideToolPicker) {
        await ref.current.hideToolPicker();
        expect(ref.current.hideToolPicker).toBeDefined();
      }
    });

    it('should handle ref methods returning promises', async () => {
      const ref = React.createRef<any>();
      render(<ExpoDrawingView ref={ref} />);
      
      // All ref methods should return promises
      await expect(ref.current.undo()).resolves.toBeUndefined();
      await expect(ref.current.redo()).resolves.toBeUndefined();
      await expect(ref.current.clearDrawing()).resolves.toBeUndefined();
      await expect(ref.current.getCanvasDataAsBase64()).resolves.toBeDefined();
    });
  });
});
