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
import {Image, StyleSheet, View} from 'react-native';

type Props = {|
  +photoData: string,
  +caption?: ?string,
|};

const PhotoTile = ({photoData, caption}: Props) => {
  return (
    <View style={styles.photoContainer}>
      <Image style={styles.photo} source={{uri: photoData}} />
      <Text style={styles.caption} ellipsizeMode="tail" numberOfLines={1}>
        {caption}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  photoContainer: {
    width: 150,
    height: 100,
    borderRadius: 8,
    backgroundColor: Colors.Gray10,
  },
  photo: {
    flex: 1,
    borderRadius: 8,
  },
  caption: {
    textAlign: 'center',
    fontSize: 12,
  },
});

export default PhotoTile;
