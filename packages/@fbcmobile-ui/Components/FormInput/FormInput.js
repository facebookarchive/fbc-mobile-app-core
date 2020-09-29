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
import {Colors} from '@fbcmobile/ui/Theme';
import {StyleSheet, TouchableOpacity, View} from 'react-native';

export type Placement = 'below' | 'right';

type Props = {
  +children: React.Node,
  +title: React.Node,
  +description?: React.Node,
  +isMandatory?: boolean,
  +hasError?: boolean,
  +placement?: Placement,
  +touchableDisabled?: boolean,
  +onPress?: () => void,
};

const FormInput = ({
  children,
  title,
  description,
  isMandatory = false,
  hasError = false,
  placement = 'below',
  touchableDisabled = true,
  onPress,
}: Props) => {
  const rootPlacementClass =
    placement === 'right' ? styles.rootRightPlacement : null;
  const headerPlacementClass =
    placement === 'right' ? styles.headerRightPlacement : null;
  return (
    <TouchableOpacity onPress={onPress} disabled={touchableDisabled}>
      <View style={[styles.root, rootPlacementClass]}>
        <View style={[styles.header, headerPlacementClass]}>
          <Text
            variant="h3"
            weight="medium"
            color={hasError ? 'red' : 'regular'}>
            {isMandatory ? (
              <Text color="red" variant="h3" weight="medium">
                *{' '}
              </Text>
            ) : null}
            {title}
          </Text>
          {description != null && (
            <Text style={styles.description} variant="h8">
              {description}
            </Text>
          )}
        </View>
        <View style={styles.content}>{children}</View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  root: {
    display: 'flex',
  },
  rootRightPlacement: {
    flexDirection: 'row',
  },
  description: {
    marginTop: 4,
  },
  header: {
    display: 'flex',
    marginBottom: 10,
    flex: 1,
  },
  asterisk: {
    color: Colors.BrightRed,
  },
  headerRightPlacement: {
    marginBottom: 0,
    marginRight: 8,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
});

export default FormInput;
