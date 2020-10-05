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

import NavigationService from '@fbcmobile/ui/Services/NavigationService';
import React from 'react';
import fbt from 'fbt';
import {Fonts} from '@fbcmobile/ui/Theme';
import {TextInput, View} from 'react-native';
import {isStrictNumber} from '@fbcmobile/ui/Utils/StringUtils';

export type NumberInputType = 'FLOAT' | 'INTEGER';

type Props = {
  +value: ?number,
  +inputType: NumberInputType,
  +onChangeNumber?: (value: ?number, type: NumberInputType) => void,
};

const NumberInput = (props: Props) => {
  const {value, inputType, onChangeNumber} = props;

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          value={value?.toString()}
          style={styles.textInput}
          keyboardType={inputType === 'INTEGER' ? 'number-pad' : 'decimal-pad'}
          onChangeText={text => {
            if (inputType === 'INTEGER' && !isStrictNumber(text)) {
              NavigationService.alert(
                'error',
                fbt(
                  'Integer Type Error',
                  'A value with a type different than Integer was set',
                ),
                fbt(
                  'Only digits are allowed in the Integer field.',
                  'Error message that appears when the user inputs a non-digit value in the integer field.',
                ),
              );
              onChangeNumber && onChangeNumber(props.value, inputType);
            } else {
              onChangeNumber && onChangeNumber(parseInt(text), inputType);
            }
          }}
        />
      </View>
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
    padding: 0,
    fontSize: Fonts.size.h2,
  },
};

export default NumberInput;
