/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

'use strict';

import Banner from '../Banner';
import React from 'react';
import renderer from 'react-test-renderer';

jest.mock('react-native/Libraries/Animated/src/Animated', () => {
  const ActualAnimated = jest.requireActual(
    'react-native/Libraries/Animated/src/Animated',
  );
  return {
    ...ActualAnimated,
    timing: (value, config) => {
      return {
        start: callback => {
          value.setValue(config.toValue);
          callback && callback();
        },
      };
    },
  };
});

describe('Banner Tests', () => {
  test('Banner renders correctly with message and timeout', () => {
    global.managedClock(() => {
      const tree = renderer.create(<Banner message={'hello'} timeoutMs={10} />);
      const data = tree.toJSON();
      global.moveTimeForward(10);
      expect(data).toMatchSnapshot();
    });
  });
  test('Banner renders correctly with message and skin', () => {
    global.managedClock(() => {
      const tree = renderer.create(<Banner message={'hello'} skin={'red'} />);
      const data = tree.toJSON();
      global.moveTimeForward(15);
      expect(data).toMatchSnapshot();
    });
  });
});
