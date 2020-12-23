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

import InvalidTextView from '@fbcmobile/ui/Components/FormInput/InvalidTextView';
import React, {useEffect, useState} from 'react';
import Text from '@fbcmobile/ui/Components/Core/Text';
import fbt from 'fbt';
import {Divider} from 'react-native-material-ui';
import {Fonts} from '@fbcmobile/ui/Theme';
import {TextInput, View} from 'react-native';

export type InputType = 'TEXT' | 'EMAIL' | 'PHONE';

type Props = {
  +value: ?string,
  +placeholder?: string,
  +autoFocus?: boolean,
  +onFocus?: () => void,
  +onChangeText?: (value: ?string, type: InputType) => void,
  +isValid?: (valid: boolean) => void,
  +multiline?: boolean,
  +numberOfLines?: number,
  +editable?: boolean,
  +unit?: string,
  +divider?: boolean,
  +inputType?: InputType,
};

const TextFormInput = (
  {inputType = 'TEXT', ...props}: Props,
  inputRef: ?React$ElementRef<typeof TextInput>,
) => {
  const [isValid, setIsValid] = useState<boolean>(true);
  const [value, setValue] = useState<?string>(props.value);

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  const validate = () => {
    switch (true) {
      case inputType === 'EMAIL':
        setIsValid(isValidEmail());
        break;
      case inputType === 'PHONE':
        setIsValid(isValidPhoneNumber());
        break;
    }
    props.isValid && props.isValid(isValid);
  };

  const isValidEmail = () => {
    if (value != null && value.trim() !== '') {
      // Source: https://tylermcginnis.com/validate-email-address-javascript/
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }
    return true;
  };

  const isValidPhoneNumber = () => {
    if (value != null && value.trim() !== '') {
      // Allowed chars: - + . ( )
      // Examples:
      // 1-800-000-0000
      // 1.800.000.000
      // 18000000000
      // 1 (800) 000-0000
      // +1 800 000 0000
      return /^\d{10,14}$/.test(value.replace(/[\s()+\-\.]|ext/gi, ''));
    }
    return true;
  };

  const getInvalidText = () => {
    switch (true) {
      case inputType === 'EMAIL':
        return fbt(
          'Invalid email address',
          'Error text in email field',
        ).toString();
      case inputType === 'PHONE':
        return fbt(
          'Invalid phone number',
          'Error text in phone number field',
        ).toString();
    }
    return '';
  };

  const keyboardType = () => {
    switch (true) {
      case inputType === 'EMAIL':
        return 'email-address';
      case inputType === 'PHONE':
        return 'phone-pad';
      case inputType === 'TEXT':
      default:
        return 'default';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          value={value}
          style={styles.textInput}
          autoFocus={props.autoFocus}
          autoCorrect={inputType == null}
          spellCheck={inputType == null}
          placeholder={props.placeholder}
          multiline={props.numberOfLines == null ? props.multiline : true}
          numberOfLines={props.numberOfLines}
          onChangeText={text => {
            props.onChangeText && props.onChangeText(text, inputType);
            setValue(text);
          }}
          onFocus={props.onFocus}
          keyboardType={keyboardType()}
          onBlur={_ => validate()}
          ref={inputRef}
        />
        {props.unit != null && (
          <Text variant="h6" color="gray" style={styles.unitText}>
            {props.unit}
          </Text>
        )}
      </View>
      {(props.divider || !isValid) && <Divider style={styles.divider} />}
      <InvalidTextView text={getInvalidText()} visible={!isValid} />
    </View>
  );
};

const styles = {
  container: {
    display: 'flex',
  },
  inputContainer: {
    flexDirection: 'row',
  },
  textInput: {
    flex: 3,
    padding: 0,
    textAlignVertical: 'top',
    fontSize: Fonts.size.h2,
  },
  unitText: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  divider: {
    container: {
      height: 1.5,
      marginTop: 10,
    },
  },
};

export default React.forwardRef<Props, React$ElementRef<typeof TextInput>>(
  TextFormInput,
);
