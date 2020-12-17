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
import WiFiScanResults from '../Views/WiFiScanResults';
import renderer from 'react-test-renderer';
import type {WiFiScanData} from '../Views/WiFiScanResults';

describe('WiFiScanResults Tests', () => {
  test('empty CellScanResults renders correctly', () => {
    const tree = renderer.create(<WiFiScanResults scanResults={[]} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('CellScanResults renders correctly', () => {
    const results: WiFiScanData = {
      timestamp: 1234567890,
      frequency: 123,
      channel: 11,
      bssid: '11:22:33:44:55:66',
      strength: 10,
      ssid: 'My WiFi',
      capabilities: 'AES, WEP',
    };
    const tree = renderer
      .create(<WiFiScanResults scanResults={[results]} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
