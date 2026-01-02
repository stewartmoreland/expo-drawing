import { NativeModule, requireNativeModule } from 'expo';

import { ExpoDrawingModuleEvents } from './ExpoDrawing.types';

declare class ExpoDrawingModule extends NativeModule<ExpoDrawingModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoDrawingModule>('ExpoDrawing');
