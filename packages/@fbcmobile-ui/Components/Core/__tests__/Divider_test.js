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

import Divider from '../Divider';
import React from 'react';
import renderer from 'react-test-renderer';

test('Divider renders correctly', () => {
  const tree = renderer.create(<Divider />).toJSON();
  expect(tree).toMatchSnapshot();
});
