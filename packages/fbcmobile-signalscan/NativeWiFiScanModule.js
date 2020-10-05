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

export type WiFiScanData = {|
  timestamp: number,
  frequency: number,
  channel: number,
  bssid: string,
  strength: number,
  ssid?: ?string,
  band?: ?string,
  channelWidth?: ?number,
  capabilities?: ?string,
  latitude?: ?number,
  longitude?: ?number,
  altitude?: ?number,
  heading?: ?number,
  rssi?: ?number,
|};

export interface Spec extends TurboModule {
  ERROR_KEY: string;
  ERROR_CODE_PERMISSION: string;
  ERROR_PERMISSION: string;
  ERROR_CODE_WIFI_MANAGER: string;
  ERROR_WIFI_MANAGER: string;
  ERROR_CODE_WIFI_DISABLED: string;
  ERROR_WIFI_DISABLED: string;
  ERROR_FAILED_TO_SHOW_WIFI_SETTINGS: string;
  WIFI_SETTINGS_OPENED: string;
  getNetworkScanResults: () => {[string]: Object};
  navigateToWiFiSettings: () => {result: string};
}

export default TurboModuleRegistry.getEnforcing<Spec>('WiFiScanResultsModule');
