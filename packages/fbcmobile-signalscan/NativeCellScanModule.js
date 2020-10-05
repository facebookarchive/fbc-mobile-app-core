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

import * as TurboModuleRegistry from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import {TurboModule} from 'react-native/Libraries/TurboModule/RCTExport';

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

export interface Spec extends TurboModule {
  ERROR_KEY: string;
  getCellScanResults: () => {[string]: Object};
  stopCellScan: () => void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('CellScanResultsModule');
