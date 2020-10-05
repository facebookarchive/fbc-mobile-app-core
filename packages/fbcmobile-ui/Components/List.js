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
import Text from '@fbcmobile/ui/Components/Core/Text';
import {View} from 'react-native';

type Props = {
  +style?: ViewStyleProp,
  +children: React.Node,
  +emptyLabel?: string,
};

export default function ListView(props: Props) {
  const {children, emptyLabel, style} = props;
  return (
    <View style={[styles.root, style]}>
      {React.Children.count(children) === 0 ? (
        <View style={styles.emptyLabel}>
          <Text variant="h3">{emptyLabel ?? ''}</Text>
        </View>
      ) : (
        children
      )}
    </View>
  );
}

const styles = {
  root: {
    display: 'flex',
  },
  emptyLabel: {
    paddingVertical: 16,
  },
};
