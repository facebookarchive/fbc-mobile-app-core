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

import ChevronIcon from '@fbcmobile/ui/Components/ChevronIcon';
import Colors from '@fbcmobile/ui/Theme/Colors';
import React from 'react';
import Text from '@fbcmobile/ui/Components/Core/Text';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {View} from 'react-native';

export type BreadcrumbData = {
  id: string,
  name: string,
  type?: string,
};

type Props = {
  +data: BreadcrumbData,
  +isLast: boolean,
  +onClick: (data: BreadcrumbData) => any,
  +style?: ViewStyleProp,
};

const Breadcrumb = (props: Props) => {
  const {data, isLast, onClick, style} = props;
  return (
    <View style={[styles.root, style]}>
      <TouchableOpacity style={styles.pill} onPress={() => onClick(data)}>
        <Text style={styles.pillText}>{data.name}</Text>
      </TouchableOpacity>
      {!isLast && <ChevronIcon />}
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
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: Colors.Gray20,
    color: Colors.BlackText,
    borderRadius: 6,
  },
  pillText: {
    fontWeight: '500',
    fontSize: 13,
    lineHeight: 15,
  },
};

export default Breadcrumb;
