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

import React from 'react';
import {Colors} from '@fbcmobile/ui/Theme';
import {Text} from '@99xt/first-born';

type Props = {
  +text: string,
  +visible: boolean,
};

const InvalidTextView = (props: Props) => {
  return props.visible ? (
    <Text style={styles.invalid}>{props.text}</Text>
  ) : null;
};

const styles = {
  invalid: {
    marginTop: 5,
    color: Colors.Red,
    fontSize: 15,
  },
};

export default InvalidTextView;
