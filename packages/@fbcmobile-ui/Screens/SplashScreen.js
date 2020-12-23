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
import Spinner from 'react-native-spinkit';
import Text from '@fbcmobile/ui/Components/Core/Text';
import {ApplicationStyles, Colors} from '@fbcmobile/ui/Theme';
import {StyleSheet, View} from 'react-native';

type Props = {
  +text?: ?React.Node,
};

const SplashScreen = (props: Props) => {
  const {text} = props;

  return (
    <View style={styles.container}>
      {text != null && (
        <Text style={styles.textStyle} variant="h6">
          {text}
        </Text>
      )}
      <Spinner size={40} color={Colors.Blue} type={'ThreeBounce'} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...ApplicationStyles.screen.container,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyle: {
    textAlign: 'center',
  },
});

export default SplashScreen;
