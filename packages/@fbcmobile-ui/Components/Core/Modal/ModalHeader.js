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
import {Colors} from '@fbcmobile/ui/Theme';
import {Icon} from 'react-native-material-ui';
import {StyleSheet, TouchableOpacity, View} from 'react-native';

type Props = {
  +title: React.Node,
  +onClosePressed?: () => void,
  +showCloseButton?: boolean,
  +style?: ViewStyleProp,
};

const ModalHeader = ({
  title,
  onClosePressed,
  style,
  showCloseButton = true,
}: Props) => {
  return (
    <View style={[styles.root, style]}>
      {showCloseButton ? (
        <TouchableOpacity style={styles.closeButton} onPress={onClosePressed}>
          <Icon
            iconSet="MaterialCommunityIcons"
            name="window-close"
            color={Colors.Gray60}
            size={28}
          />
        </TouchableOpacity>
      ) : null}
      <View style={styles.textContainer}>
        <Text
          variant="h3"
          weight="bold"
          style={showCloseButton ? styles.text : styles.textCentered}>
          {title}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 34,
  },
  closeButton: {
    paddingLeft: 16,
  },
  textContainer: {
    flex: 1,
    paddingHorizontal: 10,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  text: {
    width: '100%',
    textAlign: 'left',
  },
  textCentered: {
    width: '100%',
    textAlign: 'center',
  },
});

export default ModalHeader;
