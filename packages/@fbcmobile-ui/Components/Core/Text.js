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

import type {TextProps} from 'react-native/Libraries/Text/TextProps';
import type {TextStyleProp} from 'react-native/Libraries/StyleSheet/StyleSheet';

import * as React from 'react';
import {Colors, Fonts} from '@fbcmobile/ui/Theme';
import {Text as RNText, StyleSheet} from 'react-native';

export type Color =
  | 'light'
  | 'regular'
  | 'primary'
  | 'gray'
  | 'disabled'
  | 'red'
  | 'deleteRed'
  | 'lightGray';
export type TextVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'h7'
  | 'h8'
  | 'h9';
export type Weight = 'bold' | 'medium' | 'regular' | 'light';
export type TextAlign = 'left' | 'right' | 'center';

type Props = {|
  +children: ?React.Node,
  +variant?: TextVariant,
  +style?: TextStyleProp,
  +color?: Color,
  +weight?: Weight,
  +align?: TextAlign,
  ...TextProps,
|};

const Text = ({
  children,
  style,
  color,
  variant = 'h3',
  align = 'left',
  weight,
  ...rest
}: Props) => {
  return (
    <RNText
      style={StyleSheet.compose(
        [
          styles[variant],
          color ? styles[`${color}Color`] : null,
          weight ? styles[`${weight}Weight`] : null,
          align ? styles[`${align}Align`] : null,
        ],
        style,
      )}
      {...rest}>
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  ...Fonts.style,
  lightColor: {
    color: Colors.White,
  },
  regularColor: {
    color: Colors.BlueGray,
  },
  primaryColor: {
    color: Colors.Blue,
  },
  grayColor: {
    color: Colors.Gray90,
  },
  lightGrayColor: {
    color: Colors.Gray75,
  },
  disabledColor: {
    color: Colors.DisabledText,
  },
  redColor: {
    color: Colors.BrightRed,
  },
  deleteRedColor: {
    color: Colors.DeleteRed,
  },
  lightWeight: {
    fontFamily: 'Roboto-Light',
  },
  regularWeight: {
    fontFamily: 'Roboto-Regular',
  },
  mediumWeight: {
    fontFamily: 'Roboto-Medium',
    fontWeight: '500',
  },
  boldWeight: {
    fontFamily: 'Roboto-Bold',
  },
  leftAlign: {
    textAlign: 'left',
  },
  centerAlign: {
    textAlign: 'center',
  },
  rightAlign: {
    textAlign: 'right',
  },
});

export default Text;
