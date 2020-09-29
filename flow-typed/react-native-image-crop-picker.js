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
declare module 'react-native-image-crop-picker' {
  declare type ImagePickerResponse = $ReadOnly<{|
    data: string,
    width: number,
    height: number,
    size: number,
    mime: string,
    path: string,
    modificationDate: string,
  |}>;

  declare type ImagePickerProps = $ReadOnly<{|
    compressImageMaxWidth: number,
    compressImageMaxHeight: number,
    cropping: boolean,
    includeBase64: boolean,
    includeExif: boolean,
    freeStyleCropEnabled: boolean,
    cropping: boolean,
    mediaType: string,
  |}>;

  declare function openPicker(props: ImagePickerProps): Promise;

  declare function openCamera(props: ImagePickerProps): Promise;
}
