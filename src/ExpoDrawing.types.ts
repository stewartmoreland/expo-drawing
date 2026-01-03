import type { StyleProp, ViewStyle } from 'react-native';

export type DrawingTool = 'pen' | 'marker' | 'pencil' | 'eraser';

export type OnStrokeStartEvent = {
  nativeEvent: Record<string, never>;
};

export type OnStrokeEndEvent = {
  nativeEvent: {
    canUndo: boolean;
    canRedo: boolean;
  };
};

export type ExpoDrawingViewProps = {
  strokeColor?: string;
  strokeThickness?: number;
  tool?: DrawingTool;
  enableFingerDrawing?: boolean;
  onStrokeStart?: (event: OnStrokeStartEvent) => void;
  onStrokeEnd?: (event: OnStrokeEndEvent) => void;
  style?: StyleProp<ViewStyle>;
};

export type DrawingViewRef = {
  undo(): Promise<void>;
  redo(): Promise<void>;
  clearDrawing(): Promise<void>;
  getCanvasDataAsBase64(): Promise<string | null>;
  showToolPicker?(): Promise<void>;
  hideToolPicker?(): Promise<void>;
};
