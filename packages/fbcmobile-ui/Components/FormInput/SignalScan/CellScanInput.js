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

import type {CellScanData} from '@fbcmobile/ui/Components/Views/CellScanResults';

import ActionableItem from '@fbcmobile/ui/Components/ActionableItem';
import Button from '@fbcmobile/ui/Components/Core/Button';
import CellScanResults from '@fbcmobile/ui/Components/Views/CellScanResults';
import Collapsible from 'react-native-collapsible';
import Geolocation from 'react-native-geolocation-service';
import React, {useState} from 'react';
import Spinner from 'react-native-spinkit';
import Text from '@fbcmobile/ui/Components/Core/Text';
import UserActionLogger from '@fbcmobile/ui/Logging/UserActionLogger';
import fbt from 'fbt';
import getOperator from 'mcc-mnc-list-js';
import usePermissions from '@fbcmobile/ui/Hooks/usePermissions';
import {CellScanModule} from '@fbcmobile/signalscan';
import {Colors} from '@fbcmobile/ui/Theme';
import {ERROR, METRIC} from '@fbcmobile/ui/Logging/UserActionEvents';
import {Icon} from 'react-native-material-ui';
import {
  LOCATION_MAXIMUM_AGE_MS,
  LOCATION_REQUEST_TIMEOUT_MS,
} from '@fbcmobile/ui/Components/FormInput/SignalScan/Constants';
import {PermissionsAndroid, View} from 'react-native';

type Props = {
  +cellData?: ?$ReadOnlyArray<CellScanData>,
  +onCellScanned: (cellData: Array<CellScanData>) => void,
};

const CellScanInput = (props: Props) => {
  const {cellData, onCellScanned} = props;
  const [scanResults, setScanResults] = useState<?Array<CellScanData>>(
    cellData ? [].concat(cellData.filter(n => n)) : null,
  );
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const {permissionsGranted} = usePermissions([
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
  ]);

  const _handleResults = (results, position) => {
    const validResults = Object.keys(results).map(index => {
      const cell: CellScanData = results[index];
      let operator = 'unknown';
      let operators = getOperator(
        cell.mobileCountryCode,
        cell.mobileNetworkCode,
      );
      if (operators != null && operators.length > 0) {
        operator = operators[0].operator;
      } else {
        operators = getOperator(
          cell.mobileCountryCode,
          '0' + (cell.mobileNetworkCode ?? ''), // try adding a '0' prefix to the MNC
        );
        if (operators != null && operators.length > 0) {
          operator = operators[0].operator;
        } else {
          operators = getOperator(
            cell.mobileCountryCode,
            '00' + (cell.mobileNetworkCode ?? ''), // try adding a '00' prefix to the MNC
          );
          if (operators != null && operators.length > 0) {
            operator = operators[0].operator;
          }
        }
      }
      return {
        networkType: cell.networkType,
        signalStrength: cell.signalStrength,
        timestamp: cell.timestamp,
        baseStationID: cell.baseStationID,
        networkID: cell.networkID,
        systemID: cell.systemID,
        cellID: cell.cellID,
        locationAreaCode: cell.locationAreaCode,
        mobileCountryCode: cell.mobileCountryCode,
        mobileNetworkCode: cell.mobileNetworkCode,
        primaryScramblingCode: cell.primaryScramblingCode,
        operator: operator,
        arfcn: cell.arfcn,
        physicalCellID: cell.physicalCellID,
        trackingAreaCode: cell.trackingAreaCode,
        timingAdvance: cell.timingAdvance,
        earfcn: cell.earfcn,
        uarfcn: cell.uarfcn,
        latitude: position?.coords.latitude || 0,
        longitude: position?.coords.longitude || 0,
      };
    });
    setScanResults(validResults);
    setIsScanning(false);
    onCellScanned(validResults);
  };

  const scan = async () => {
    setScanResults(null);
    setCollapsed(true);
    setIsScanning(true);
    const results = await CellScanModule.getCellScanResults();
    if (CellScanModule.ERROR_KEY in results) {
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
        <View>
          <ActionableItem
            title={fbt(
              'Cellular networks',
              'Label for the number of cellular networks available',
            ).toString()}
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
          {permissionsGranted === false && (
            <Text>
              <fbt desc="Text explaining why a permission is needed.">
                Allow the app to access this phone's location and read phone
                state in order to scan cellular networks.
              </fbt>
            </Text>
          )}
        </View>
      ) : (
        <View>
          <ActionableItem
            title={fbt(
              fbt.plural('cellular network found', scanResults.length, {
                showCount: 'yes',
                many: 'cellular networks found',
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
            <CellScanResults scanResults={scanResults} />
            <View style={styles.rescanContainer}>
              <Button variant="secondary" onPress={scan}>
                <fbt desc="Button text that repeats a completed cell signal scan">
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

export default CellScanInput;
