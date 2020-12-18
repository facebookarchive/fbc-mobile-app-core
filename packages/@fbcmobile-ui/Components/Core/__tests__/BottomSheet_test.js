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

import BottomSheet from '../BottomSheet';
import Button from '@fbcmobile/ui/Components/Core/Button';
import React from 'react';
import renderer from 'react-test-renderer';

describe('BottomSheet Tests', () => {
  test('BottomSheet renders correctly', () => {
    global.managedClock(() => {
      const tree = renderer.create(
        <BottomSheet>
          <Button>Test</Button>
        </BottomSheet>,
      );
      const data = tree.toJSON();
      expect(data).toMatchSnapshot();
    });
  });
});
