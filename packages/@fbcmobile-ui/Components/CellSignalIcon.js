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

const CellSignalIcon = ({signalStrength}: Props) => {
  const getIconName = () => {
    if (signalStrength >= -100) {
      return 'signal-cellular-3';
    } else if (signalStrength >= -110) {
      return 'signal-cellular-2';
    } else if (signalStrength >= -120) {
      return 'signal-cellular-1';
    } else {
      return 'signal-cellular-outline';
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

export default CellSignalIcon;
