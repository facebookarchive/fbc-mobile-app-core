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

import ModalActions from '../ModalActions';
import React from 'react';
import renderer from 'react-test-renderer';

describe('ModalActions Tests', () => {
  test('ModalActions renders correctly', () => {
    const tree = renderer
      .create(<ModalActions okLabel={'ok'} onOkPressed={jest.fn()} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('ModalActions renders correctly with divider', () => {
    const tree = renderer
      .create(
        <ModalActions
          okLabel={'ok'}
          onOkPressed={jest.fn()}
          showDivider={true}
        />,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('ModalActions renders correctly with cancel label', () => {
    const tree = renderer
      .create(
        <ModalActions
          okLabel={'ok'}
          onOkPressed={jest.fn()}
          cancelLabel={'cancel'}
        />,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });});
