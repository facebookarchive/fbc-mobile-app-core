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

import MIcon from 'react-native-vector-icons/MaterialIcons';
import Menu, {MenuItem} from 'react-native-material-menu';
import React, {useRef} from 'react';
import Text from '@fbcmobile/ui/Components/Core/Text';
import fbt from 'fbt';
import {Colors} from '@fbcmobile/ui/Theme';
import {ListItem} from 'react-native-material-ui';
import {ScrollView, YellowBox} from 'react-native';

export type Filter = {
  id: string,
  name: string,
};

type Props = {
  +possibleFilters: Array<Filter>,
  +numberOfResults: number,
  +filter: ?Filter,
  +onFilter: (filter: ?Filter) => void,
};

const FilterBar = (props: Props) => {
  YellowBox.ignoreWarnings(['Warning: componentWillReceiveProps']);
  const {possibleFilters, numberOfResults, onFilter, filter} = props;
  const menuRef = useRef(null);
  return (
    <ListItem
      style={styles.filterBar}
      rightElement={
        <Menu
          ref={menuRef}
          style={styles.menu}
          button={
            <MIcon.Button
              style={styles.dropdownContainer}
              iconStyle={styles.dropdownIcon}
              name="arrow-drop-down"
              onPress={() => menuRef.current && menuRef.current.show()}>
              <Text>
                {`${filter?.name ||
                  fbt(
                    'All',
                    'Label to show no filter is selected',
                  )} (${numberOfResults})`}
              </Text>
            </MIcon.Button>
          }>
          <ScrollView>
            {filter !== null && (
              <MenuItem
                onPress={() => {
                  menuRef.current && menuRef.current.hide();
                  onFilter(null);
                }}>
                <MIcon size={20} name="cancel" />
              </MenuItem>
            )}
            {possibleFilters
              .filter(f => f.id !== filter?.id)
              .map(f => (
                <MenuItem
                  key={f.id}
                  onPress={() => {
                    menuRef.current && menuRef.current.hide();
                    onFilter(f);
                  }}>
                  <Text>{f.name}</Text>
                </MenuItem>
              ))}
          </ScrollView>
        </Menu>
      }
    />
  );
};

const styles = {
  filterBar: {
    container: {backgroundColor: Colors.Gray5},
  },
  menu: {
    maxHeight: 400,
  },
  dropdownContainer: {
    flexDirection: 'row-reverse',
    backgroundColor: Colors.Gray5,
  },
  dropdownIcon: {
    color: Colors.Black,
    marginLeft: 5,
  },
};

export default FilterBar;
