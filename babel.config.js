/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = {
  plugins: [
    'macros',
    'babel-plugin-fbt',
    'babel-plugin-fbt-runtime',
  ],
  presets: ['module:metro-react-native-babel-preset'],
};
