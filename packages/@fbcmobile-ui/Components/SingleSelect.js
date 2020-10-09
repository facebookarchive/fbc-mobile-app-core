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

import React, {useEffect, useState} from 'react';
import {Colors, Fonts} from '@fbcmobile/ui/Theme';
import {ListItem} from 'react-native-material-ui';
import {View} from 'react-native';
import {YellowBox} from 'react-native';

type Props = {
  +options: Array<string>,
  +callback: (option: ?string) => void,
  +reversible?: boolean,
};

const SingleSelect = (props: Props) => {
  YellowBox.ignoreWarnings(['Warning: componentWillReceiveProps']);
  const {options, callback, reversible} = props;
  const [selected, setSelected] = useState<?string>(null);

  useEffect(() => {
    callback(selected);
  }, [selected, callback]);

  return (
    <View style={styles.container}>
      {options.map(option => (
        <ListItem
          key={option}
          style={styles.listItem}
          centerElement={option}
          onPress={() => {
            if (reversible && option === selected) {
              setSelected(null);
            } else {
              setSelected(option);
            }
          }}
          leftElement={
            selected === option
              ? 'radio-button-checked'
              : 'radio-button-unchecked'
          }
        />
      ))}
    </View>
  );
};

const styles = {
  container: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  listItem: {
    container: {
      backgroundColor: 'transparent',
    },
    primaryText: {
      fontSize: Fonts.size.h2,
    },
    leftElement: {
      color: Colors.Blue,
    },
  },
};

export default SingleSelect;
