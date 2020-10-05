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

import nullthrows from '@fbcmobile/ui/Utils/nullthrows';
import {getDistanceBetweenLocations} from '@fbcmobile/ui/Utils/MapUtils';
import type {Coords} from '@fbcmobile/ui/Utils/MapUtils';

/*
 * Test that distances between coordinates are as expected.
 * Decimal Places -> Degrees -> Rough Distance
 * 0 ->      1.0 -> 111 km
 * 1 ->      0.1 -> 11.1 km
 * 2 ->     0.01 -> 1.11 km
 * 3 ->    0.001 -> 111 m
 * 4 ->   0.0001 -> 11.1 m
 * 5 ->  0.00001 -> 1.11 m (accuracy limit of most mobile phones)
 * 6 -> 0.000001 -> 0.111 m
 */
describe('MapUtils.getDistanceBetweenLocations', () => {
  // FB HQ
  const coord1: Coords = {
    latitude: 37.48499,
    longitude: -122.14816,
  };
  // Approximately 3 meters away
  const coord2: Coords = {
    latitude: 37.48501,
    longitude: -122.14818,
  };

  const emptyCoords: Coords = {latitude: null, longitude: null};

  test('location coordinates are missing values', () => {
    expect(getDistanceBetweenLocations(emptyCoords, emptyCoords)).toBeNull();
  });

  test('null coordinates', () => {
    expect(getDistanceBetweenLocations(null, null)).toBeNull();
  });

  test('locations are the same', () => {
    const distance = nullthrows(getDistanceBetweenLocations(coord1, coord1));
    expect(distance).toBe(0);
  });

  test('distance is close to expected', () => {
    const distance = nullthrows(getDistanceBetweenLocations(coord1, coord2));
    expect(distance).toBeCloseTo(2.8389);
  });
});
