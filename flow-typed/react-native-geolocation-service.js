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
declare module 'react-native-geolocation-service' {
  declare var ERROR_CODES: {
    PERMISSION_DENIED: 1,
    POSITION_UNAVAILABLE: 2,
    TIMEOUT: 3,
    PLAY_SERVICE_NOT_AVAILABLE: 4,
    SETTINGS_NOT_SATISFIED: 5,
    INTERNAL_ERROR: -1,
  };

  declare type LocationOptions = {|
    +timeout?: ?number,
    +maximumAge?: ?number,
    +enableHighAccuracy?: ?boolean,
    +distanceFilter?: ?number,
    +showLocationDialog?: ?boolean,
    +forceRequestLocation?: ?boolean,
  |};

  declare type WatchOptions = {|
    ...LocationOptions,
    +interval?: ?number,
    +fastestInterval?: ?number,
  |};

  declare type Location = {|
    mocked?: boolean,
    timestamp: number,
    coords: {|
      latitude: number,
      longitude: number,
      altitude: number,
      accuracy: number,
      heading: number,
      speed: number,
      altitudeAccuracy?: number,
    |},
  |};

  declare type LocationError = {|
    code: $Keys<typeof ERROR_CODES>,
    message: string,
    PERMISSION_DENIED: number,
    POSITION_UNAVAILABLE: number,
    TIMEOUT: number,
  |};

  declare function getCurrentPosition(
    successCallback: (locationEvent: Location) => void,
    errorCallback?: (error: LocationError) => void,
    options?: LocationOptions,
  ): () => void;

  declare function watchPosition(
    successCallback: (locationEvent: Location) => void,
    errorCallback?: (error: LocationError) => void,
    options?: WatchOptions,
  ): () => void;

  declare function clearWatch(watchId: number): () => void;

  declare function stopObserving(): () => void;
}
