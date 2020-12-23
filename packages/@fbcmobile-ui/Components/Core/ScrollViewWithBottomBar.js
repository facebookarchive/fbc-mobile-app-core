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
import {Colors} from '@fbcmobile/ui/Theme';
import {ScrollView, StyleSheet} from 'react-native';

type Props = {
  +children?: React.Node,
  +bottomBar?: React.Node,
};

const ScrollViewWithBottomBar = ({children, bottomBar}: Props) => {
  return (
    <>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={[
          styles.scrollView,
          bottomBar ? styles.contentWithBottomBar : null,
        ]}>
        {children}
      </ScrollView>
      {bottomBar}
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.BackgroundWhite,
  },
  contentWithBottomBar: {
    flexGrow: 1,
  },
});

export default ScrollViewWithBottomBar;
