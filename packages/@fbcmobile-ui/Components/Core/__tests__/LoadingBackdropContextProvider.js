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

import Button from '@fbcmobile/ui/Components/Core/Button';
import LoadingBackdropContextProvider from '../LoadingBackdropContextProvider';
import React from 'react';
import renderer from 'react-test-renderer';

describe('LoadingBackdropContextProvider Tests', () => {
  test('LoadingBackdropContextProvider renders correctly', () => {
    global.managedClock(() => {
      const tree = renderer
        .create(
          <LoadingBackdropContextProvider>
            <Button>Test</Button>
          </LoadingBackdropContextProvider>,
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
