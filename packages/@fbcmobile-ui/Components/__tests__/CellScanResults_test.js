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

import CellScanResults from '../Views/CellScanResults';
import React from 'react';
import renderer from 'react-test-renderer';
import type {CellScanData} from '../Views/CellScanResults';

describe('CellScanResults Tests', () => {
  test('empty CellScanResults renders correctly', () => {
    const tree = renderer.create(<CellScanResults scanResults={[]} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('CellScanResults renders correctly', () => {
    const results: CellScanData = {
      networkType: 'CDMA',
      signalStrength: 1,
      operator: 'myCell',
    };
    const tree = renderer
      .create(<CellScanResults scanResults={[results]} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
