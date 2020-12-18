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

import type {NavigationNavigatorProps} from 'react-navigation';
import type {NavigationScreenConfig} from 'react-navigation';

import Button from '@fbcmobile/ui/Components/Core/Button';
import FormInput from '@fbcmobile/ui/Components/FormInput/FormInput';
import NavigationService from '@fbcmobile/ui/Services/NavigationService';
import React, {useEffect, useRef, useState} from 'react';
import Spinner from 'react-native-spinkit';
import TextFormInput from '@fbcmobile/ui/Components/FormInput/TextFormInput';
import UserActionLogger from '@fbcmobile/ui/Logging/UserActionLogger';
import {Colors} from '@fbcmobile/ui/Theme';
import {EVENT} from '@fbcmobile/ui/Logging/UserActionEvents';
import {Icon} from 'react-native-material-ui';
import {Image, ScrollView, View} from 'react-native';
import {TextInput} from 'react-native';
import {fbt} from 'fbt';

type Props = NavigationNavigatorProps<{}, {params: {photoData: string}}>;

type ImageSize = {|
  width: number,
  height: number,
|};

const BugReportScreen = (props: Props) => {
  const {navigation} = props;
  const photoData = navigation.getParam('photoData');
  const [imageSize, setImageSize] = useState<?ImageSize>(null);
  const [details, setDetails] = useState<?string>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const inputRef = useRef<?React$ElementRef<typeof TextInput>>(null);

  useEffect(() => {
    Image.getSize(photoData, (width: number, height: number) =>
      setImageSize({width, height}),
    );
  }, [photoData]);

  return (
    <View style={styles.root}>
      <ScrollView>
        <View style={styles.container}>
          <FormInput
            title={fbt('Details', 'Text box header').toString()}
            description={fbt(
              "Please describe the bug you've observed",
              'Instructions for describing the observed bug',
            ).toString()}
            onPress={() => {
              inputRef.current && inputRef.current.focus();
            }}>
            <TextFormInput
              multiline={true}
              autoFocus={true}
              numberOfLines={3}
              value={details}
              onChangeText={text => setDetails(text)}
              ref={inputRef}
            />
          </FormInput>
          <FormInput title={fbt('Screenshot', 'Screenshot header').toString()}>
            {imageSize && (
              <Image
                style={{
                  ...styles.photoContainer,
                  width: imageSize.width / 4,
                  height: imageSize.width / 4,
                }}
                resizeMode="contain"
                source={{uri: photoData}}
              />
            )}
            <Button
              disabled={uploading}
              textAlign="left"
              rightIcon={
                uploading ? (
                  <Spinner
                    size={20}
                    color={Colors.DisabledText}
                    type="ThreeBounce"
                  />
                ) : (
                  <Icon
                    name="arrow-right"
                    iconSet="MaterialCommunityIcons"
                    color={Colors.White}
                    size={20}
                  />
                )
              }
              onPress={() => {
                setUploading(true);
                UserActionLogger.logBug({
                  key: EVENT.BUG_REPORT,
                  details: details,
                  screenShot: photoData,
                });
                setUploading(false);
                NavigationService.alert(
                  'success',
                  fbt('Bug Report Submitted', 'Label for Bug Report Submitted'),
                  fbt(
                    'Thank you for submitting a bug report!  Our team will look into it as soon as possible.',
                    'Text thanking the user for submitting a bug report',
                  ),
                );
                NavigationService.pop();
              }}>
              <fbt desc="Submit bug button text">Submit</fbt>
            </Button>
          </FormInput>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = {
  root: {
    backgroundColor: Colors.BackgroundWhite,
  },
  container: {
    padding: 20,
  },
  photoContainer: {
    borderRadius: 10,
    marginBottom: 30,
    backgroundColor: Colors.Gray10,
    justifyContent: 'center',
    alignItems: 'center',
  },
};

const options: NavigationScreenConfig<*> = {
  headerShown: true,
  headerTitle: fbt('Bug Report', 'Bug Report screen title').toString(),
};

BugReportScreen.navigationOptions = options;

export default BugReportScreen;
