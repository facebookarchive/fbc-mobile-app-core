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

import type {TRefFor} from '@fbcmobile/ui/Components/Core/TRefFor.flow';
import type {ViewStyleProp} from 'react-native/Libraries/StyleSheet/StyleSheet';

import * as React from 'react';
import NavigationService from '@fbcmobile/ui/Services/NavigationService';
import RNShake from 'react-native-shake';
import ScrollViewWithBottomBar from '@fbcmobile/ui/Components/Core/ScrollViewWithBottomBar';
import fbt from 'fbt';
import {ApplicationStyles} from '@fbcmobile/ui/Theme';
import {I18nManager, ScrollView, StyleSheet, View} from 'react-native';
import {Toolbar as MToolbar} from 'react-native-material-ui';
import {captureScreen} from 'react-native-view-shot';

type MenuElement = {|
  +node: React.Node,
  +onClick?: () => void,
|};

type Props = {|
  +title: string,
  +children?: React.Node,
  +leftElement?: string,
  +searchable?: boolean,
  +onRefreshClicked?: () => void,
  +onIconClicked: () => void,
  +onSearchClicked?: () => void,
  +bottomBarContent?: React.Node,
  +extraRightElement?: ?MenuElement,
  +showExtraActions?: boolean,
  +style?: ViewStyleProp,
|};

const Toolbar = (props: Props, scrollViewRef: TRefFor<typeof ScrollView>) => {
  const {
    title,
    children,
    onRefreshClicked,
    onIconClicked,
    onSearchClicked,
    bottomBarContent,
    extraRightElement,
    leftElement = 'menu',
    searchable = true,
    showExtraActions = true,
  } = props;

  React.useEffect(() => {
    RNShake.addEventListener('ShakeEvent', () => {
      screenshotAndReportBug();
    });

    return () => {
      RNShake.removeEventListener('ShakeEvent');
    };
  }, []);

  const screenshotAndReportBug = () => {
    captureScreen({
      format: 'png',
      result: 'data-uri',
      quality: 1,
      snapshotContentContainer: false,
    }).then(
      uri => {
        NavigationService.navigate('BugReportScreen', {
          photoData: uri,
        });
      },
      _ =>
        NavigationService.alert(
          'error',
          fbt('Screenshot Failed', 'Alert title saying screenshot failed'),
          fbt(
            'An error occurred while taking a screenshot for the bug report. Please try again later.',
            'Error dialog text shown when a screenshot failed',
          ),
        ),
    );
  };

  let actions = searchable ? ['search'] : [];
  if (extraRightElement) {
    actions = [extraRightElement.node, ...actions];
  }
  return (
    <View style={[styles.root, props.style]}>
      <MToolbar
        style={ApplicationStyles.screen.toolbar}
        leftElement={
          leftElement === 'arrow-back' && I18nManager.isRTL
            ? 'arrow-forward'
            : leftElement
        }
        onLeftElementPress={onIconClicked}
        centerElement={title}
        rightElement={{
          actions,
          menu: showExtraActions
            ? {
                icon: 'more-vert',
                labels: [
                  fbt('Refresh', 'Menu item text').toString(),
                  fbt('Report Bug', 'Menu item text').toString(),
                ],
              }
            : null,
        }}
        onRightElementPress={e => {
          if (e.action === 'menu') {
            switch (true) {
              case e.index === 0:
                onRefreshClicked && onRefreshClicked();
                break;
              case e.index === 1:
                screenshotAndReportBug();
                break;
            }
          } else if (e.action === 'search') {
            onSearchClicked && onSearchClicked();
          } else if (e.action === extraRightElement?.node) {
            extraRightElement?.onClick && extraRightElement.onClick();
          }
        }}
      />
      <ScrollViewWithBottomBar ref={scrollViewRef} bottomBar={bottomBarContent}>
        {children}
      </ScrollViewWithBottomBar>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    height: '100%',
    display: 'flex',
  },
});

export default React.forwardRef<Props, typeof ScrollView>(Toolbar);
