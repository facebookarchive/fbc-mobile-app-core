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

import MockAsyncStorage from 'mock-async-storage';
import {Image, NativeModules} from 'react-native';

NativeModules.RNCNetInfo = {
  getCurrentState: jest.fn(() => Promise.resolve()),
  addListener: jest.fn(),
  removeListeners: jest.fn(),
};

Image.getSize = jest.fn();

const mockImpl = new MockAsyncStorage();
jest.mock('@react-native-community/async-storage', () => mockImpl);

jest.mock('fbt', () => {
  return {
    fbt: jest.fn(() => jest.fn()),
    toString: jest.fn(),
  }
})

jest.mock('nullthrows', () => {
  return {
    nullthrows: jest.fn(),
  }
});

jest.mock('react-native-device-info', () => {
  return {
    getBuildNumber: jest.fn(),
    getApplicationName: jest.fn(),
    getModel: jest.fn(),
    getBrand: jest.fn(),
    getBundleId: jest.fn(),
    getDeviceId: jest.fn(),
    getModel: jest.fn(),
    getReadableVersion: jest.fn(),
    getSystemVersion: jest.fn(),
    getVersion: jest.fn(),
    isTablet: jest.fn(),
    getApiLevel: jest.fn(),
    getAvailableLocationProviders: jest.fn(),
    getBuildId: jest.fn(),
    getCarrier: jest.fn(),
    getCodename: jest.fn(),
    getDevice: jest.fn(),
    getDisplay: jest.fn(),
    getDeviceName: jest.fn(),
    getFirstInstallTime: jest.fn(),
    getFreeDiskStorage: jest.fn(),
    getHardware: jest.fn(),
    getHost: jest.fn(),
    getIncremental: jest.fn(),
    getInstallerPackageName: jest.fn(),
    getInstallReferrer: jest.fn(),
    getLastUpdateTime: jest.fn(),
    getManufacturer: jest.fn(),
    getProduct: jest.fn(),
    getTags: jest.fn(),
    getType: jest.fn(),
    getUserAgent: jest.fn(),
    isEmulator: jest.fn(),
    supportedAbis: jest.fn(),
    isAirplaneMode: jest.fn(),
    isBatteryCharging: jest.fn(),
    isLocationEnabled: jest.fn(),
    getPowerState: jest.fn(),
  };
});

function initTimeControls() {
  const MockDate = require('mockdate');
  const timerIncrement = 10;

  global.managedClock = (funcToCall) => {
      MockDate.set(0);
      jest.useFakeTimers();
      funcToCall();
      MockDate.reset();
      jest.useRealTimers();
  }

  global.moveTimeForward = (time = timerIncrement) => {
      const moveTime = () => {
          const now = Date.now();
          MockDate.set(new Date(now + timerIncrement));
          jest.advanceTimersByTime(timerIncrement);
      }

      const frames = time / timerIncrement;
      for (let i = 0; i < frames; i++) {
        moveTime();
      }
  }
}

initTimeControls();