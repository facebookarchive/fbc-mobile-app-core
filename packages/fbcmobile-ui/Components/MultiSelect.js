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
import {View, YellowBox} from 'react-native';

export type Option = {
  label: string,
  on: boolean,
};

type Props = {
  +options: Array<Option>,
  +callback: (options: Array<Option>) => void,
};

const MultiSelect = (props: Props) => {
  YellowBox.ignoreWarnings(['Warning: componentWillReceiveProps']);
  const {callback} = props;
  const [options, setOptions] = useState(props.options);

  useEffect(() => {
    callback(options);
  }, [options, callback]);

  const onSelect = label => {
    const index = options.findIndex(item => item.label === label);
    const newOptions = options.slice();
    newOptions[index] = {
      label,
      on: !options[index].on,
    };
    setOptions(newOptions);
  };

  return (
    <View style={styles.container}>
      {options.map(option => (
        <ListItem
          key={option.label}
          style={styles.listItem}
          centerElement={option.label}
          onPress={() => onSelect(option.label)}
          leftElement={option.on ? 'check-box' : 'check-box-outline-blank'}
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
    primaryText: {
      fontSize: Fonts.size.h2,
    },
    leftElement: {
      color: Colors.Blue,
    },
  },
};

export default MultiSelect;
