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

import Button from '../Button';
import React from 'react';
import renderer from 'react-test-renderer';

describe('Button Tests', () => {
  test('Button renders correctly', () => {
    const tree = renderer.create(<Button>Test</Button>).toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('Button renders correctly', () => {
    const tree = renderer
      .create(<Button disabled={true}>Test</Button>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
