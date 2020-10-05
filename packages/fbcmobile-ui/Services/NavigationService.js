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

import {NavigationActions, StackActions} from 'react-navigation';
import type {NavigationParams} from 'react-navigation';

/**
 * The navigation is implemented as a service so that it can be used outside of
 * components, for example in sagas.
 *
 * @see https://reactnavigation.org/docs/en/navigating-without-navigation-prop.html
 */

export type AlertType = 'info' | 'warn' | 'error' | 'success';

export type DropdownType = ?{
  alertWithType: (type: AlertType, title: string, message: string) => void,
};

let navigator;
let dropDownAlert: DropdownType;

function setDropDownAlert(ref?: DropdownType) {
  dropDownAlert = ref;
}

function alert(type: AlertType, title: string, message: string = '') {
  dropDownAlert && dropDownAlert.alertWithType(type, title, message);
}

function getNavigator() {
  return navigator;
}

/**
 * This function is called when the RootScreen is created to set the navigator instance to use.
 */
function setTopLevelNavigator(navigatorRef: any) {
  navigator = navigatorRef;
}

/**
 * Call this function when you want to navigate to a specific route.
 *
 * @param routeName The name of the route to navigate to. Routes are defined in
 * RootScreen using createStackNavigator()
 * @param params Route parameters.
 */
function navigate(routeName: string, params?: NavigationParams) {
  navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
    }),
  );
}

/**
 * Call this function when you want to push a screen while in a StackNavigator.
 *
 * @param routeName The name of the route to navigate to.
 * @param params Route parameters
 */
function push(routeName: string, params?: NavigationParams) {
  navigator.dispatch(
    StackActions.push({
      routeName,
      params,
    }),
  );
}

/**
 * Call this function when you want to pop a screen while in a StackNavigator.
 *
 * @param n The number of screens to pop off the stack.
 */
function pop(n?: number) {
  navigator.dispatch(StackActions.pop({n}));
}

/**
 * Call this function when you want to navigate to a specific route AND reset the
 * navigation history.
 *
 * That means the user cannot go back. This is useful for example to redirect from
 * a splashscreen to the main screen: the user should not be able to go back to the splashscreen.
 *
 * @param routeName The name of the route to navigate to. Routes are defined in RootScreen
 * using createStackNavigator()
 * @param params Route parameters.
 */
function navigateAndReset(routeName: string, params: NavigationParams) {
  navigator.dispatch(
    StackActions.reset({
      index: 0,
      key: null,
      actions: [
        NavigationActions.navigate({
          routeName,
          params,
        }),
      ],
    }),
  );
}

export default {
  dropDownAlert,
  alert,
  setDropDownAlert,
  navigate,
  push,
  pop,
  navigateAndReset,
  setTopLevelNavigator,
  getNavigator,
};
