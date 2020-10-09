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

import {
  MAX_PORT_NUMBER,
  isStrictNumber,
  isStrictPositiveNumber,
  isValidIPAddress,
  isValidIPv6Address,
  isValidPortNumber,
} from '@fbcmobile/ui/Utils/StringUtils';

describe('StringUtils tests', () => {
  // isStrictNumber tests
  test('Test empty or only blanks return false', () => {
    expect(isStrictNumber('')).toBeFalse();
    expect(isStrictNumber('     ')).toBeFalse();
  });

  test('Test only digits returns true', () => {
    expect(isStrictNumber('2345')).toBeTrue();
  });

  test('Test negative and only digits returns true', () => {
    expect(isStrictNumber('-2345')).toBeTrue();
  });

  test('Test only digits and out-of-place - symbol returns false', () => {
    expect(isStrictNumber('234-5')).toBeFalse();
  });

  test('Test anything but symbols returns false', () => {
    expect(isStrictNumber('234,234')).toBeFalse();
    expect(isStrictNumber('234.23')).toBeFalse();
  });

  // isStrictPositiveNumber tests
  test('Test empty or only blanks return false', () => {
    expect(isStrictPositiveNumber('')).toBeFalse();
    expect(isStrictPositiveNumber('     ')).toBeFalse();
  });

  test('Test only digits returns true', () => {
    expect(isStrictPositiveNumber('2345')).toBeTrue();
  });

  test('Test negative and only digits returns true', () => {
    expect(isStrictPositiveNumber('-2345')).toBeFalse();
  });

  test('Test only digits and out-of-place - symbol returns false', () => {
    expect(isStrictPositiveNumber('234-5')).toBeFalse();
  });

  test('Test anything but symbols returns false', () => {
    expect(isStrictPositiveNumber('234,234')).toBeFalse();
    expect(isStrictPositiveNumber('234.23')).toBeFalse();
  });

  // isValidIPAddress tests
  test('Test correct IP addresses returns true', () => {
    expect(isValidIPAddress('192.168.0.12')).toBeTrue();

    expect(isValidIPAddress('0.0.0.0')).toBeTrue();
  });

  test('Test invalid IP addresses returns false', () => {
    expect(isValidIPAddress('192.168.0')).toBeFalse();

    expect(isValidIPAddress('192.168.0.y')).toBeFalse();

    expect(isValidIPAddress('192.168')).toBeFalse();

    expect(isValidIPAddress('168')).toBeFalse();

    expect(isValidIPAddress('666.168')).toBeFalse();

    expect(isValidIPAddress('198.1685.34.235')).toBeFalse();
  });

  // isValidIPv6Address tests
  test('Test correct IPv6 addresses returns true', () => {
    expect(isValidIPv6Address('2620:10d:c079:3895::2')).toBeTrue();

    expect(isValidIPv6Address('2001:db8::1:0')).toBeTrue();

    expect(
      isValidIPv6Address('2001:0db8:85a3:0000:0000:8a2e:0370:7334'),
    ).toBeTrue();
  });

  test('Test invalid IPv6 addresses returns false', () => {
    expect(isValidIPv6Address('192.168.0')).toBeFalse();

    expect(
      isValidIPv6Address('1200:0000:AB00:1234:O000:2552:7777:1313'),
    ).toBeFalse();

    expect(isValidIPv6Address('[2001:db8:0:1]:80')).toBeFalse();

    expect(isValidIPv6Address('[2001:db8:0:1]')).toBeFalse();
  });

  // isValidPortNumber tests
  test('Test correct port number returns true', () => {
    expect(isValidPortNumber('1234')).toBeTrue();
  });

  test('Test invalid port number returns false', () => {
    expect(isValidPortNumber('-1234')).toBeFalse();

    expect(isValidPortNumber((MAX_PORT_NUMBER + 1).toString())).toBeFalse();
  });
});
