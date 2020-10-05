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
import Switch from '@fbcmobile/ui/Components/Core/Switch';
import {View} from 'react-native';

type Props = {
  +value: ?boolean,
  +onChangeBool?: (value: ?boolean) => void,
};

const BooleanInput = (props: Props) => {
  const {value, onChangeBool} = props;
  return (
    <View style={styles.inputContainer}>
      <Switch
        checked={value ?? false}
        onPress={() => onChangeBool && onChangeBool(!value)}
      />
    </View>
  );
};

const styles = {
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
};

export default BooleanInput;
