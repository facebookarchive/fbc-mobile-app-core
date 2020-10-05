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
import Colors from '@fbcmobile/ui/Theme/Colors';
import RBSheet from 'react-native-raw-bottom-sheet';
import {useEffect, useRef} from 'react';

type Props = {
  +children: ?React.Node,
  +style?: ViewStyleProp,
  +title?: string,
  +height?: number,
  +isOpen?: boolean,
  +closeOnPressMask?: ?boolean,
  +closeOnPressBack?: ?boolean,
  +onClose?: () => void,
};

type RNSheetType = {
  open: () => void,
  close: () => void,
};

/**
 * Usage:
 * <BottomSheet
 *   isOpen={bottomSheetVisible}
 *   onClose={() => setBottomSheetVisible(false)}
 *   items={
 *     <View>
 *       ...
 *     </View>
 *   }
 * />
 */
const BottomSheet = ({
  isOpen = false,
  closeOnPressMask = false,
  closeOnPressBack = false,
  height = 250,
  children,
  onClose,
}: Props) => {
  const refRBSheet = useRef<?RNSheetType>(null);

  useEffect(() => {
    if (isOpen) {
      refRBSheet.current && refRBSheet.current.open();
    } else {
      refRBSheet.current && refRBSheet.current.close();
    }
  }, [isOpen]);

  return (
    <RBSheet
      ref={refRBSheet}
      height={height}
      duration={150}
      closeOnDragDown={false}
      closeOnPressMask={closeOnPressMask}
      closeOnPressBack={closeOnPressBack}
      onClose={onClose}
      customStyles={{
        draggableIcon: {width: 0, height: 0, margin: 0},
        container: {
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
        },
        wrapper: {
          backgroundColor: Colors.TransparentBlack,
        },
      }}>
      {children}
    </RBSheet>
  );
};

export default BottomSheet;
