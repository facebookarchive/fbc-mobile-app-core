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
import {Icon} from 'react-native-material-ui';
import {StyleSheet, TouchableOpacity, View} from 'react-native';

type Props = {
  +count: number,
  +minCount: number,
  +maxCount: number,
  +onCountChanged: (newCount: number) => void,
};

const CounterInput = ({count, minCount, maxCount, onCountChanged}: Props) => {
  return (
    <View style={styles.root}>
      <TouchableOpacity
        disabled={count <= minCount}
        onPress={() => onCountChanged(count - 1)}>
        <Icon
          name="minus-circle-outline"
          iconSet="MaterialCommunityIcons"
          size={30}
          color={count <= minCount ? Colors.Gray85 : Colors.BlueGray}
        />
      </TouchableOpacity>
      <Text style={styles.count} variant="h2" weight="regular" color="gray">
        {count < 10 ? `0${count}` : count}
      </Text>
      <TouchableOpacity
        disabled={count >= maxCount}
        onPress={() => onCountChanged(count + 1)}>
        <Icon
          name="plus-circle-outline"
          iconSet="MaterialCommunityIcons"
          size={30}
          color={count >= maxCount ? Colors.Gray85 : Colors.BlueGray}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
  },
  count: {
    marginHorizontal: 10,
  },
});

export default CounterInput;
