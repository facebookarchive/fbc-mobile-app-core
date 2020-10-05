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

import 'moment/min/locales';

/**
 * Returns true only for strings composed by digits and
 * strings starting with `-` and followed by digits.
 *
 * Does not allow `.` or `,`.
 *
 * Note: Does not handle overflow/BigInt numbers.
 *
 * e.g.
 * 23,123 will return false
 * 234.00 will return false
 * +324   will return false
 *
 * -324  will return true
 * 34215 will return true
 */
export function isStrictNumber(text: string): boolean {
  const isDigit = (char: string): boolean => {
    return char >= '0' && char <= '9';
  };

  const isInteger = (str: string): boolean => {
    if (str == null || str.length == 0) {
      return false;
    }

    let index = 0;
    if (str[index] === '-') {
      // accept `-` only as the first character
      index = 1;
    }
    for (; index < str.length; index++) {
      if (!isDigit(str[index])) {
        return false;
      }
    }
    return true;
  };

  return isInteger(text);
}

/**
 * Same as `isStrictNumber` but does not allow negative numbers
 */
export function isStrictPositiveNumber(text: string): boolean {
  if (text == null || text.length == 0) {
    return false;
  }

  return text[0] !== '-' && isStrictNumber(text);
}

/**
 * Returns true if the string matches an IP address
 *
 * Taken from:
 * https://www.w3resource.com/javascript/form/ip-address-validation.php
 */
export function isValidIPAddress(ipAddress: string): boolean {
  /* eslint-disable max-len */
  const ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  if (ipRegex.test(ipAddress)) {
    return true;
  }

  return false;
}

export const MAX_PORT_NUMBER = 65535;
export function isValidPortNumber(text: string) {
  return isStrictPositiveNumber(text) && parseInt(text) <= MAX_PORT_NUMBER;
}
