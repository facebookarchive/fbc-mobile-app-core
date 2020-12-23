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

import React from 'react';
import Text from '@fbcmobile/ui/Components/Core/Text';
import fbt from 'fbt';
import {Colors} from '@fbcmobile/ui/Theme';
import {StyleSheet, View} from 'react-native';
import {useNetInfo} from '@react-native-community/netinfo';

const OfflineBanner = () => {
  const netInfo = useNetInfo();

  return (
    <>
      {netInfo.isConnected ? null : (
        <View style={styles.root}>
          <Text color={'regular'} style={styles.text}>
            <fbt desc="Text saying the device has no connectivity so it is using cached data">
              No Connectivity - using cached data
            </fbt>
          </Text>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  root: {
    top: 0,
    left: 0,
    right: 0,
    paddingVertical: 5,
    backgroundColor: Colors.Gray85,
  },
  text: {
    marginLeft: 10,
    textAlign: 'center',
  },
});
export default OfflineBanner;
