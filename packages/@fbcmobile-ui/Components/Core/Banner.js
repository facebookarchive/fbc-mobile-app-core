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
import {Animated, Easing, StyleSheet} from 'react-native';
import {Colors} from '@fbcmobile/ui/Theme';
import {useEffect, useState} from 'react';

const BANNER_HEIGHT = 54;
const BANNER_DEFAULT_TIMEOUT_MS = 3000;

type Props = {
  +message: React.Node,
  +timeoutMs?: number,
  +skin?: 'dark' | 'green' | 'red',
};

const Banner = ({
  message,
  timeoutMs = BANNER_DEFAULT_TIMEOUT_MS,
  skin = 'dark',
}: Props) => {
  const [topValue] = useState(new Animated.Value(-BANNER_HEIGHT * 3));
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      Animated.timing(topValue, {
        toValue: -BANNER_HEIGHT * 3,
        friction: 1,
        easing: Easing.ease,
        useNativeDriver: false,
      }).start();
    }, timeoutMs);
    return () => clearTimeout(timeoutId);
  });
  useEffect(() => {
    Animated.timing(topValue, {
      toValue: 0,
      friction: 1,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
  }, [topValue]);

  return (
    <Animated.View
      style={[
        styles.root,
        styles[`${skin}Skin`],
        {
          top: topValue,
        },
      ]}>
      <Text
        variant="h6"
        color={skin === 'red' ? 'red' : 'light'}
        align="center">
        {message}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingVertical: 17,
    paddingHorizontal: 16,
  },
  darkSkin: {
    backgroundColor: Colors.BlueGray,
  },
  greenSkin: {
    backgroundColor: Colors.Green,
  },
  redSkin: {
    backgroundColor: Colors.RedBackground,
  },
});

export default Banner;
