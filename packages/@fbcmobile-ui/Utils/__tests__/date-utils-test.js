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
import fbt from 'fbt';
import moment from 'moment';
import nullthrows from '@fbcmobile/ui/Utils/nullthrows';
import {
  chooseMomentLocale,
  getClosestFutureDayToToday,
  getLocaleDateTimeString,
  getReadableDateString,
  getSimpleDateString,
  timeSince,
} from '@fbcmobile/ui/Utils/DateUtils';

describe('DateUtils.getClosestFutureDayToToday', () => {
  const today = moment().startOf('day');
  const yesterday = moment(today).add(-1, 'd');
  const tomorrow = moment(today).add(1, 'd');
  const dayAfterTomorrow = moment(tomorrow).add(1, 'd');
  const eightDaysAfterToday = moment(today).add(8, 'd');
  const jan21 = moment('2020-01-21');

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

  test('choose moment locale', () => {
    const locale = chooseMomentLocale('EN_US');
    expect(locale).toBe('en');
  });
  test('choose moment locale lowercase', () => {
    const locale = chooseMomentLocale('en-gb');
    expect(locale).toBe('en-gb');
  });

  test('choose unknown locale', () => {
    const locale = chooseMomentLocale('zz-zz');
    expect(locale).toBe('en');
  });

  test('readable date string for today', () => {
    const dateString = getReadableDateString(today, 'en_us');
    const label = <fbt desc="Date label shown as today">Today</fbt>;
    expect(dateString).toStrictEqual(label);
  });

  test('readable date string for tomorrow', () => {
    const dateString = getReadableDateString(tomorrow, 'en_us');
    const label = <fbt desc="Date label shown as tomorrow">Tomorrow</fbt>;
    expect(dateString).toStrictEqual(label);
  });

  test('readable date string for a future date', () => {
    const dateString = getReadableDateString(jan21, 'en_us');
    const label = 'Jan 21';
    expect(dateString).toBe(label);
  });

  test('simple date string', () => {
    const dateString = getSimpleDateString(jan21, 'en_gb');
    expect(dateString).toBe('01 21 2020');
  });

  test('locale date time string', () => {
    const dateString = getLocaleDateTimeString(jan21, 'en_gb');
    expect(dateString).toBe('21/01/2020 00:00');
  });

  test('time since today', () => {
    const dateString = timeSince(today, 'en_gb', today);
    expect(dateString).toBe('now');
  });

  test('time since 1 year', () => {
    const future = moment(today).add(1, 'y');
    const dateString = timeSince(today, 'en_gb', future);
    expect(dateString).toBe('1y');
  });
  test('time since 1 week', () => {
    const future = moment(today).add(1, 'w');
    const dateString = timeSince(today, 'en_gb', future);
    expect(dateString).toBe('1w');
  });
  test('time since 1 day', () => {
    const future = moment(today).add(1, 'd');
    const dateString = timeSince(today, 'en_gb', future);
    expect(dateString).toBe('1d');
  });
  test('time since 1 hour', () => {
    const future = moment(today).add(1, 'h');
    const dateString = timeSince(today, 'en_gb', future);
    expect(dateString).toBe('1h');
  });
  test('time since 1 minute', () => {
    const future = moment(today).add(1, 'm');
    const dateString = timeSince(today, 'en_gb', future);
    expect(dateString).toBe('1m');
  });
  test('time since 1 second', () => {
    const future = moment(today).add(1, 's');
    const dateString = timeSince(today, 'en_gb', future);
    expect(dateString).toBe('1s');
  });
});
