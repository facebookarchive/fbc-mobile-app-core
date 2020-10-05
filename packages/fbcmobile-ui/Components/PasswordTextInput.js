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

import React, {useState} from 'react';
import fbt from 'fbt';
import {ApplicationStyles} from '@fbcmobile/ui/Theme';
import {
  I18nManager,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Icon} from 'react-native-material-ui';

export type Props = {
  +onChangeText: (password: string) => void,
};

const PasswordTextInput = (props: Props) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  return (
    <View style={styles.passwordContainer}>
      <TextInput
        style={ApplicationStyles.textInput}
        placeholder={fbt(
          'Password',
          'Form field placeholder on a login screen',
        ).toString()}
        autoCompleteType="password"
        secureTextEntry={!isPasswordVisible}
        onChangeText={props.onChangeText}
      />
      <TouchableOpacity
        onPress={() => setIsPasswordVisible(!isPasswordVisible)}
        style={[styles.eyeIcon, I18nManager.isRTL ? {left: 7} : {right: 7}]}>
        <Icon
          name={isPasswordVisible ? 'visibility' : 'visibility-off'}
          iconSet="MaterialIcons"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  passwordContainer: {
    position: 'relative',
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  eyeIcon: {
    position: 'absolute',
    height: 40,
    width: 40,
    padding: 5,
  },
});

export default PasswordTextInput;
