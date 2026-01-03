import ExpoModulesCore

public class ExpoDrawingModule: Module {
  // Each module class must implement the definition function. The definition consists of components
  // that describes the module's functionality and behavior.
  // See https://docs.expo.dev/modules/module-api for more details about available components.
  public func definition() -> ModuleDefinition {
    // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
    // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
    // The module will be accessible from `requireNativeModule('ExpoDrawing')` in JavaScript.
    Name("ExpoDrawing")

    // Enables the module to be used as a native view. Definition components that are accepted as part of the
    // view definition: Prop, Events.
    View(ExpoDrawingView.self) {
      // Define events that can be sent to JavaScript
      Events("onStrokeStart", "onStrokeEnd")
      
      // MARK: - Props
      
      Prop("strokeColor") { (view: ExpoDrawingView, colorString: String?) in
        if let color = colorString {
          view.setStrokeColor(color)
        }
      }
      
      Prop("strokeThickness") { (view: ExpoDrawingView, thickness: Double?) in
        if let width = thickness {
          view.setStrokeThickness(CGFloat(width))
        }
      }
      
      Prop("tool") { (view: ExpoDrawingView, toolName: String?) in
        if let tool = toolName {
          view.setTool(tool)
        }
      }
      
      Prop("enableFingerDrawing") { (view: ExpoDrawingView, enabled: Bool?) in
        if let allow = enabled {
          view.setEnableFingerDrawing(allow)
        }
      }
      
      // MARK: - Methods
      
      AsyncFunction("undo") { (view: ExpoDrawingView) in
        view.undo()
      }
      
      AsyncFunction("redo") { (view: ExpoDrawingView) in
        view.redo()
      }
      
      AsyncFunction("clearDrawing") { (view: ExpoDrawingView) in
        view.clearDrawing()
      }
      
      AsyncFunction("getCanvasDataAsBase64") { (view: ExpoDrawingView) -> String? in
        return view.getCanvasDataAsBase64()
      }
      
      // iOS-only tool picker methods
      AsyncFunction("showToolPicker") { (view: ExpoDrawingView) in
        view.showToolPicker()
      }
      
      AsyncFunction("hideToolPicker") { (view: ExpoDrawingView) in
        view.hideToolPicker()
      }
    }
  }
}
