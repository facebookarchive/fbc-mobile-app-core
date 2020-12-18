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

import BottomBar from '@fbcmobile/ui/Components/Core/BottomBar';
import Button from '@fbcmobile/ui/Components/Core/Button';
import React from 'react';
import ScrollViewWithBottomBar from '../ScrollViewWithBottomBar';
import renderer from 'react-test-renderer';

describe('ScrollViewWithBottomBar Tests', () => {
  test('ScrollViewWithBottomBar renders correctly', () => {
    const tree = renderer
      .create(
        <ScrollViewWithBottomBar>
          <Button>Test</Button>
        </ScrollViewWithBottomBar>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('ScrollViewWithBottomBar renders correctly with bottom bar', () => {
    const tree = renderer
      .create(
        <ScrollViewWithBottomBar
          bottomBar={
            <BottomBar>
              <Button>Test</Button>
            </BottomBar>
          }>
          <Button>Test</Button>
        </ScrollViewWithBottomBar>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
