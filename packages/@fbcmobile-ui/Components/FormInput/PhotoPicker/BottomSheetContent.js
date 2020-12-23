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
import Colors from '@fbcmobile/ui/Theme/Colors';
import Divider from '@fbcmobile/ui/Components/Core/Divider';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Text from '@fbcmobile/ui/Components/Core/Text';
import fbt from 'fbt';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';

type Props = {|
  +disableLibrarySelection?: boolean,
  +onTakePhotoPressed: () => void,
  +onChooseFromGalleryPressed?: () => void,
  +onClose: () => void,
|};

const BottomSheetContent = ({
  disableLibrarySelection = false,
  onTakePhotoPressed,
  onChooseFromGalleryPressed,
  onClose,
}: Props) => {
  return (
    <View>
      <View style={styles.titleContainer}>
        <MCIcon
          style={styles.icon}
          name="close"
          size={25}
          color={Colors.Black}
          onPress={() => {
            onClose && onClose();
          }}
        />
        <Text weight="bold" color="regular">
          <fbt desc="Title of dialog that shows the options for adding a photo.">
            Add a photo
          </fbt>
        </Text>
      </View>
      <Divider />
      <ScrollView style={styles.scrollView}>
        <View style={styles.mainContainer}>
          <TouchableOpacity
            style={styles.itemContainer}
            onPress={onTakePhotoPressed}>
            <MCIcon name="camera" size={25} color={Colors.Black} />
            <Text weight="regular" style={styles.itemText}>
              <fbt desc="Dialog action for taking a photo">Take a photo</fbt>
            </Text>
          </TouchableOpacity>
          {disableLibrarySelection == false && (
            <TouchableOpacity
              style={styles.itemContainer}
              onPress={onChooseFromGalleryPressed}>
              <MCIcon name="image" size={25} color={Colors.Black} />
              <Text weight="regular" style={styles.itemText}>
                <fbt desc="Dialog action for choosing a photo from the gallery">
                  Choose from gallery
                </fbt>
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    position: 'absolute',
    left: 10,
  },
  scrollView: {
    marginBottom: 10,
  },
  mainContainer: {
    flexDirection: 'column',
    flexWrap: 'nowrap',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
  },
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    marginLeft: 10,
  },
});

export default BottomSheetContent;
