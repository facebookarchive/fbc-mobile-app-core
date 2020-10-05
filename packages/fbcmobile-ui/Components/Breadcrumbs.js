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

import type {BreadcrumbData} from '@fbcmobile/ui/Components/Breadcrumb';
import type {ViewStyleProp} from 'react-native/Libraries/StyleSheet/StyleSheet';

import Breadcrumb from '@fbcmobile/ui/Components/Breadcrumb';
import React from 'react';
import {ScrollView} from 'react-native';

type Props = {
  +style?: ViewStyleProp,
  +breadcrumbs: Array<BreadcrumbData>,
  +onClick: (data: BreadcrumbData) => any,
};

const Breadcrumbs = (props: Props) => {
  const {breadcrumbs, onClick, style} = props;

  return (
    <ScrollView
      style={style}
      showsHorizontalScrollIndicator={false}
      horizontal={true}
      directionalLockEnabled={true}>
      {breadcrumbs.map((b, i) => (
        <Breadcrumb
          key={b.id}
          data={b}
          isLast={i === breadcrumbs.length - 1}
          onClick={onClick}
        />
      ))}
    </ScrollView>
  );
};

export default Breadcrumbs;
