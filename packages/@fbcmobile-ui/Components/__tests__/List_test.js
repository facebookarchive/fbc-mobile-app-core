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
import List from '../List';
import React from 'react';
import renderer from 'react-test-renderer';

describe('List Tests', () => {
  test('List renders correctly', () => {
    const tree = renderer
      .create(
        <List>
          <Button>Test</Button>
        </List>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('empty List renders correctly', () => {
    const tree = renderer.create(<List>{null}</List>).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
