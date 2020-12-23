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

import type {ImagePickerResponse} from 'react-native-image-crop-picker';
import type {PhotoResponse} from '@fbcmobile/ui/Components/FormInput/PhotoPicker/PhotoPicker';
import type {ViewStyleProp} from 'react-native/Libraries/StyleSheet/StyleSheet';

import Button from '@fbcmobile/ui/Components/Core/Button';
import FormInput from '@fbcmobile/ui/Components/FormInput/FormInput';
import ImagePicker from 'react-native-image-crop-picker';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';
import ModalContent from '@fbcmobile/ui/Components/Core/Modal/ModalContent';
import ModalHeader from '@fbcmobile/ui/Components/Core/Modal/ModalHeader';
import NavigationService from '@fbcmobile/ui/Services/NavigationService';
import PhotoPicker from '@fbcmobile/ui/Components/FormInput/PhotoPicker/PhotoPicker';
import React, {useState} from 'react';
import Text from '@fbcmobile/ui/Components/Core/Text';
import UserActionLogger from '@fbcmobile/ui/Logging/UserActionLogger';
import fbt from 'fbt';
import {Colors} from '@fbcmobile/ui/Theme';
import {ERROR} from '@fbcmobile/ui/Logging/UserActionEvents';
import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';

const MAX_NUMBER_OF_PHOTOS = 5;

const IMAGE_PICKER_PROPS = {
  compressImageMaxWidth: 1024,
  compressImageMaxHeight: 1024,
  cropping: false,
  includeBase64: true,
  includeExif: true,
  freeStyleCropEnabled: true,
  cropping: true,
  mediaType: 'photo',
};

export type CarouselData = {
  key?: string,
  fileName: string,
  mimeType?: ?string,
  fileSize?: ?number,
  uri: string,
  timestamp?: ?number,
  annotation?: ?string,
};

type Props = {
  +title: string,
  +description?: ?string,
  +data?: ?Array<CarouselData>,
  +disableLibrarySelection?: boolean,
  +hasError: boolean,
  +style?: ViewStyleProp,
  +onAdded?: (
    imagesData: Array<CarouselData>,
    addedImage: CarouselData,
  ) => void,
  +onDeleted?: (
    imagesData: Array<CarouselData>,
    deletedImage: CarouselData,
  ) => void,
  +onAddCaption?: (
    imagesData: Array<CarouselData>,
    image: CarouselData,
    caption: ?string,
  ) => void,
};

function getRandomString(): string {
  return (
    Math.random()
      .toString(36)
      .substring(2, 15) +
    Math.random()
      .toString(36)
      .substring(2, 15)
  );
}

const PhotoCarousel = (props: Props) => {
  const [carouselData, setCarouselData] = useState<Array<CarouselData>>(
    props.data
      ? props.data
          .slice(0, MAX_NUMBER_OF_PHOTOS)
          .filter(Boolean)
          .map(data => ({key: getRandomString(), ...data}))
      : [],
  );
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const parsePickerResponse = (image: ImagePickerResponse): CarouselData => {
    const key = getRandomString();
    return {
      key: key,
      fileName: image.path,
      mimeType: image.mime,
      fileSize: image.size,
      uri: image.path,
      timestamp: parseInt(image.modificationDate),
    };
  };

  const onButtonPress = () => {
    if (carouselData && carouselData.length === MAX_NUMBER_OF_PHOTOS) {
      NavigationService.alert(
        'info',
        fbt('Info', 'Max. photos count reached'),
        fbt(
          'You have reached the maximum photos allowed.',
          'Warning message that appears when the user has added the max number of photos.',
        ),
      );
      return;
    }
    setIsDialogOpen(true);
  };

  const processImage = (image: ?ImagePickerResponse): void => {
    if (image) {
      const carouselItem = parsePickerResponse(image);
      onPhotoSelect(carouselItem, carouselItem.key);
    }
  };

  const openPhotoLibrary = () => {
    setIsDialogOpen(false);
    ImagePicker.openPicker(IMAGE_PICKER_PROPS)
      .then(processImage)
      .catch(error => {
        UserActionLogger.logError({
          key: ERROR.ERROR_PICKING_PHOTO,
          errorMessage: error,
        });
      });
  };

  const openCamera = () => {
    setIsDialogOpen(false);
    ImagePicker.openCamera(IMAGE_PICKER_PROPS)
      .then(processImage)
      .catch(error => {
        UserActionLogger.logError({
          key: ERROR.ERROR_TAKING_PHOTO,
          errorMessage: error,
        });
      });
  };

  /**
   * If photoData == null, the photo will be deleted from the carousel
   */
  const onPhotoSelect = (photoData: ?CarouselData, key: ?string): void => {
    let newData;
    if (photoData == null) {
      const itemIndex = carouselData.findIndex(item => item.key === key);
      const itemToRemove = carouselData.splice(itemIndex, 1)[0];
      newData = [...carouselData];

      const onDeleted = props.onDeleted;
      onDeleted && onDeleted(newData, itemToRemove);
    } else {
      newData = [...carouselData, photoData];

      const onAdded = props.onAdded;
      onAdded && onAdded(newData, photoData);
    }

    setCarouselData(newData);
  };

  const onAddCaption = (key: ?string, annotation: ?string): void => {
    const newData = [...carouselData];
    const itemIndex = newData.findIndex(item => item.key === key);
    newData[itemIndex].annotation = annotation;
    props.onAddCaption &&
      props.onAddCaption(newData, newData[itemIndex], annotation);
    setCarouselData(newData);
  };

  return (
    <View style={StyleSheet.compose(styles.listContainer, props.style)}>
      <FormInput
        title={props.title}
        description={props.description}
        placement="right"
        hasError={props.hasError}>
        <Button variant="secondary" onPress={onButtonPress}>
          <fbt desc="Text of a button that uploads images">Upload</fbt>
        </Button>
        <Modal
          isVisible={isDialogOpen}
          backdropOpacity={0.6}
          propagateSwipe={true}>
          <View style={[styles.modal, {height: 200}]}>
            <ModalHeader
              style={styles.modalHeader}
              title={fbt(
                'Upload Media',
                'Title of dialog that shows the options for adding a photo.',
              ).toString()}
              onClosePressed={() => setIsDialogOpen(false)}
            />
            <ModalContent style={styles.modalContent}>
              <View style={styles.mainContainer}>
                <TouchableOpacity
                  style={styles.itemContainer}
                  onPress={openCamera}>
                  <MCIcon name="camera" size={25} color={Colors.Black} />
                  <Text weight="regular" style={styles.itemText}>
                    <fbt desc="Dialog action for taking a photo">
                      Take a photo
                    </fbt>
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.itemContainer}
                  onPress={openPhotoLibrary}>
                  <MCIcon name="image" size={25} color={Colors.Black} />
                  <Text weight="regular" style={styles.itemText}>
                    <fbt desc="Dialog action for choosing a photo from the gallery">
                      Choose from gallery
                    </fbt>
                  </Text>
                </TouchableOpacity>
              </View>
            </ModalContent>
          </View>
        </Modal>
      </FormInput>
      {carouselData && carouselData.length > 0 ? (
        <FlatList
          style={styles.list}
          data={carouselData}
          renderItem={({item}) => (
            <PhotoPicker
              style={styles.listItem}
              photoData={item.uri}
              annotation={item.annotation}
              onSelect={(photoData: ?PhotoResponse) => {
                // We only show PhotoPicker when a user selects an image.
                // This will only be triggered by the user deleting an image.
                if (photoData == null) {
                  onPhotoSelect(null, item.key);
                } else {
                  console.warn(
                    'PhotoCarousel',
                    'User selected an image in PhotoPicker',
                  );
                }
              }}
              addCaption={(annotation: ?string) => {
                onAddCaption(item.key, annotation);
              }}
              disableLibrarySelection={props.disableLibrarySelection}
            />
          )}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
  },
  description: {
    color: Colors.Gray70,
  },
  list: {
    marginTop: 20,
  },
  listItem: {
    marginRight: 10,
  },
  modal: {
    display: 'flex',
    backgroundColor: 'white',
    borderRadius: 4,
  },
  modalHeader: {
    paddingVertical: 20,
  },
  modalContent: {
    flex: 1,
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
    paddingBottom: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    marginLeft: 10,
  },
});

PhotoCarousel.defaultProps = {
  disableLibrarySelection: false,
};

export default PhotoCarousel;
