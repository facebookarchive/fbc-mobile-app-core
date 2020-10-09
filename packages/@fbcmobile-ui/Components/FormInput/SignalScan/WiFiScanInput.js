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

import type {WiFiScanData} from '@fbcmobile/ui/Components/Views/WiFiScanResults';

import ActionableItem from '@fbcmobile/ui/Components/ActionableItem';
import Button from '@fbcmobile/ui/Components/Core/Button';
import Collapsible from 'react-native-collapsible';
import Geolocation from 'react-native-geolocation-service';
import NavigationService from '@fbcmobile/ui/Services/NavigationService';
import React, {useState} from 'react';
import Spinner from 'react-native-spinkit';
import UserActionLogger from '@fbcmobile/ui/Logging/UserActionLogger';
import WiFiScanResults from '@fbcmobile/ui/Components/Views/WiFiScanResults';
import fbt from 'fbt';
import {Colors} from '@fbcmobile/ui/Theme';
import {ERROR, METRIC} from '@fbcmobile/ui/Logging/UserActionEvents';
import {Icon} from 'react-native-material-ui';
import {
  LOCATION_MAXIMUM_AGE_MS,
  LOCATION_REQUEST_TIMEOUT_MS,
} from '@fbcmobile/ui/Components/FormInput/SignalScan/Constants';
import {View} from 'react-native';
import {WiFiScanModule} from '@fbcmobile/signalscan';

type Props = $ReadOnly<{|
  +wifiData?: ?$ReadOnlyArray<WiFiScanData>,
  +onWiFiScanned: (wifiData: Array<WiFiScanData>) => void,
|}>;

const WiFiScanInput = (props: Props) => {
  const {wifiData, onWiFiScanned} = props;
  const [scanResults, setScanResults] = useState<?Array<WiFiScanData>>(
    wifiData ? [].concat(wifiData.filter(n => n)) : null,
  );
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const _handleResults = (results, position) => {
    const validResults = Object.keys(results).map(bssid => {
      const wifi: WiFiScanData = results[bssid];
      return {
        timestamp: (wifi.timestamp / 1000) | 0, // convert from microseconds to milliseconds
        frequency: wifi.frequency,
        channel: wifi.channel,
        bssid: bssid,
        strength: wifi.strength,
        ssid: wifi.ssid,
        band: wifi.band,
        channelWidth: wifi.channelWidth,
        capabilities: wifi.capabilities,
        latitude: position?.coords.latitude || 0,
        longitude: position?.coords.longitude || 0,
      };
    });
    setScanResults(validResults);
    setIsScanning(false);
    onWiFiScanned(validResults);
  };

  const _reportError = results => {
    switch (results[WiFiScanModule.ERROR_KEY]) {
      case WiFiScanModule.ERROR_CODE_WIFI_DISABLED:
        NavigationService.alert(
          'error',
          fbt(
            'Wi-Fi disabled',
            'Error message title shown when the user tries to scan WiFi signals with the WiFi turned off.',
          ),
          fbt(
            'Please, turn on the Wi-Fi on your device to enable Wi-Fi scans',
            'Error message shown when the user tries to scan WiFi signals with the WiFi turned off.',
          ),
        );
        break;
      case WiFiScanModule.ERROR_CODE_WIFI_MANAGER:
        NavigationService.alert(
          'error',
          fbt(
            'Not supported',
            'Error message title shown when the user tries to scan WiFi signals on a device that does not support this feature.',
          ),
          fbt(
            'This feature is not supported on this device',
            'Error message shown when the user tries to scan WiFi signals on a device that does not support this feature.',
          ),
        );
        break;
      case WiFiScanModule.ERROR_CODE_PERMISSION: // Bootcamp task [T55186592]
      default:
        NavigationService.alert(
          'error',
          fbt(
            'Scan error',
            'Error message title shown when an unexpected error ocurred while scanning WiFi signals.',
          ),
          fbt(
            'An error ocurred while scanning Wi-Fi signals. Please try again later',
            'Error message shown when an unexpected error ocurred while scanning WiFi signals.',
          ),
        );
        break;
    }
  };

  const scan = async () => {
    setScanResults(null);
    setCollapsed(true);
    setIsScanning(true);
    const results = await WiFiScanModule.getNetworkScanResults();
    if (WiFiScanModule.ERROR_KEY in results) {
      _reportError(results);
      return;
    }
    const startTime = Date.now();
    Geolocation.getCurrentPosition(
      position => {
        UserActionLogger.logMetric({
          key: METRIC.GPS_LOCK_LOW_ACCURACY,
          metric: Date.now() - startTime,
        });
        _handleResults(results, position);
      },
      error => {
        UserActionLogger.logError({
          key: ERROR.ERROR_GETTING_GEOLOCATION,
          errorMessage: error.message,
        });
        _handleResults(results, null);
      },
      {
        enableHighAccuracy: false,
        timeout: LOCATION_REQUEST_TIMEOUT_MS,
        maximumAge: LOCATION_MAXIMUM_AGE_MS,
      },
    );
  };

  return (
    <View>
      {scanResults == null ? (
        <ActionableItem
          title={fbt(
            'Wi-Fi Networks',
            'Drop down text that appears after a scan of WiFi signals. A number comes before this',
          )}
          actionItem={
            <View>
              {isScanning ? (
                <Spinner
                  size={styles.spinner.size}
                  color={Colors.Blue}
                  type="ThreeBounce"
                />
              ) : (
                <Button variant="secondary" onPress={scan}>
                  <fbt desc="Scan button text">Scan</fbt>
                </Button>
              )}
            </View>
          }
        />
      ) : (
        <View>
          <ActionableItem
            title={fbt(
              fbt.plural('Wi-Fi Network Found', scanResults.length, {
                showCount: 'yes',
                many: 'Wi-Fi Networks Found',
              }),
              'Search result text',
            ).toString()}
            actionItem={
              <Icon
                name={collapsed ? 'expand-more' : 'expand-less'}
                iconSet="MaterialIcons"
                color={Colors.Gray80}
              />
            }
            onPress={() => setCollapsed(!collapsed)}
          />
          <Collapsible collapsed={collapsed}>
            <WiFiScanResults scanResults={scanResults} />
            <View style={styles.rescanContainer}>
              <Button variant="secondary" onPress={scan}>
                <fbt desc="Button text that repeats a completed wifi signal scan">
                  Rescan
                </fbt>
              </Button>
            </View>
          </Collapsible>
        </View>
      )}
    </View>
  );
};

const styles = {
  spinner: {
    size: 20,
  },
  rescanContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
};

export default WiFiScanInput;
