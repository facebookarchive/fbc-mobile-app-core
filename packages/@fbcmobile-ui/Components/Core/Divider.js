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
import {Colors} from '@fbcmobile/ui/Theme';
import {StyleSheet, View} from 'react-native';

type Props = {
  +style?: ViewStyleProp,
};

const Divider = ({style}: Props) => {
  return <View style={[styles.root, style]} />;
};

const styles = StyleSheet.create({
  root: {
    height: 1,
    backgroundColor: Colors.Divider,
  },
});

export default Divider;
