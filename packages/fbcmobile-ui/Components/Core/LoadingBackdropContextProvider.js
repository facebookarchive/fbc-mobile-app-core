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
import Spinner from 'react-native-spinkit';
import {Colors} from '@fbcmobile/ui/Theme';
import {Dimensions, StyleSheet, View} from 'react-native';

type LoadingBackdropContextType = {|
  setIsLoading: (isLoading: boolean) => void,
|};

export const LoadingBackdropContext = React.createContext<LoadingBackdropContextType>(
  {
    setIsLoading: () => {},
  },
);

type Props = {|
  +children: React.Node,
|};

const LoadingBackdropContextProvider = ({children}: Props) => {
  const [isLoading, setIsLoading] = React.useState(false);
  return (
    <LoadingBackdropContext.Provider value={{setIsLoading}}>
      {isLoading ? (
        <View style={styles.root}>
          <Spinner size={60} color={Colors.White} type="ThreeBounce" />
        </View>
      ) : null}
      {children}
    </LoadingBackdropContext.Provider>
  );
};

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    zIndex: 1,
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    backgroundColor: Colors.TransparentBlack,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LoadingBackdropContextProvider;
