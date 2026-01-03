import { ExpoDrawingView } from 'expo-drawing';
import type { DrawingViewRef, DrawingTool, OnStrokeEndEvent } from 'expo-drawing';
import { useRef, useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const COLORS = [
  { name: 'Black', value: '#000000' },
  { name: 'Red', value: '#FF0000' },
  { name: 'Blue', value: '#0000FF' },
  { name: 'Green', value: '#00FF00' },
  { name: 'Yellow', value: '#FFFF00' },
  { name: 'Purple', value: '#800080' },
];

const TOOLS: DrawingTool[] = ['pen', 'marker', 'pencil', 'eraser'];

const THICKNESS_OPTIONS = [
  { label: 'Thin', value: 2 },
  { label: 'Medium', value: 5 },
  { label: 'Thick', value: 10 },
  { label: 'Extra', value: 20 },
];

export default function App() {
  const drawingRef = useRef<DrawingViewRef>(null);
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [strokeThickness, setStrokeThickness] = useState(5);
  const [tool, setTool] = useState<DrawingTool>('pen');
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [enableFingerDrawing, setEnableFingerDrawing] = useState(true);

  const handleStrokeEnd = (event: OnStrokeEndEvent) => {
    setCanUndo(event.nativeEvent.canUndo);
    setCanRedo(event.nativeEvent.canRedo);
  };

  const handleUndo = async () => {
    try {
      await drawingRef.current?.undo();
    } catch (error) {
      console.error('Undo failed:', error);
    }
  };

  const handleRedo = async () => {
    try {
      await drawingRef.current?.redo();
    } catch (error) {
      console.error('Redo failed:', error);
    }
  };

  const handleClear = () => {
    Alert.alert('Clear Drawing', 'Are you sure you want to clear the canvas?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: async () => {
          try {
            await drawingRef.current?.clearDrawing();
            setCanUndo(false);
            setCanRedo(false);
          } catch (error) {
            console.error('Clear failed:', error);
          }
        },
      },
    ]);
  };

  const handleExport = async () => {
    try {
      const base64 = await drawingRef.current?.getCanvasDataAsBase64();
      if (base64) {
        Alert.alert(
          'Export Success',
          `Drawing exported as PNG\nSize: ${(base64.length / 1024).toFixed(2)} KB`,
          [{ text: 'OK' }]
        );
        console.log('Exported drawing (first 100 chars):', base64.substring(0, 100));
      } else {
        Alert.alert('Export Failed', 'Could not export drawing');
      }
    } catch (error) {
      console.error('Export failed:', error);
      Alert.alert('Export Failed', String(error));
    }
  };

  const handleShowToolPicker = async () => {
    if (Platform.OS === 'ios') {
      try {
        await drawingRef.current?.showToolPicker?.();
      } catch (error) {
        console.error('Show tool picker failed:', error);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Expo Drawing Demo</Text>
        <Text style={styles.subtitle}>
          Draw with {enableFingerDrawing ? 'finger or stylus' : 'stylus only'}
        </Text>
      </View>

      <View style={styles.canvasContainer}>
        <ExpoDrawingView
          ref={drawingRef}
          style={styles.canvas}
          strokeColor={strokeColor}
          strokeThickness={strokeThickness}
          tool={tool}
          enableFingerDrawing={enableFingerDrawing}
          onStrokeStart={() => console.log('Stroke started')}
          onStrokeEnd={handleStrokeEnd}
        />
      </View>

      <ScrollView style={styles.controls} showsVerticalScrollIndicator={false}>
        {/* Color Picker */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Color</Text>
          <View style={styles.colorGrid}>
            {COLORS.map((color) => (
              <Pressable
                key={color.value}
                style={[
                  styles.colorButton,
                  { backgroundColor: color.value },
                  strokeColor === color.value && styles.selectedColor,
                ]}
                onPress={() => setStrokeColor(color.value)}
              >
                {strokeColor === color.value && (
                  <View style={styles.colorCheckmark} />
                )}
              </Pressable>
            ))}
          </View>
        </View>

        {/* Thickness Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thickness</Text>
          <View style={styles.buttonRow}>
            {THICKNESS_OPTIONS.map((option) => (
              <Pressable
                key={option.value}
                style={[
                  styles.button,
                  strokeThickness === option.value && styles.selectedButton,
                ]}
                onPress={() => setStrokeThickness(option.value)}
              >
                <Text
                  style={[
                    styles.buttonText,
                    strokeThickness === option.value && styles.selectedButtonText,
                  ]}
                >
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Tool Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tool</Text>
          <View style={styles.buttonRow}>
            {TOOLS.map((toolOption) => (
              <Pressable
                key={toolOption}
                style={[
                  styles.button,
                  tool === toolOption && styles.selectedButton,
                ]}
                onPress={() => setTool(toolOption)}
              >
                <Text
                  style={[
                    styles.buttonText,
                    tool === toolOption && styles.selectedButtonText,
                  ]}
                >
                  {toolOption.charAt(0).toUpperCase() + toolOption.slice(1)}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions</Text>
          <View style={styles.buttonRow}>
            <Pressable
              style={[styles.button, !canUndo && styles.disabledButton]}
              onPress={handleUndo}
              disabled={!canUndo}
            >
              <Text
                style={[styles.buttonText, !canUndo && styles.disabledButtonText]}
              >
                Undo
              </Text>
            </Pressable>
            <Pressable
              style={[styles.button, !canRedo && styles.disabledButton]}
              onPress={handleRedo}
              disabled={!canRedo}
            >
              <Text
                style={[styles.buttonText, !canRedo && styles.disabledButtonText]}
              >
                Redo
              </Text>
            </Pressable>
            <Pressable style={styles.button} onPress={handleClear}>
              <Text style={styles.buttonText}>Clear</Text>
            </Pressable>
            <Pressable style={styles.button} onPress={handleExport}>
              <Text style={styles.buttonText}>Export</Text>
            </Pressable>
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <Pressable
            style={[
              styles.button,
              styles.fullWidthButton,
              enableFingerDrawing && styles.selectedButton,
            ]}
            onPress={() => setEnableFingerDrawing(!enableFingerDrawing)}
          >
            <Text
              style={[
                styles.buttonText,
                enableFingerDrawing && styles.selectedButtonText,
              ]}
            >
              {enableFingerDrawing ? '✓ ' : ''}Finger Drawing
            </Text>
          </Pressable>

          {Platform.OS === 'ios' && (
            <Pressable
              style={[styles.button, styles.fullWidthButton]}
              onPress={handleShowToolPicker}
            >
              <Text style={styles.buttonText}>Show iOS Tool Picker</Text>
            </Pressable>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  canvasContainer: {
    flex: 1,
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  canvas: {
    flex: 1,
  },
  controls: {
    maxHeight: 300,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedColor: {
    borderColor: '#007AFF',
    borderWidth: 3,
  },
  colorCheckmark: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  fullWidthButton: {
    width: '100%',
    marginTop: 8,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  selectedButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  selectedButtonText: {
    color: '#fff',
  },
  disabledButton: {
    backgroundColor: '#f9f9f9',
    borderColor: '#e0e0e0',
  },
  disabledButtonText: {
    color: '#999',
  },
});
