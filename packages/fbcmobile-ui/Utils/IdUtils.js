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

import shortid from 'shortid';

const TEMP_ID_PREFIX = 'tmp@';

export const generateTempId = (): string => {
  return `${TEMP_ID_PREFIX}_${shortid.generate()}`;
};

export const isTempId = (id: string): boolean => {
  return id.startsWith(TEMP_ID_PREFIX);
};
