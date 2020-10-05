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
import CellSignalIcon from '@fbcmobile/ui/Components/CellSignalIcon';
import Text from '@fbcmobile/ui/Components/Core/Text';
import {StyleSheet, View} from 'react-native';

export type CellularNetworkType =
  | 'CDMA'
  | 'GSM'
  | 'LTE'
  | 'WCDMA'
  | '%future added value';

export type CellScanData = {|
  networkType: CellularNetworkType,
  signalStrength: number,
  timestamp?: ?number,
  baseStationID?: ?string,
  networkID?: ?string,
  systemID?: ?string,
  cellID?: ?string,
  locationAreaCode?: ?string,
  mobileCountryCode?: ?string,
  mobileNetworkCode?: ?string,
  primaryScramblingCode?: ?string,
  operator?: ?string,
  arfcn?: ?number,
  physicalCellID?: ?string,
  trackingAreaCode?: ?string,
  timingAdvance?: ?number,
  earfcn?: ?number,
  uarfcn?: ?number,
  latitude?: ?number,
  longitude?: ?number,
  altitude?: ?number,
  heading?: ?number,
  rssi?: ?number,
|};

type Props = {|
  +scanResults: Array<CellScanData>,
|};

const CellScanResults = ({scanResults}: Props) => {
  return (
    <View style={styles.root}>
      {scanResults.map((cell, index) => {
        if (cell != null) {
          let cellDescription = cell.networkType;
          if (cell.operator != null) {
            cellDescription = `${cellDescription}, ${cell.operator}`;
          }
          return (
            <View style={styles.entry} key={index}>
              <Text style={styles.cellDescription} color="gray">
                {`${cellDescription}`}
              </Text>
              <CellSignalIcon signalStrength={cell.signalStrength} />
            </View>
          );
        }
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  entry: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 12,
  },
  cellIcon: {
    marginRight: 4,
  },
  cellDescription: {
    flexGrow: 1,
  },
});

export default CellScanResults;
