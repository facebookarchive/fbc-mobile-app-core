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

import Modal from 'react-native-modalbox';
import QRCodeScanner from 'react-native-qrcode-scanner';
import React, {useState} from 'react';
import fbt from 'fbt';
import {ApplicationStyles} from '@fbcmobile/ui/Theme';
import {Dimensions, View} from 'react-native';
import {Toolbar} from 'react-native-material-ui';

type Props = {
  +fullSize?: boolean,
  +isOpen: boolean,
  +onScan: (qrCode: string) => void,
  +closeModal: () => void,
};

const CameraModal = (props: Props) => {
  const [useFrontCamera, setUseFrontCamera] = useState(false);

  const max_height = Dimensions.get('window').height;
  const {fullSize, onScan, isOpen, closeModal} = props;
  const height = fullSize ? max_height : max_height / 1.5;
  return (
    <Modal
      style={{height}}
      isOpen={isOpen}
      position={'center'}
      swipeToClose={false}
      backButtonClose={false}
      backdropPressToClose={false}>
      <Toolbar
        style={ApplicationStyles.screen.toolbar}
        centerElement={fbt(
          'Scan QR code',
          'Camera modal toolbar item',
        ).toString()}
        rightElement={{actions: ['switch-camera', 'close']}}
        onRightElementPress={e => {
          if (e.index === 0) {
            // switch camera
            setUseFrontCamera(!useFrontCamera);
          } else if (e.index === 1) {
            closeModal();
          }
        }}
      />
      <View style={{height, overflow: 'hidden'}}>
        <QRCodeScanner
          checkAndroid6Permissions
          cameraType={useFrontCamera ? 'front' : 'back'}
          onRead={e => {
            onScan(e.data);
            closeModal();
          }}
        />
      </View>
    </Modal>
  );
};

export default CameraModal;
