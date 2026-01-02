import React from 'react';
import { render } from '@testing-library/react-native';
import ExpoDrawingView from '../src/ExpoDrawingView';

describe('ExpoDrawingView', () => {
  const mockOnLoad = jest.fn();
  const defaultProps = {
    url: 'https://example.com/drawing.png',
    onLoad: mockOnLoad,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    const { getByTestId } = render(<ExpoDrawingView {...defaultProps} />);
    expect(getByTestId('mocked-native-view')).toBeDefined();
  });

  it('should pass url prop to native view', () => {
    const { getByTestId } = render(<ExpoDrawingView {...defaultProps} />);
    const view = getByTestId('mocked-native-view');
    expect(view.props.url).toBe(defaultProps.url);
  });

  it('should pass onLoad prop to native view', () => {
    const { getByTestId } = render(<ExpoDrawingView {...defaultProps} />);
    const view = getByTestId('mocked-native-view');
    expect(view.props.onLoad).toBe(mockOnLoad);
  });

  it('should pass style prop to native view', () => {
    const customStyle = { backgroundColor: 'red', width: 100, height: 100 };
    const { getByTestId } = render(
      <ExpoDrawingView {...defaultProps} style={customStyle} />
    );
    const view = getByTestId('mocked-native-view');
    expect(view.props.style).toEqual(customStyle);
  });

  it('should handle custom url values', () => {
    const customUrl = 'https://custom.com/image.jpg';
    const { getByTestId } = render(
      <ExpoDrawingView url={customUrl} onLoad={mockOnLoad} />
    );
    const view = getByTestId('mocked-native-view');
    expect(view.props.url).toBe(customUrl);
  });
});

