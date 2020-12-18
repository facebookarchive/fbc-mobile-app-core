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

import CounterInput from '../CounterInput';
import React from 'react';
import renderer from 'react-test-renderer';
import {fireEvent, render} from '@testing-library/react-native';

describe('CounterInput Tests', () => {
  test('CounterInput renders correctly', () => {
    const onCountChanged = jest.fn();
    const tree = renderer
      .create(
        <CounterInput
          count={1}
          minCount={0}
          maxCount={10}
          onCountChanged={onCountChanged}
        />,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('CounterInput renders correctly with min count', () => {
    const onCountChanged = jest.fn();
    const tree = renderer
      .create(
        <CounterInput
          count={0}
          minCount={0}
          maxCount={10}
          onCountChanged={onCountChanged}
        />,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('CounterInput renders correctly with max count', () => {
    const onCountChanged = jest.fn();
    const tree = renderer
      .create(
        <CounterInput
          count={10}
          minCount={0}
          maxCount={10}
          onCountChanged={onCountChanged}
        />,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('CounterInput test onPress minus icon', () => {
    const onCountChanged = jest.fn();
    const {getByTestId} = render(
      <CounterInput
        count={10}
        minCount={0}
        maxCount={10}
        onCountChanged={onCountChanged}
      />,
    );
    const minusIcon = getByTestId('minus-icon');
    fireEvent.press(minusIcon);
    expect(onCountChanged).toHaveBeenCalled();
  });
});
