package expo.modules.drawing

import android.content.Context
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.Color
import android.util.Base64
import android.view.MotionEvent
import androidx.ink.authoring.InProgressStrokesView
import androidx.ink.brush.Brush
import androidx.ink.brush.StockBrushes
import androidx.ink.rendering.android.canvas.CanvasStrokeRenderer
import androidx.ink.strokes.Stroke
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.viewevent.EventDispatcher
import expo.modules.kotlin.views.ExpoView
import java.io.ByteArrayOutputStream

class ExpoDrawingView(context: Context, appContext: AppContext) : ExpoView(context, appContext) {
  // Event dispatchers for stroke lifecycle events
  private val onStrokeStart by EventDispatcher()
  private val onStrokeEnd by EventDispatcher()

  // Stroke management
  private val strokes = mutableListOf<Stroke>()
  private val redoStack = mutableListOf<Stroke>()
  
  // Ink API components
  private val strokeRenderer: CanvasStrokeRenderer = CanvasStrokeRenderer.create()
  private val inProgressView: InProgressStrokesView
  
  // Current brush configuration
  private var currentBrush: Brush = StockBrushes.markerLatest(
    Color.BLACK,
    5f,
    0.5f
  )

  init {
    // Set view to draw its own content
    setWillNotDraw(false)
    
    // Initialize InProgressStrokesView for real-time stroke capture
    inProgressView = InProgressStrokesView(context).apply {
      layoutParams = LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT)
      
      // Set up listener for when strokes are completed
      addFinishedStrokesListener { finishedStrokes ->
        // Add completed strokes to our list
        strokes.addAll(finishedStrokes)
        
        // Clear redo stack when new stroke is added
        redoStack.clear()
        
        // Emit stroke end event with undo/redo state
        onStrokeEnd(mapOf(
          "canUndo" to strokes.isNotEmpty(),
          "canRedo" to redoStack.isNotEmpty()
        ))
        
        // Trigger redraw to show the new stroke
        invalidate()
      }
    }
    
    // Add InProgressStrokesView as a child
    addView(inProgressView)
  }

  override fun onDraw(canvas: Canvas) {
    super.onDraw(canvas)
    
    // Render all completed strokes
    for (stroke in strokes) {
      strokeRenderer.draw(stroke, canvas, null)
    }
  }

  override fun onTouchEvent(event: MotionEvent): Boolean {
    // Detect stroke start
    if (event.action == MotionEvent.ACTION_DOWN) {
      onStrokeStart(emptyMap())
    }
    
    // Pass touch events to InProgressStrokesView
    return inProgressView.dispatchTouchEvent(event) || super.onTouchEvent(event)
  }

  // Brush configuration methods
  fun setStrokeColor(color: Int) {
    currentBrush = StockBrushes.markerLatest(
      color,
      currentBrush.size,
      0.5f
    )
    updateBrush()
  }

  fun setStrokeThickness(thickness: Float) {
    currentBrush = StockBrushes.markerLatest(
      currentBrush.colorIntArgb,
      thickness,
      0.5f
    )
    updateBrush()
  }

  fun setTool(toolName: String) {
    when (toolName.lowercase()) {
      "pen" -> {
        currentBrush = StockBrushes.markerLatest(
          currentBrush.colorIntArgb,
          currentBrush.size,
          0.5f
        )
      }
      "marker" -> {
        currentBrush = StockBrushes.markerLatest(
          currentBrush.colorIntArgb,
          currentBrush.size,
          0.5f
        )
      }
      "eraser" -> {
        // Use white brush for eraser (simplified approach)
        currentBrush = StockBrushes.markerLatest(
          Color.WHITE,
          currentBrush.size * 2, // Make eraser bigger
          0.5f
        )
      }
    }
    updateBrush()
  }

  fun setEnableFingerDrawing(allow: Boolean) {
    // This will be handled in touch event filtering
    // For now, we accept all touch input
    // TODO: Filter by MotionEvent.getToolType() if needed
  }

  private fun updateBrush() {
    // Update the brush in InProgressStrokesView
    // Note: This may need to be adjusted based on actual Ink API
    inProgressView.setBrush(currentBrush)
  }

  // Undo/Redo functionality
  fun undo() {
    if (strokes.isNotEmpty()) {
      val stroke = strokes.removeLast()
      redoStack.add(stroke)
      
      onStrokeEnd(mapOf(
        "canUndo" to strokes.isNotEmpty(),
        "canRedo" to redoStack.isNotEmpty()
      ))
      
      invalidate()
    }
  }

  fun redo() {
    if (redoStack.isNotEmpty()) {
      val stroke = redoStack.removeLast()
      strokes.add(stroke)
      
      onStrokeEnd(mapOf(
        "canUndo" to strokes.isNotEmpty(),
        "canRedo" to redoStack.isNotEmpty()
      ))
      
      invalidate()
    }
  }

  fun clearDrawing() {
    strokes.clear()
    redoStack.clear()
    
    onStrokeEnd(mapOf(
      "canUndo" to false,
      "canRedo" to false
    ))
    
    invalidate()
  }

  // Export functionality
  fun getCanvasDataAsBase64(): String? {
    return try {
      if (width <= 0 || height <= 0) {
        return null
      }
      
      val bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888)
      val canvas = Canvas(bitmap)
      
      // Draw white background
      canvas.drawColor(Color.WHITE)
      
      // Render all strokes to the bitmap
      for (stroke in strokes) {
        strokeRenderer.draw(stroke, canvas, null)
      }
      
      // Compress to PNG
      val byteArrayOutputStream = ByteArrayOutputStream()
      bitmap.compress(Bitmap.CompressFormat.PNG, 100, byteArrayOutputStream)
      val byteArray = byteArrayOutputStream.toByteArray()
      
      // Recycle bitmap to free memory
      bitmap.recycle()
      
      // Encode to Base64
      Base64.encodeToString(byteArray, Base64.DEFAULT)
    } catch (e: Exception) {
      e.printStackTrace()
      null
    }
  }
}
