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

import * as React from 'react';
import {Colors} from '@fbcmobile/ui/Theme';
import {StyleSheet, View} from 'react-native';

type Props = {
  +children: React.Node,
};

export const BOTTOM_BAR_HEIGHT = 71;

const BottomBar = ({children}: Props) => {
  return <View style={styles.root}>{children}</View>;
};

const styles = StyleSheet.create({
  root: {
    backgroundColor: Colors.BackgroundWhite,
    paddingHorizontal: 16,
    paddingVertical: 15,
    shadowRadius: 2,
    shadowOffset: {
      width: 0,
      height: -10,
    },
    shadowColor: Colors.Shadow,
    elevation: 4,
    height: BOTTOM_BAR_HEIGHT,
  },
});

export default BottomBar;
