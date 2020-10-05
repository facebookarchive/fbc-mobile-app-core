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
import {Colors} from '@fbcmobile/ui/Theme';
import {Icon} from 'react-native-material-ui';

type Props = $ReadOnly<{|
  +signalStrength: number,
|}>;

const WifiSignalIcon = ({signalStrength}: Props) => {
  const getIconName = () => {
    switch (signalStrength) {
      case 0:
        return 'wifi-strength-outline';
      case 1:
        return 'wifi-strength-1';
      case 2:
        return 'wifi-strength-2';
      case 3:
        return 'wifi-strength-3';
      case 4:
      default:
        return 'wifi-strength-4';
    }
  };

  return (
    <Icon
      name={getIconName()}
      iconSet="MaterialCommunityIcons"
      color={Colors.Gray80}
      size={16}
    />
  );
};

export default WifiSignalIcon;
