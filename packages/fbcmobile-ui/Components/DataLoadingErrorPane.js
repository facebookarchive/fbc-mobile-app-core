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
import BottomBar from '@fbcmobile/ui/Components/Core/BottomBar';
import Button from '@fbcmobile/ui/Components/Core/Button';
import Text from '@fbcmobile/ui/Components/Core/Text';
import fbt from 'fbt';
import {Colors} from '@fbcmobile/ui/Theme';
import {Dimensions, View} from 'react-native';
import {Icon} from 'react-native-material-ui';

const PADDING = 150; // height of the bottom button
const WINDOW_HEIGHT: number = Dimensions.get('window').height;

type Props = {
  +errorText?: typeof fbt,
  +retry?: () => void,
};

const DataLoadingErrorPane = (props: Props) => {
  const {errorText, retry} = props;
  return (
    <View>
      <View style={styles.error}>
        <Text>
          {errorText ? (
            errorText.toString()
          ) : (
            <fbt desc="Error text showing when loading data fails">
              An error occurred while loading data. Please try again.
            </fbt>
          )}
        </Text>
        <Icon
          name="alert-circle"
          size={40}
          color={Colors.Tomato}
          iconSet="MaterialCommunityIcons"
        />
      </View>
      {retry ? (
        <BottomBar>
          <Button onPress={retry}>
            <fbt desc="Retry button label">Retry</fbt>
          </Button>
        </BottomBar>
      ) : null}
    </View>
  );
};

const styles = {
  error: {
    display: 'flex',
    flexDirection: 'column',
    height: WINDOW_HEIGHT - PADDING,
    alignItems: 'center',
    justifyContent: 'center',
  },
};

export default DataLoadingErrorPane;
