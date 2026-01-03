import ExpoModulesCore
import PencilKit
import UIKit

// This view will be used as a native component. Make sure to inherit from `ExpoView`
// to apply the proper styling (e.g. border radius and shadows).
class ExpoDrawingView: ExpoView, PKCanvasViewDelegate {
  let canvasView = PKCanvasView(frame: .zero)
  let onStrokeStart = EventDispatcher()
  let onStrokeEnd = EventDispatcher()
  
  // Tool configuration properties
  var currentColor: UIColor = .black
  var currentWidth: CGFloat = PKInkingTool.InkType.pen.defaultWidth
  var currentTool: String = "pen"
  
  // Undo/Redo properties
  var drawingStack: [PKDrawing] = []
  var stackIndex: Int = 0
  let maxStackSize: Int = 50
  var isUpdatingProgrammatically: Bool = false
  
  // Tool picker reference (iOS only)
  var toolPicker: PKToolPicker?

  required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)
    clipsToBounds = true
    
    // Setup canvasView
    canvasView.backgroundColor = .clear
    canvasView.frame = bounds
    canvasView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
    canvasView.drawingPolicy = .anyInput  // allow finger and Pencil
    canvasView.delegate = self
    
    // Set default drawing tool (black pen with default width)
    updateCanvasTool()
    
    // Initialize drawing stack with empty drawing
    drawingStack = [PKDrawing()]
    stackIndex = 0
    
    addSubview(canvasView)
    
    // Add gesture recognizer handler for stroke start detection
    canvasView.drawingGestureRecognizer.addTarget(
      self,
      action: #selector(handleDrawingGesture(_:))
    )
  }

  override func layoutSubviews() {
    super.layoutSubviews()
    canvasView.frame = bounds
  }
  
  // MARK: - Gesture Handling
  
  @objc func handleDrawingGesture(_ gesture: UIGestureRecognizer) {
    if gesture.state == .began {
      // User started drawing a new stroke
      onStrokeStart([:])
    }
  }
  
  // MARK: - PKCanvasViewDelegate
  
  func canvasViewDrawingDidChange(_ canvasView: PKCanvasView) {
    // Don't add to stack or emit events during programmatic changes
    guard !isUpdatingProgrammatically else { return }
    
    // Trim any "redo" states if we're drawing after an undo
    if stackIndex < drawingStack.count - 1 {
      drawingStack.removeSubrange((stackIndex + 1)...)
    }
    
    // Add current drawing to stack
    drawingStack.append(canvasView.drawing)
    stackIndex = drawingStack.count - 1
    
    // Enforce max stack size (remove oldest if needed)
    if drawingStack.count > maxStackSize {
      drawingStack.removeFirst()
      stackIndex = drawingStack.count - 1
    }
    
    // Emit stroke end event with undo/redo state
    onStrokeEnd([
      "canUndo": canUndo(),
      "canRedo": canRedo()
    ])
  }
  
  // MARK: - Tool Picker Methods (iOS only)
  
  func showToolPicker() {
    #if targetEnvironment(simulator) || os(iOS)
    // Find the window containing this view
    guard let window = self.window else {
      print("ExpoDrawing: Cannot show tool picker - view not in window hierarchy")
      return
    }
    
    // Get or create shared tool picker for this window
    if toolPicker == nil {
      toolPicker = PKToolPicker.shared(for: window)
    }
    
    guard let picker = toolPicker else {
      print("ExpoDrawing: PKToolPicker not available on this device")
      return
    }
    
    // Set tool picker visible and add canvas as observer
    picker.setVisible(true, forFirstResponder: canvasView)
    picker.addObserver(canvasView)
    
    // Make canvas first responder to receive tool picker updates
    canvasView.becomeFirstResponder()
    #endif
  }
  
  func hideToolPicker() {
    #if targetEnvironment(simulator) || os(iOS)
    guard let picker = toolPicker else { return }
    
    // Hide tool picker
    picker.setVisible(false, forFirstResponder: canvasView)
    picker.removeObserver(canvasView)
    
    // Resign first responder
    canvasView.resignFirstResponder()
    #endif
  }
  
  // MARK: - Export Methods
  
  func getCanvasDataAsBase64() -> String? {
    // Get current drawing from canvas
    let drawing = canvasView.drawing
    
    // Handle empty canvas
    guard !drawing.bounds.isEmpty else {
      // Return a 1x1 white PNG for empty canvas
      let emptyImage = UIImage()
      guard let pngData = emptyImage.pngData() else { return nil }
      return pngData.base64EncodedString()
    }
    
    // Convert drawing to UIImage with proper scale for retina displays
    let image = drawing.image(from: canvasView.bounds, scale: UIScreen.main.scale)
    
    // Convert to PNG data
    guard let pngData = image.pngData() else {
      return nil
    }
    
    // Encode as base64 string
    return pngData.base64EncodedString()
  }
  
  // MARK: - Undo/Redo Methods
  
  func undo() {
    guard canUndo() else { return }
    
    isUpdatingProgrammatically = true
    stackIndex -= 1
    canvasView.drawing = drawingStack[stackIndex]
    isUpdatingProgrammatically = false
    
    onStrokeEnd([
      "canUndo": canUndo(),
      "canRedo": canRedo()
    ])
  }
  
  func redo() {
    guard canRedo() else { return }
    
    isUpdatingProgrammatically = true
    stackIndex += 1
    canvasView.drawing = drawingStack[stackIndex]
    isUpdatingProgrammatically = false
    
    onStrokeEnd([
      "canUndo": canUndo(),
      "canRedo": canRedo()
    ])
  }
  
  func clearDrawing() {
    isUpdatingProgrammatically = true
    canvasView.drawing = PKDrawing()
    drawingStack = [PKDrawing()]
    stackIndex = 0
    isUpdatingProgrammatically = false
    
    onStrokeEnd([
      "canUndo": false,
      "canRedo": false
    ])
  }
  
  func canUndo() -> Bool {
    return stackIndex > 0
  }
  
  func canRedo() -> Bool {
    return stackIndex < drawingStack.count - 1
  }
  
  // MARK: - Tool Configuration Methods
  
  func setStrokeColor(_ colorString: String) {
    if let color = hexStringToUIColor(colorString) {
      currentColor = color
      updateCanvasTool()
    }
  }
  
  func setStrokeThickness(_ thickness: CGFloat) {
    // Clamp thickness to reasonable range (1-50 points)
    currentWidth = max(1.0, min(50.0, thickness))
    updateCanvasTool()
  }
  
  func setTool(_ toolName: String) {
    currentTool = toolName
    updateCanvasTool()
  }
  
  func setEnableFingerDrawing(_ enabled: Bool) {
    canvasView.drawingPolicy = enabled ? .anyInput : .pencilOnly
  }
  
  func updateCanvasTool() {
    switch currentTool {
    case "eraser":
      canvasView.tool = PKEraserTool(.vector)
    case "marker":
      canvasView.tool = PKInkingTool(.marker, color: currentColor, width: currentWidth)
    case "pencil":
      canvasView.tool = PKInkingTool(.pencil, color: currentColor, width: currentWidth)
    default: // "pen"
      canvasView.tool = PKInkingTool(.pen, color: currentColor, width: currentWidth)
    }
  }
  
  // MARK: - Helper Methods
  
  func hexStringToUIColor(_ hex: String) -> UIColor? {
    var hexSanitized = hex.trimmingCharacters(in: .whitespacesAndNewlines)
    hexSanitized = hexSanitized.replacingOccurrences(of: "#", with: "")
    
    var rgb: UInt64 = 0
    
    guard Scanner(string: hexSanitized).scanHexInt64(&rgb) else {
      // Try parsing as a CSS color name or other format
      // For now, return nil for invalid formats
      return nil
    }
    
    let length = hexSanitized.count
    let r, g, b, a: CGFloat
    
    if length == 6 {
      r = CGFloat((rgb & 0xFF0000) >> 16) / 255.0
      g = CGFloat((rgb & 0x00FF00) >> 8) / 255.0
      b = CGFloat(rgb & 0x0000FF) / 255.0
      a = 1.0
    } else if length == 8 {
      r = CGFloat((rgb & 0xFF000000) >> 24) / 255.0
      g = CGFloat((rgb & 0x00FF0000) >> 16) / 255.0
      b = CGFloat((rgb & 0x0000FF00) >> 8) / 255.0
      a = CGFloat(rgb & 0x000000FF) / 255.0
    } else {
      return nil
    }
    
    return UIColor(red: r, green: g, blue: b, alpha: a)
  }
}
