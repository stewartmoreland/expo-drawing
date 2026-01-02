import { requireNativeView } from 'expo';
import * as React from 'react';

import { ExpoDrawingViewProps } from './ExpoDrawing.types';

const NativeView: React.ComponentType<ExpoDrawingViewProps> =
  requireNativeView('ExpoDrawing');

export default function ExpoDrawingView(props: ExpoDrawingViewProps) {
  return <NativeView {...props} />;
}
