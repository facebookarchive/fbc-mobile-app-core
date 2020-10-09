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
import Colors from '@fbcmobile/ui/Theme/Colors';
import Text from '@fbcmobile/ui/Components/Core/Text';
import fbt from 'fbt';
import {View} from 'react-native';

export const Priorities = {
  URGENT: 'URGENT',
  HIGH: 'HIGH',
  MEDIUM: 'MEDIUM',
  LOW: 'LOW',
};

export type Priority = $Values<typeof Priorities>;

type Props = {
  +priority: Priority,
};

const getPriorityText = (priority: Priority): ?React.Node => {
  switch (priority) {
    case Priorities.URGENT:
      return <fbt desc="Urgent priority label">Urgent</fbt>;
    case Priorities.HIGH:
      return <fbt desc="High priority label">High</fbt>;
    case Priorities.MEDIUM:
      return <fbt desc="Medium priority label">Medium</fbt>;
    case Priorities.LOW:
      return <fbt desc="Low priority label">Low</fbt>;
    default:
      return null;
  }
};

const ProirityPill = ({priority}: Props) => {
  return (
    <View style={styles.root}>
      <Text color="regular" variant="h9" weight="medium">
        {getPriorityText(priority)}
      </Text>
    </View>
  );
};

const styles = {
  root: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 3,
    alignSelf: 'flex-start',
    borderWidth: 0.5,
    borderColor: Colors.BlueGray,
  },
};

export default ProirityPill;
