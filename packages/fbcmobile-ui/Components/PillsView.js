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
import {View} from 'react-native';

type Props = {
  +style?: ViewStyleProp,
  +children: React.Node,
};

const PillsView = ({children, style}: Props) => {
  if (React.Children.count(children) === 0) {
    return null;
  }
  return (
    <View style={[styles.root, style]}>
      {React.Children.toArray(children)
        .filter(c => c != null)
        .map((c, i) => (
          <View key={`pill_${i}`} style={styles.pill}>
            {c}
          </View>
        ))}
    </View>
  );
};

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  pill: {
    marginRight: 10,
  },
};

export default PillsView;
