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

import ModalContent from '../ModalContent';
import React from 'react';
import renderer from 'react-test-renderer';

describe('ModalContent Tests', () => {
  test('ModalContent renders correctly', () => {
    const tree = renderer.create(<ModalContent>{null}</ModalContent>).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
