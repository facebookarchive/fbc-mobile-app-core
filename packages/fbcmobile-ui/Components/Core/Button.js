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

import type {ViewStyleProp} from 'react-native/Libraries/StyleSheet/StyleSheet';

import * as React from 'react';
import Text from '@fbcmobile/ui/Components/Core/Text';
import {Colors} from '@fbcmobile/ui/Theme';
import {StyleSheet, TouchableOpacity} from 'react-native';

type ButtonVariant = 'primary' | 'plain' | 'secondary' | 'text' | 'warning';
type TextAlign = 'left' | 'center';

type Props = {
  +children: React.Node,
  +variant?: ButtonVariant,
  +textAlign?: TextAlign,
  +fontSize?: number,
  +onPress?: void | (() => void | Promise<void>),
  +disabled?: boolean,
  +style?: ViewStyleProp,
  +rightIcon?: React.Node,
};

const Button = ({
  children,
  onPress,
  disabled = false,
  variant = 'primary',
  style,
  textAlign = 'center',
  fontSize = 16,
  rightIcon,
}: Props) => {
  return (
    <TouchableOpacity
      style={StyleSheet.compose(
        [
          styles.root,
          styles[`${variant}Variant`],
          disabled ? styles[`${variant}Disabled`] : null,
        ],
        style,
      )}
      onPress={onPress}
      disabled={disabled}>
      <Text
        variant="h3"
        weight="bold"
        style={[
          styles.text,
          styles[`${variant}Text`],
          {fontSize: fontSize},
          disabled
            ? variant === 'text'
              ? styles.disabledTextVariant
              : styles.disabledText
            : null,
          styles[`${textAlign}TextAlign`],
        ]}>
        {children}
      </Text>
      {rightIcon}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  root: {
    paddingVertical: 10.5,
    paddingHorizontal: 12,
    borderRadius: 4,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  primaryVariant: {
    backgroundColor: Colors.Blue,
  },
  primaryDisabled: {
    backgroundColor: Colors.DisabledBackground,
  },
  secondaryVariant: {
    backgroundColor: Colors.BlueLight,
  },
  secondaryDisabled: {
    backgroundColor: Colors.DisabledBackground,
  },
  plainVariant: {
    backgroundColor: Colors.White,
    borderWidth: 1,
    borderColor: Colors.BlueGray,
  },
  plainDisabled: {
    backgroundColor: Colors.White,
    borderColor: Colors.DisabledText,
  },
  warningVariant: {
    backgroundColor: Colors.RedBackground,
  },
  warningDisabled: {
    backgroundColor: Colors.DisabledBackground,
  },
  textText: {
    color: Colors.Blue,
  },
  disabledTextVariant: {
    color: Colors.BlueTransparent,
  },
  disabledText: {
    color: Colors.DisabledText,
  },
  primaryText: {
    color: Colors.White,
  },
  secondaryText: {
    color: Colors.Blue,
  },
  plainText: {
    color: Colors.BlueGray,
  },
  warningText: {
    color: Colors.BrightRed,
  },
  leftTextAlign: {
    textAlign: 'left',
  },
  centerTextAlign: {
    textAlign: 'center',
  },
  text: {
    display: 'flex',
    flexGrow: 1,
    flexShrink: 1,
  },
});

export default Button;
