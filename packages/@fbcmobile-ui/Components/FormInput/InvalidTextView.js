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
import Text from '@fbcmobile/ui/Components/Core/Text';

type Props = {
  +text: string,
  +visible: boolean,
};

const InvalidTextView = (props: Props) => {
  return props.visible ? (
    <Text color="red" style={styles.invalid}>
      {props.text}
    </Text>
  ) : null;
};

const styles = {
  invalid: {
    marginTop: 5,
    fontSize: 15,
  },
};

export default InvalidTextView;
