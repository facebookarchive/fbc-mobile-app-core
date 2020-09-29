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

import Colors from '@fbcmobile/ui/Theme/Colors';

const size = {
  h1: 30,
  h2: 20,
  h3: 16,
  h4: 16,
  h5: 16,
  h6: 15,
  h7: 13,
  h8: 13,
  h9: 12,
};

const style = {
  h1: {
    fontSize: size.h1,
    fontWeight: 'bold',
    color: Colors.BlueGray,
    lineHeight: 37,
  },
  h2: {
    fontSize: size.h2,
    fontWeight: '500',
    color: Colors.BlueGray,
    lineHeight: 25,
  },
  h3: {
    fontSize: size.h3,
    fontWeight: '500',
    color: Colors.BlueGray,
    lineHeight: 20,
  },
  h4: {
    fontSize: size.h4,
    fontWeight: '500',
    color: Colors.Blue,
    lineHeight: 20,
  },
  h5: {
    fontSize: size.h5,
    fontWeight: '400',
    color: Colors.BlueGray,
    lineHeight: 20,
  },
  h6: {
    fontSize: size.h6,
    fontWeight: '500',
    color: Colors.BlueGray,
    lineHeight: 20,
  },
  h7: {
    fontSize: size.h7,
    fontWeight: '400',
    color: Colors.BlueGray,
    lineHeight: 15,
  },
  h8: {
    fontSize: size.h8,
    fontFamily: 'Roboto-Light',
    color: Colors.BlueGray,
    lineHeight: 15,
  },
  h9: {
    fontSize: size.h9,
    fontWeight: '400',
    color: Colors.White,
    lineHeight: 14,
  },
};

export default {
  size,
  style,
};
