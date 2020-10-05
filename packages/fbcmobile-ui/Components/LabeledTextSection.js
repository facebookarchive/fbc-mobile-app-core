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
import {StyleSheet, View} from 'react-native';

type Props = {
  +style?: ViewStyleProp,
  +title: React.Node,
  +content: React.Node,
};

const LabeledTextSection = ({title, content, style}: Props) => {
  return (
    <View style={style}>
      <Text variant="h8" weight="bold" style={styles.title}>
        {title}
      </Text>
      {typeof content === 'string' ? (
        <Text variant="h6" weight="light" numberOfLines={3}>
          {content}
        </Text>
      ) : (
        content
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    marginBottom: 5,
  },
});

export default LabeledTextSection;
