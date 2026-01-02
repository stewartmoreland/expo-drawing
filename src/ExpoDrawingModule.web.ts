import { registerWebModule, NativeModule } from 'expo';

import { ExpoDrawingModuleEvents } from './ExpoDrawing.types';

class ExpoDrawingModule extends NativeModule<ExpoDrawingModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
}

export default registerWebModule(ExpoDrawingModule, 'ExpoDrawingModule');
