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

import ModalHeader from '../ModalHeader';
import React from 'react';
import renderer from 'react-test-renderer';

describe('ModalHeader Tests', () => {
  test('ModalHeader renders correctly', () => {
    const tree = renderer.create(<ModalHeader title={'title'} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('ModalHeader renders correctly without show close button', () => {
    const tree = renderer
      .create(<ModalHeader title={'title'} showCloseButton={false} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
