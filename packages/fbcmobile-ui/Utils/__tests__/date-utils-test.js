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

import moment from 'moment';
import nullthrows from '@fbcmobile/ui/Utils/nullthrows';
import {getClosestFutureDayToToday} from '@fbcmobile/ui/Utils/DateUtils';

describe('DateUtils.getClosestFutureDayToToday', () => {
  const today = moment().startOf('day');
  const yesterday = moment(today).add(-1, 'd');
  const tomorrow = moment(today).add(1, 'd');
  const dayAfterTomorrow = moment(tomorrow).add(1, 'd');
  const eightDaysAfterToday = moment(today).add(8, 'd');

  test('today is closer than tomorrow', () => {
    const dates = [today, tomorrow];

    const closestDay = nullthrows(getClosestFutureDayToToday(dates, 'en-us'));
    expect(closestDay.toISOString()).toBe(today.toISOString());
  });

  test('tomorrow is closer than 2 days from today', () => {
    const dates = [tomorrow, dayAfterTomorrow];

    const closestDay = nullthrows(getClosestFutureDayToToday(dates, 'en-us'));
    expect(closestDay.toISOString()).toBe(tomorrow.toISOString());
  });

  test('multiple future dates', () => {
    const dates = [tomorrow, dayAfterTomorrow, eightDaysAfterToday];

    const closestDay = nullthrows(getClosestFutureDayToToday(dates, 'en-us'));
    expect(closestDay.toISOString()).toBe(tomorrow.toISOString());
  });

  test('with past day', () => {
    const dates = [yesterday, tomorrow];

    const closestDay = nullthrows(getClosestFutureDayToToday(dates, 'en-us'));
    expect(closestDay.toISOString()).toBe(tomorrow.toISOString());
  });

  test('only past dates return null', () => {
    const dates = [yesterday];

    const closestDay = getClosestFutureDayToToday(dates, 'en-us');
    expect(closestDay).toBeNull();
  });

  test('multiple future unordered dates', () => {
    const dates = [eightDaysAfterToday, tomorrow, dayAfterTomorrow];

    const closestDay = nullthrows(getClosestFutureDayToToday(dates, 'en-us'));
    expect(closestDay.toISOString()).toBe(tomorrow.toISOString());
  });
});
