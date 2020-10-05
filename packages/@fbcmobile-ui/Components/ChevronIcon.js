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
import {I18nManager} from 'react-native';
import {Icon} from 'react-native-material-ui';

const ChevronIcon = () => {
  return I18nManager.isRTL ? (
    <Icon name="chevron-left" iconSet="MaterialIcons" />
  ) : (
    <Icon name="chevron-right" iconSet="MaterialIcons" />
  );
};

export default ChevronIcon;
