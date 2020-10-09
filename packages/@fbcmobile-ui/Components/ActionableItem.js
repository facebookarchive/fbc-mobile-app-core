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
import {TouchableOpacity, View} from 'react-native';

type Props = {
  +title: string,
  +actionItem: React.Node,
  +onPress?: () => void,
};

const ActionableItem = (props: Props) => {
  const {title, actionItem, onPress} = props;

  const titleItem = (
    <Text color="gray" weight="bold">
      {title}
    </Text>
  );

  return onPress == null ? (
    <View style={styles.container}>
      {titleItem}
      {actionItem}
    </View>
  ) : (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {titleItem}
      {actionItem}
    </TouchableOpacity>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.BackgroundWhite,
    minHeight: 60,
  },
};

export default ActionableItem;
