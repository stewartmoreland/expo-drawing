import { requireNativeView } from 'expo';
import * as React from 'react';

import { ExpoDrawingViewProps, DrawingViewRef } from './ExpoDrawing.types';

const NativeView: any = requireNativeView('ExpoDrawing');

const ExpoDrawingView = React.forwardRef<DrawingViewRef, ExpoDrawingViewProps>(
  (props, ref) => {
    const nativeRef = React.useRef(null);

    React.useImperativeHandle(ref, () => ({
      async undo() {
        // @ts-expect-error - Native methods are not typed
        return nativeRef.current?.undo();
      },
      async redo() {
        // @ts-expect-error - Native methods are not typed
        return nativeRef.current?.redo();
      },
      async clearDrawing() {
        // @ts-expect-error - Native methods are not typed
        return nativeRef.current?.clearDrawing();
      },
      async getCanvasDataAsBase64() {
        // @ts-expect-error - Native methods are not typed
        return nativeRef.current?.getCanvasDataAsBase64();
      },
      async showToolPicker() {
        // @ts-expect-error - Native methods are not typed
        return nativeRef.current?.showToolPicker?.();
      },
      async hideToolPicker() {
        // @ts-expect-error - Native methods are not typed
        return nativeRef.current?.hideToolPicker?.();
      },
    }));

    return <NativeView ref={nativeRef} {...props} />;
  }
);

ExpoDrawingView.displayName = 'ExpoDrawingView';

export default ExpoDrawingView;
