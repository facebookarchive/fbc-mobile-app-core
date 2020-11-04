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
import type {ViewStyleProp} from 'react-native/Libraries/StyleSheet/StyleSheet';

import BottomSheet from '@fbcmobile/ui/Components/Core/BottomSheet';
import BottomSheetContent from '@fbcmobile/ui/Components/FormInput/PhotoPicker/BottomSheetContent';
import ImagePicker from 'react-native-image-crop-picker';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';
import ModalActions from '@fbcmobile/ui/Components/Core/Modal/ModalActions';
import ModalContent from '@fbcmobile/ui/Components/Core/Modal/ModalContent';
import ModalHeader from '@fbcmobile/ui/Components/Core/Modal/ModalHeader';
import React, {useState} from 'react';
import Text from '@fbcmobile/ui/Components/Core/Text';
import UserActionLogger from '@fbcmobile/ui/Logging/UserActionLogger';
import fbt from 'fbt';
import {Colors} from '@fbcmobile/ui/Theme';
import {ERROR} from '@fbcmobile/ui/Logging/UserActionEvents';
import {Image, StyleSheet, TextInput, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

export type PhotoResponse = {
  data?: string,
  width?: number,
  height?: number,
  fileSize?: number,
  mimeType?: string,
  fileName: string,
  timestamp?: number,
  uri: string,
  annotation?: ?string,
};

type Props = {
  +title?: string,
  +description?: ?string,
  +photoData?: ?string,
  +style?: ViewStyleProp,
  +disableLibrarySelection?: boolean,
  +onSelect?: (photoData: ?PhotoResponse) => void,
  +annotation?: ?string,
  +addCaption?: (annotation: ?string) => void,
  +showPreview?: boolean,
};

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

const PhotoPicker = ({showPreview = true, ...props}: Props) => {
  const [bottomSheetVisible, setBottomSheetVisible] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [photoData, setPhotoData] = useState<?string>(props.photoData);
  const [addCaptionVisible, setAddCaptionVisible] = useState<boolean>(false);
  const [caption, setCaption] = useState<?string>(props.annotation);

  const getPhotoResponse = (image: ImagePickerResponse): PhotoResponse => {
    const photoResponse: PhotoResponse = {
      data: image.data,
      width: image.width,
      height: image.height,
      fileSize: image.size,
      mimeType: image.mime,
      fileName: image.path,
      timestamp: parseInt(image.modificationDate),
      uri: image.path,
    };

    return photoResponse;
  };

  const processImage = (image: ImagePickerResponse): void => {
    if (image) {
      const photoData = `data:${image.mime};base64,${image.data}`;
      setPhotoData(photoData);
      const onSelect = props.onSelect;
      onSelect && onSelect(getPhotoResponse(image));
    }
  };

  const openPhotoLibrary = () => {
    setBottomSheetVisible(false);
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
    setBottomSheetVisible(false);
    ImagePicker.openCamera(IMAGE_PICKER_PROPS)
      .then(processImage)
      .catch(error => {
        UserActionLogger.logError({
          key: ERROR.ERROR_TAKING_PHOTO,
          errorMessage: error,
        });
      });
  };

  return (
    <View style={styles.container}>
      {photoData && showPreview ? (
        <TouchableOpacity
          style={StyleSheet.compose(styles.photoContainer, props.style)}>
          <Image style={styles.photo} source={{uri: photoData}} />
          <Text style={styles.caption} ellipsizeMode="tail" numberOfLines={1}>
            {caption}
          </Text>
          <MCIcon
            name="close"
            size={20}
            color={Colors.White}
            style={styles.removeButton}
            onPress={() => {
              setIsDialogOpen(true);
            }}
          />
          <MCIcon
            name="lead-pencil"
            size={20}
            color={Colors.White}
            style={styles.annotationButton}
            onPress={() => {
              setAddCaptionVisible(true);
            }}
          />
          <Modal
            isVisible={isDialogOpen}
            backdropOpacity={0.6}
            propagateSwipe={true}>
            <View style={styles.modal}>
              <ModalHeader
                style={styles.modalHeader}
                showCloseButton={false}
                title={fbt(
                  'Delete Photo?',
                  'Title of dialog that asks the user before deleting a photo.',
                ).toString()}
                onClosePressed={() => setIsDialogOpen(false)}
              />
              <ModalContent style={styles.modalContent}>
                <View style={styles.container}>
                  <Text weight="regular">
                    <fbt desc="Text that warns the user deleting a photo cannot be undone.">
                      Are you sure you want to delete this file? This action
                      cannot be undone.
                    </fbt>
                  </Text>
                </View>
              </ModalContent>
              <ModalActions
                style={styles.modalFooter}
                cancelLabel={`${fbt('Cancel', 'Cancel button label')}`}
                okLabel={`${fbt('Delete', 'Delete button label')}`}
                onCancelPressed={() => setIsDialogOpen(false)}
                onOkPressed={() => {
                  setPhotoData(null);
                  props.onSelect && props.onSelect(null);
                  setIsDialogOpen(false);
                }}
              />
            </View>
          </Modal>

          <Modal
            isVisible={addCaptionVisible}
            backdropOpacity={0.6}
            propagateSwipe={true}>
            <View style={styles.modal}>
              <ModalHeader
                title={fbt(
                  'Photo caption',
                  'Title of dialog that allows the user to add a photo caption',
                ).toString()}
                showCloseButton={false}
                onClosePressed={() => setAddCaptionVisible(false)}
              />
              <ModalContent>
                <View style={styles.captionContainer}>
                  <TouchableOpacity
                    style={StyleSheet.compose(
                      styles.photoContainer,
                      props.style,
                    )}>
                    <Image style={styles.photo} source={{uri: photoData}} />
                  </TouchableOpacity>
                  <TextInput
                    multiline
                    placeholder={fbt(
                      'Photo caption',
                      'Placeholder for photo caption',
                    ).toString()}
                    value={caption}
                    onChangeText={text => setCaption(text)}
                  />
                </View>
              </ModalContent>
              <ModalActions
                style={styles.modalFooter}
                cancelLabel={`${fbt('Cancel', 'Cancel button label')}`}
                okLabel={`${fbt('Save', 'Save button label')}`}
                onCancelPressed={() => {
                  setAddCaptionVisible(false);
                }}
                onOkPressed={() => {
                  props.addCaption && props.addCaption(caption);
                  setAddCaptionVisible(false);
                }}
              />
            </View>
          </Modal>
        </TouchableOpacity>
      ) : (
        <View>
          <TouchableOpacity
            style={StyleSheet.compose(styles.emptyPhotoContainer, props.style)}
            onPress={() => setBottomSheetVisible(true)}>
            <MCIcon name="image-plus" size={50} color={Colors.Gray60} />
          </TouchableOpacity>
          <BottomSheet height={150} isOpen={bottomSheetVisible}>
            <BottomSheetContent
              disableLibrarySelection={props.disableLibrarySelection}
              onTakePhotoPressed={openCamera}
              onChooseFromGalleryPressed={openPhotoLibrary}
              onClose={() => setBottomSheetVisible(false)}
            />
          </BottomSheet>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
  },
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
  emptyPhotoContainer: {
    width: 150,
    height: 100,
    borderRadius: 8,
    backgroundColor: Colors.Gray10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButton: {
    position: 'absolute',
    right: 5,
    top: 5,
    padding: 3,
    backgroundColor: Colors.Gray70,
    borderRadius: 15,
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
  modalFooter: {
    paddingTop: 50,
  },
  annotationButton: {
    position: 'absolute',
    left: 5,
    top: 5,
    padding: 3,
    backgroundColor: Colors.Gray70,
    borderRadius: 15,
  },
  caption: {textAlign: 'center', fontSize: 12},
  captionContainer: {alignItems: 'center'},
});

PhotoPicker.defaultProps = {
  disableLibrarySelection: false,
};

export default PhotoPicker;
