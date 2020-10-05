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

import Colors from '@fbcmobile/ui/Theme/Colors';
import Fonts from '@fbcmobile/ui/Theme/Fonts';

export const MaterialUITheme = {
  palette: {
    primaryColor: Colors.Blue,
    accentColor: Colors.BlueGray,
    primaryTextColor: Colors.BlueGray,
    secondaryTextColor: Colors.Gray50,
    borderColor: Colors.BlueGray,
    disabledColor: Colors.DisabledBackground,
    disabledTextColor: Colors.DisabledText,
    activeIcon: Colors.Blue,
  },
  typography: {
    body2: Fonts.style.h7,
    body1: Fonts.style.h8,
  },
  checkbox: {
    container: {
      minHeight: 30,
      height: 30,
      maxHeight: 30,
      flex: 1,
      flexShrink: 1,
    },
    label: {
      marginLeft: 0,
      flex: 0,
    },
  },
};

export default {
  screen: {
    container: {
      backgroundColor: Colors.BackgroundWhite,
      flex: 1,
    },
    bubbleBottom: {
      backgroundColor: Colors.TransparentGray10,
      justifyContent: 'flex-start',
      width: '95%',
      elevation: 10,
      alignSelf: 'center',
    },
    toolbar: {
      container: {
        backgroundColor: Colors.BackgroundWhite,
        elevation: 0, // remove shadow on Android
        shadowOpacity: 0, // remove shadow on iOS
      },
      titleText: {...Fonts.style.h2, fontFamily: 'Roboto-Medium'},
      leftElement: {color: Colors.BlueGray},
      centerElementContainer: {marginLeft: 11},
      rightElement: {color: Colors.BlueGray},
    },
    subbar: {
      container: {backgroundColor: Colors.BackgroundWhite, elevation: 0},
      titleText: {color: Colors.Black, ...Fonts.style.h2},
      leftElement: {color: Colors.Black},
      rightElement: {color: Colors.Black},
    },
  },
  actionButton: {
    container: {backgroundColor: Colors.Blue, elevation: 5},
    icon: {fontSize: 25},
  },
  headerAvatar: {
    container: {backgroundColor: Colors.Black},
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: Colors.TransparentGray70,
    padding: 10,
    margin: 7,
  },
  disabledTextInput: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: Colors.TransparentGray70,
    backgroundColor: Colors.TransparentGray10,
    fontWeight: 'bold',
    padding: 10,
    margin: 7,
  },
  headerText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
    padding: 10,
    color: Colors.Gray100,
  },
  screenTitle: {
    lineHeight: 35,
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 16,
    marginHorizontal: 16,
  },
};
