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
import Switch from '../Switch';
import renderer from 'react-test-renderer';

describe('Switch Tests', () => {
  test('checked switch renders correctly', () => {
    const tree = renderer.create(<Switch checked={true} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('un-checked switch renders correctly', () => {
    const tree = renderer.create(<Switch checked={false} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
