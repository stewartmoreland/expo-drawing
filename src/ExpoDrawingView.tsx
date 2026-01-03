import { requireNativeView } from 'expo';
import * as React from 'react';

import { ExpoDrawingViewProps, DrawingViewRef } from './ExpoDrawing.types';

const NativeView: any = requireNativeView('ExpoDrawing');

const ExpoDrawingView = React.forwardRef<DrawingViewRef, ExpoDrawingViewProps>(
  (props, ref) => {
    const nativeRef = React.useRef<any>(null);

    React.useImperativeHandle(ref, () => ({
      async undo() {
        return nativeRef.current?.undo();
      },
      async redo() {
        return nativeRef.current?.redo();
      },
      async clearDrawing() {
        return nativeRef.current?.clearDrawing();
      },
      async getCanvasDataAsBase64() {
        return nativeRef.current?.getCanvasDataAsBase64();
      },
      async showToolPicker() {
        return nativeRef.current?.showToolPicker?.();
      },
      async hideToolPicker() {
        return nativeRef.current?.hideToolPicker?.();
      },
    }));

    return <NativeView ref={nativeRef} {...props} />;
  }
);

ExpoDrawingView.displayName = 'ExpoDrawingView';

export default ExpoDrawingView;
