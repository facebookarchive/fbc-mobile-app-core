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

import {PermissionsAndroid} from 'react-native';
import {useEffect, useState} from 'react';

export default function(permissions: Array<string>) {
  const [permissionsGranted, setPermissionsGranted] = useState<?boolean>(null);

  useEffect(() => {
    PermissionsAndroid.requestMultiple(permissions).then(result =>
      setPermissionsGranted(
        Object.keys(result).filter(
          permission =>
            result[permission] !== PermissionsAndroid.RESULTS.GRANTED,
        ).length === 0,
      ),
    );
  }, [permissions]);

  return {permissionsGranted};
}
