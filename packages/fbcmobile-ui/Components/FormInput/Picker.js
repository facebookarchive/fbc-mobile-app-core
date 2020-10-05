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
import {Colors, Fonts} from '@fbcmobile/ui/Theme';
import {Dropdown} from 'react-native-material-dropdown';

export type Option = {
  value: string,
};

type Props = {
  +title: string,
  +options: Array<Option>,
  +onSelect?: (option: ?Option) => void,
  +value?: Option,
};

const Picker = (props: Props) => {
  return (
    <Dropdown
      containerStyle={styles.container}
      fontSize={Fonts.size.h2}
      baseColor={Colors.Gray70}
      labelFontSize={Fonts.size.h2}
      label={props.title}
      data={props.options}
      onChangeText={({value}) => {
        props.onSelect && props.onSelect(value);
      }}
      value={props.value}
      dropdownPosition={0}
    />
  );
};

const styles = {
  container: {
    paddingHorizontal: 10,
  },
};

export default Picker;
