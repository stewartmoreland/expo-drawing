package expo.modules.drawing

import android.graphics.Color
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ExpoDrawingModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ExpoDrawing")

    // Defines constant property on the module.
    Constant("PI") {
      Math.PI
    }

    // Defines event names that the module can send to JavaScript.
    Events("onChange")

    // Defines a JavaScript synchronous function that runs the native code on the JavaScript thread.
    Function("hello") {
      "Hello world! 👋"
    }

    // Defines a JavaScript function that always returns a Promise and whose native code
    // is by default dispatched on the different thread than the JavaScript runtime runs on.
    AsyncFunction("setValueAsync") { value: String ->
      // Send an event to JavaScript.
      sendEvent("onChange", mapOf(
        "value" to value
      ))
    }

    // Drawing view component definition
    View(ExpoDrawingView::class) {
      // Events for stroke lifecycle
      Events("onStrokeStart", "onStrokeEnd")

      // Props for brush configuration
      Prop("strokeColor") { view: ExpoDrawingView, colorString: String? ->
        colorString?.let {
          try {
            val color = Color.parseColor(it)
            view.setStrokeColor(color)
          } catch (e: IllegalArgumentException) {
            // Invalid color string, ignore
          }
        }
      }

      Prop("strokeThickness") { view: ExpoDrawingView, thickness: Float? ->
        thickness?.let {
          if (it > 0) {
            view.setStrokeThickness(it)
          }
        }
      }

      Prop("tool") { view: ExpoDrawingView, toolName: String? ->
        toolName?.let {
          view.setTool(it)
        }
      }

      Prop("enableFingerDrawing") { view: ExpoDrawingView, allow: Boolean? ->
        allow?.let {
          view.setEnableFingerDrawing(it)
        }
      }

      // AsyncFunctions for imperative methods
      AsyncFunction("undo") { view: ExpoDrawingView ->
        view.undo()
      }

      AsyncFunction("redo") { view: ExpoDrawingView ->
        view.redo()
      }

      AsyncFunction("clearDrawing") { view: ExpoDrawingView ->
        view.clearDrawing()
      }

      AsyncFunction("getCanvasDataAsBase64") { view: ExpoDrawingView ->
        view.getCanvasDataAsBase64()
      }
    }
  }
}
