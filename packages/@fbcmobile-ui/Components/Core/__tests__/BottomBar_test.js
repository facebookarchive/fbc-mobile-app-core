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

import BottomBar from '../BottomBar';
import Button from '@fbcmobile/ui/Components/Core/Button';
import React from 'react';
import renderer from 'react-test-renderer';

describe('BottomBar Tests', () => {
  test('BottomBar renders correctly', () => {
    const tree = renderer
      .create(
        <BottomBar>
          <Button>Test</Button>
        </BottomBar>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
