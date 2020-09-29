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

import type {ImageURISource} from 'react-native/Libraries/Image/ImageSource';

import Modal from 'react-native-modal';
import React from 'react';
import Text from '@fbcmobile/ui/Components/Core/Text';
import fbt from 'fbt';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';

type Props = {|
  +title: string,
  +image: ImageURISource | number,
  +onPress: () => void,
|};

const NuxModal = ({title, image, onPress}: Props) => {
  return (
    <Modal isVisible={true} backdropOpacity={0.75} propagateSwipe={true}>
      <TouchableOpacity style={styles.root} onPress={onPress}>
        <Text
          style={styles.title}
          variant="h3"
          color="light"
          align="center"
          weight="medium">
          {title}
        </Text>
        <View style={styles.image}>
          <Image source={image} />
        </View>
        <Text variant="h3" color="light" weight="light" align="center">
          <fbt desc="Dismiss message on a popup">Got It</fbt>
        </Text>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  root: {
    height: '100%',
    padding: 23,
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    marginTop: '25%',
    marginBottom: 30,
  },
  image: {
    flexGrow: 1,
  },
});

export default NuxModal;
