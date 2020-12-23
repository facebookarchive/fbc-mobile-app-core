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

import React from 'react';
import Text from '@fbcmobile/ui/Components/Core/Text';
import {Colors} from '@fbcmobile/ui/Theme';
import {ScrollView, TouchableOpacity, View} from 'react-native';

type Props = {
  +tabs: Array<{
    id: string,
    name: string,
  }>,
  +selectedTabId: string,
  +onTabClicked: (id: string) => void,
};

export default function TabView(props: Props) {
  const {tabs, selectedTabId, onTabClicked} = props;
  return (
    <View>
      <ScrollView
        style={styles.root}
        horizontal={true}
        showsHorizontalScrollIndicator={false}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.id}
            onPress={() => onTabClicked(tab.id)}
            style={[
              styles.tab,
              tab.id === selectedTabId ? styles.selectedTab : null,
            ]}>
            <Text
              variant="h7"
              weight="bold"
              color={selectedTabId === tab.id ? 'regular' : 'gray'}>
              {tab.name.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = {
  root: {
    backgroundColor: Colors.White,
    borderBottomColor: Colors.TransparentGray10,
    borderBottomWidth: 1,
  },
  tab: {
    paddingVertical: 16,
    paddingLeft: 20,
    paddingRight: 20,
  },
  selectedTab: {
    borderBottomColor: Colors.Black,
    borderBottomWidth: 2,
  },
};
