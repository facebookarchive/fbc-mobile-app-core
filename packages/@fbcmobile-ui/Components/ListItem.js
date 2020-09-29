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
import Divider from '@fbcmobile/ui/Components/Core/Divider';
import {Colors} from '@fbcmobile/ui/Theme';
import {StyleSheet, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

type Props = {
  +children: React.Node,
  +onItemClicked?: void => any,
  +hideDivider?: boolean,
  +fullWidth?: boolean,
  +style?: ViewStyleProp,
  +dividerStyle?: ViewStyleProp,
};

export default function ListItem(props: Props) {
  const {
    children,
    onItemClicked,
    hideDivider,
    fullWidth,
    style,
    dividerStyle,
  } = props;
  const itemContainerStyles =
    fullWidth === true
      ? StyleSheet.compose(
          {
            ...styles.itemContainer,
            ...styles.fullWidth,
          },
          style,
        )
      : StyleSheet.compose(styles.itemContainer, style);
  const dividerStyles =
    fullWidth === true
      ? StyleSheet.compose(
          {
            ...styles.divider,
            ...styles.dividerFullWidth,
          },
          dividerStyle,
        )
      : StyleSheet.compose(styles.divider, dividerStyle);

  return (
    <View>
      {onItemClicked ? (
        <TouchableOpacity style={itemContainerStyles} onPress={onItemClicked}>
          {children}
        </TouchableOpacity>
      ) : (
        <View style={itemContainerStyles}>{children}</View>
      )}
      {hideDivider ? null : <Divider style={dividerStyles} />}
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: Colors.BackgroundWhite,
    paddingRight: 19,
    paddingVertical: 28,
  },
  fullWidth: {
    paddingLeft: 19,
  },
  divider: {
    marginRight: 19,
  },
  dividerFullWidth: {
    marginRight: 0,
  },
});
