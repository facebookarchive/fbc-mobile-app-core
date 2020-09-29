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
import Button from '@fbcmobile/ui/Components/Core/Button';
import Divider from '@fbcmobile/ui/Components/Core/Divider';
import Text from '@fbcmobile/ui/Components/Core/Text';
import {StyleSheet, TouchableOpacity, View} from 'react-native';

type Props = {
  +cancelLabel?: React.Node,
  +okLabel: React.Node,
  +onCancelPressed?: () => void,
  +onOkPressed: () => void | Promise<void>,
  +isOkDisabled?: boolean,
  +showDivider?: boolean,
  +style?: ViewStyleProp,
};

const ModalActions = ({
  cancelLabel,
  okLabel,
  onCancelPressed,
  onOkPressed,
  isOkDisabled = false,
  showDivider,
  style,
}: Props) => {
  return (
    <View style={style}>
      {showDivider ? <Divider /> : null}
      <View style={styles.buttonsContainer}>
        {cancelLabel != null ? (
          <View style={styles.cancelButton}>
            <TouchableOpacity style={styles.link} onPress={onCancelPressed}>
              <Text color="primary" weight="bold">
                {cancelLabel}
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
        <View style={styles.gap} />
        <View style={styles.okButton}>
          <Button
            variant="primary"
            onPress={onOkPressed}
            disabled={isOkDisabled}>
            {okLabel}
          </Button>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonsContainer: {
    display: 'flex',
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  gap: {
    flexGrow: 1,
  },
  cancelButton: {
    alignSelf: 'flex-start',
  },
  okButton: {
    alignSelf: 'flex-end',
  },
  link: {
    paddingVertical: 10.5,
    paddingHorizontal: 19,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default ModalActions;
