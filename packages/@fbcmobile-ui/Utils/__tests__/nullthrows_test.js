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
import nullthrows from '@fbcmobile/ui/Utils/nullthrows';

describe('nullthrows tests', () => {
  test('test nullthrows with error message', () => {
    expect.assertions(1);
    try {
      const _oops = nullthrows(null, 'oops');
    } catch (error) {
      expect(error).toHaveProperty('message', '[NullValueError] oops');
    }
  });
  test('test nullthrows', () => {
    expect.assertions(1);
    try {
      const _noOops = nullthrows(null);
    } catch (error) {
      expect(error).toHaveProperty('message', '[NullValueError]');
    }
  });
});
