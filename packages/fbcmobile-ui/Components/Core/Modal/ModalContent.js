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

import type {ViewStyleProp} from 'react-native/Libraries/StyleSheet/StyleSheet';

import * as React from 'react';
import {StyleSheet, View} from 'react-native';

type Props = {
  +children: React.Node,
  +style?: ViewStyleProp,
};

const ModalContent = ({children, style}: Props) => {
  return <View style={[styles.root, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  root: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});

export default ModalContent;
