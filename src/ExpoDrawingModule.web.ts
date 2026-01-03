import { NativeModule, requireNativeModule } from 'expo';

declare class ExpoDrawingModule extends NativeModule {
  // No module-level methods for now - all functionality is in the view
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoDrawingModule>('ExpoDrawing');
