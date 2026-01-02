import * as React from 'react';

import { ExpoDrawingViewProps } from './ExpoDrawing.types';

export default function ExpoDrawingView(props: ExpoDrawingViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
