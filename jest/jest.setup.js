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

const mockImpl = new MockAsyncStorage();
jest.mock('@react-native-community/async-storage', () => mockImpl);

jest.mock('react-native-device-info', () => {
  return {
    getModel: jest.fn(),
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