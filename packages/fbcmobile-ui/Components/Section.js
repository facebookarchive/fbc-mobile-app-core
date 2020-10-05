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
import Colors from '@fbcmobile/ui/Theme/Colors';
import Text from '@fbcmobile/ui/Components/Core/Text';
import {View} from 'react-native';

type Props = {
  +title: React.Node,
  +children: any,
};

export default function Section(props: Props) {
  const {children, title} = props;
  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.titleText}>{title}</Text>
      </View>
      <View>{children}</View>
    </View>
  );
}

const styles = {
  header: {
    backgroundColor: Colors.Gray5,
    paddingVertical: 14,
    paddingHorizontal: 23,
  },
  titleText: {
    textAlign: 'right',
  },
};
