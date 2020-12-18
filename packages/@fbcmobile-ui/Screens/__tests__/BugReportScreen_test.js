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

import BugReportScreen from '../BugReportScreen';
import React from 'react';
import renderer from 'react-test-renderer';

describe('BugReportScreen Tests', () => {
  const navigation = {
    getParam: jest.fn(),
    setParams: jest.fn(),
    navigate: jest.fn(),
    isFocused: jest.fn(),
    addListener: jest.fn(),
    dismiss: jest.fn(),
    dispatch: jest.fn(),
    goBack: jest.fn(),
    state: {
      params: {
        photoData: '/media/pic.png',
      },
    },
    dangerouslyGetParent: jest.fn(),
  };

  test('BugReportScreen renders correctly', () => {
    const tree = renderer
      .create(<BugReportScreen navigation={navigation} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
