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
import {
  Animated,
  Easing,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {Colors} from '@fbcmobile/ui/Theme';
import {Icon} from 'react-native-material-ui';
import {useLayoutEffect, useRef, useState} from 'react';

type Props = {
  +checked: boolean,
  +onPress?: () => void,
};

const Switch = ({checked, onPress}: Props) => {
  const [anim] = useState(new Animated.Value(checked === true ? 1 : 0));
  const animatedContainerStyle = useRef(AnimatedStyles.containerStyle(anim))
    .current;
  const animatedLeverStyle = useRef(AnimatedStyles.leverStyle(anim)).current;

  useLayoutEffect(() => {
    Animated.timing(
      anim,
      AnimatedStyles.animate(checked === true ? 1 : 0),
    ).start();
  }, [anim, checked]);

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View>
        <Animated.View
          style={[styles.containerStyle, animatedContainerStyle]}
        />
        <Animated.View style={[styles.leverStyle, animatedLeverStyle]}>
          {checked && (
            <Icon
              name="check"
              iconSet="MaterialIcons"
              color={Colors.Blue}
              size={12}
            />
          )}
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const outputRange: Array<string> = [Colors.DisabledText, Colors.Blue];
const leverOutputRange: Array<number> = [0, 14];

const AnimatedStyles = {
  containerStyle(anim) {
    return {
      backgroundColor: anim.interpolate({
        inputRange: [0, 1],
        outputRange: outputRange,
        extrapolate: 'clamp',
      }),
    };
  },
  leverStyle(anim) {
    return {
      transform: [
        {
          translateX: anim.interpolate({
            inputRange: [0, 1],
            outputRange: leverOutputRange,
            extrapolate: 'clamp',
          }),
        },
      ],
    };
  },
  animate(toValue) {
    return {
      toValue,
      duration: 150,
      easing: Easing.linear,
      useNativeDriver: false,
    };
  },
};

const styles = StyleSheet.create({
  leverStyle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.White,
    height: 20,
    width: 20,
    borderRadius: 20,
    position: 'absolute',
    top: 1,
    left: 1,
  },
  containerStyle: {
    width: 36,
    height: 22,
    borderRadius: 11,
    padding: 1,
    backgroundColor: Colors.DisabledText,
  },
});

export default Switch;
