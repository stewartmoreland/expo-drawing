import * as React from 'react';

import { ExpoDrawingViewProps } from './ExpoDrawing.types';

export default function ExpoDrawingView(_props: ExpoDrawingViewProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        backgroundColor: '#f0f0f0',
      }}
    >
      <p>Drawing functionality is not available on web. Please use iOS or Android.</p>
    </div>
  );
}
