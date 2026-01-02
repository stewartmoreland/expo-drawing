// Reexport the native module. On web, it will be resolved to ExpoDrawingModule.web.ts
// and on native platforms to ExpoDrawingModule.ts
export { default } from './ExpoDrawingModule';
export { default as ExpoDrawingView } from './ExpoDrawingView';
export * from  './ExpoDrawing.types';
