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
import Text from '@fbcmobile/ui/Components/Core/Text';
import {Colors} from '@fbcmobile/ui/Theme';
import {StyleSheet, View} from 'react-native';

export type BadgeVariant = 'primary' | 'secondary';

type Props = {
  +label?: React.Node,
  +icon?: React.Node,
  +variant?: BadgeVariant,
};

const Badge = ({label, variant = 'primary', icon}: Props) => {
  return (
    <View
      style={[
        styles.root,
        variant === 'primary' ? styles.primary : styles.secondary,
      ]}>
      {icon != null ? <View style={styles.icon}>{icon}</View> : null}
      {label != null ? (
        <Text
          style={styles.text}
          variant="h7"
          weight="medium"
          color={variant === 'primary' ? 'light' : 'primary'}>
          {label}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.Blue,
  },
  primary: {
    backgroundColor: Colors.Blue,
  },
  icon: {
    paddingVertical: 3,
    paddingHorizontal: 9,
  },
  text: {
    paddingVertical: 7,
    paddingHorizontal: 10,
  },
  secondary: {
    backgroundColor: Colors.BlueBackground,
  },
});

export default Badge;
