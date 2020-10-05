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
import Colors from '@fbcmobile/ui/Theme/Colors';
import fbt from 'fbt';
import {Fonts} from '@fbcmobile/ui/Theme';
import {StyleSheet, Text, View} from 'react-native';

export const Statuses = {
  PLANNED: 'PLANNED',
  IN_PROGRESS: 'IN_PROGRESS',
  SUBMITTED: 'SUBMITTED',
  CLOSED: 'CLOSED',
  BLOCKED: 'BLOCKED',

  /* Deprecated. Will be removed on 2020-11-01 */
  PENDING: 'PENDING',
  /* Deprecated. Will be removed on 2020-11-01 */
  DONE: 'DONE',
};

export type Status = $Values<typeof Statuses>;

type Props = {
  +style?: ViewStyleProp,
  +status: Status,
};

const getStatusProps = (
  status: Status,
): ?{|
  +label: React.Node,
  +style: ViewStyleProp,
|} => {
  switch (status) {
    case Statuses.PLANNED:
      return {
        label: (
          <fbt desc="Label indicating status of a work order">Planned</fbt>
        ),
        style: styles.plannedPill,
      };
    case Statuses.IN_PROGRESS:
      return {
        label: <fbt desc="In Progress task">In Progress</fbt>,
        style: styles.inProgressPill,
      };
    case Statuses.SUBMITTED:
      return {
        label: <fbt desc="Submitted task">Submitted</fbt>,
        style: styles.submittedPill,
      };
    case Statuses.CLOSED:
      return {
        label: <fbt desc="Closed task">Closed</fbt>,
        style: styles.closedPill,
      };
    case Statuses.BLOCKED:
      return {
        label: <fbt desc="BLOCKED task">Blocked</fbt>,
        style: styles.blockedPill,
      };
    case Statuses.PENDING:
      return {
        label: <fbt desc="Pending task">Pending</fbt>,
        style: styles.pendingPill,
      };
    case Statuses.DONE:
      return {label: <fbt desc="Done task">Done</fbt>, style: styles.donePill};
    default:
      return null;
  }
};

const StatusPill = ({status, style}: Props) => {
  const pillProps = getStatusProps(status);
  if (pillProps == null) {
    return null;
  }
  return (
    <View style={[styles.root, pillProps.style, style]}>
      <Text style={styles.statusText}>{pillProps.label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: 5,
    paddingVertical: 3,
    borderRadius: 3,
  },
  plannedPill: {
    backgroundColor: Colors.Gray55,
  },
  inProgressPill: {
    backgroundColor: Colors.OrangeLight,
  },
  submittedPill: {
    backgroundColor: Colors.Teal,
  },
  blockedPill: {
    backgroundColor: Colors.OrangeRed,
  },
  closedPill: {
    backgroundColor: Colors.Gray65,
  },
  pendingPill: {
    backgroundColor: Colors.WarmYellow,
  },
  donePill: {
    backgroundColor: Colors.GrassGreen,
  },
  statusText: {
    ...Fonts.style.h9,
    fontWeight: '500',
  },
});

export default StatusPill;
