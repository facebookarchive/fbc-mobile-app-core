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

import React from 'react';
import SplashScreen from '../SplashScreen';
import renderer from 'react-test-renderer';

describe('SplashScreen Tests', () => {
  test('SplashScreen renders correctly', () => {
    const tree = renderer.create(<SplashScreen />).toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('SplashScreen renders correctly with text', () => {
    const tree = renderer.create(<SplashScreen text={'testing'} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
