/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../src/App';

jest.mock('react-native-camera-kit', () => {
  const { View } = require('react-native');

  return {
    Camera: () => <View />,
    CameraType: {
      Back: 'back',
      Front: 'front',
    },
  };
});

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});
