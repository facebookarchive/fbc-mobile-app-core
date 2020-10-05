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
import Text from '@fbcmobile/ui/Components/Core/Text';
import WifiSignalIcon from '@fbcmobile/ui/Components/WifiSignalIcon';
import {Colors} from '@fbcmobile/ui/Theme';
import {Icon} from 'react-native-material-ui';
import {StyleSheet, View} from 'react-native';

export const WIFI_SECURITY_CAPABILITIES = ['WEP', 'WPA', 'WPA2', 'WPA_EAP'];

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

type Props = {|
  +scanResults: Array<WiFiScanData>,
|};

const WiFiScanResults = ({scanResults}: Props) => {
  return (
    <View style={styles.root}>
      {scanResults.map(wifi => {
        if (wifi != null) {
          const ssidText =
            wifi.ssid === '' || wifi.ssid == null ? '' : `${wifi.ssid}, `;
          return (
            <View style={styles.entry} key={wifi.bssid}>
              <Text color="gray" style={styles.ssidName}>
                {`${ssidText}${wifi.channel}-${wifi.band ?? ''}`}
              </Text>
              {wifi.capabilities != null &&
              WIFI_SECURITY_CAPABILITIES.some(s =>
                wifi.capabilities?.includes(s),
              ) ? (
                <Icon
                  style={styles.lockIcon}
                  name="lock"
                  iconSet="MaterialCommunityIcons"
                  color={Colors.Gray80}
                  size={16}
                />
              ) : null}
              <WifiSignalIcon signalStrength={wifi.strength} />
            </View>
          );
        }
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  entry: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 12,
  },
  ssidName: {
    flexGrow: 1,
  },
  lockIcon: {
    marginRight: 4,
  },
});

export default WiFiScanResults;
