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
import ChevronIcon from '@fbcmobile/ui/Components/ChevronIcon';
import ListItem from '@fbcmobile/ui/Components/ListItem';
import Text from '@fbcmobile/ui/Components/Core/Text';
import {StyleSheet, View} from 'react-native';

type Props = {|
  +title: React.Node,
  +description?: React.Node,
  +rightContent?: React.Node,
  +onClick: () => any,
  +fullWidth?: boolean,
  +titleStyle?: ViewStyleProp,
  +descriptionStyle?: ViewStyleProp,
|};

const NavigationListItem = (props: Props): React.Element<typeof ListItem> => {
  const {
    title,
    onClick,
    fullWidth,
    description,
    rightContent,
    titleStyle,
    descriptionStyle,
  } = props;
  return (
    <ListItem onItemClicked={onClick} fullWidth={fullWidth}>
      <View style={styles.root}>
        <View style={styles.titleContainer}>
          <Text style={titleStyle} variant="h2" weight="bold">
            {title}
          </Text>
          {description != null && (
            <Text
              style={[styles.description, descriptionStyle]}
              variant="h8"
              weight="regular"
              numberOfLines={2}>
              {description}
            </Text>
          )}
        </View>
        {rightContent}
        <ChevronIcon />
      </View>
    </ListItem>
  );
};

const styles = StyleSheet.create({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexGrow: 1,
    flexShrink: 1,
    marginRight: 20,
  },
  description: {
    marginTop: 5,
  },
});

export default NavigationListItem;
