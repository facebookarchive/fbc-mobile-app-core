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

import Badge from '../Badge';
import React from 'react';
import renderer from 'react-test-renderer';
import {Icon} from 'react-native-material-ui';

describe('Badge Tests', () => {
  test('Badge renders correctly', () => {
    const tree = renderer.create(<Badge />).toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('Badge renders correctly with label', () => {
    const tree = renderer.create(<Badge label={'testing'} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('Badge renders correctly with label and variant', () => {
    const tree = renderer
      .create(<Badge label={'testing'} variant={'secondary'} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('Badge renders correctly with label, variant, and icon', () => {
    const tree = renderer
      .create(
        <Badge
          label={'testing'}
          variant={'secondary'}
          icon={<Icon name={'work'} />}
        />,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
