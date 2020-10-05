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

import {Linking} from 'react-native';

export const DEGREES_TO_RADIANS = Math.PI / 180;
export const TWICE_EARTH_RADIUS = 6371000 * 2;

export type Coords = {
  latitude: ?number,
  longitude: ?number,
  locationAccuracy?: ?number,
  accuracy?: ?number,
  altitude?: ?number,
  altitudeAccuracy?: ?number,
  speed?: ?number,
  heading?: ?number,
};

export function getGoogleNavigationUrlToLatLng(
  latitude: number,
  longitude: number,
) {
  return `google.navigation:q=${latitude}+${longitude}`;
}

export function getGeoUrlByLatLng(latitude: number, longitude: number) {
  return `geo:${latitude},${longitude}`;
}

export function getDistanceBetweenLocations(
  point1: ?Coords,
  point2: ?Coords,
): ?number {
  return _getHaversineDistanceBetweenLocations(point1, point2);
}

// Haversine formula based on http://en.wikipedia.org/wiki/Haversine_formula
export function _getHaversineDistanceBetweenLocations(
  point1: ?Coords,
  point2: ?Coords,
): ?number {
  if (
    point1 == null ||
    point2 == null ||
    point1.latitude == null ||
    point1.longitude == null ||
    point2.latitude == null ||
    point2.longitude == null
  ) {
    return null;
  }
  // Lat/Lng are given as degrees, so we convert to radians.
  const lat1 = point1.latitude * DEGREES_TO_RADIANS;
  const long1 = point1.longitude * DEGREES_TO_RADIANS;
  const lat2 = point2.latitude * DEGREES_TO_RADIANS;
  const long2 = point2.longitude * DEGREES_TO_RADIANS;

  const latDiff = lat1 - lat2;
  const lngDiff = long1 - long2;

  const h =
    _haversine(latDiff) + Math.cos(lat1) * Math.cos(lat2) * _haversine(lngDiff);

  const distance = TWICE_EARTH_RADIUS * Math.asin(Math.sqrt(h));

  return distance;
}

/**
 * Calculates the haversine function
 * http://en.wikipedia.org/wiki/Haversine_formula
 */
export function _haversine(d: number): number {
  const h = Math.sin(d / 2);
  return h * h;
}

export const convertKmtoMiles = (kilometer: number) => {
  return kilometer / 1.609344;
};

export const navigateToCoords = (latitude: number, longitude: number) => {
  const googleNavigationUrl = getGoogleNavigationUrlToLatLng(
    latitude,
    longitude,
  );
  if (Linking.canOpenURL(googleNavigationUrl)) {
    Linking.openURL(googleNavigationUrl);
  } else {
    Linking.openURL(getGeoUrlByLatLng(latitude, longitude));
  }
};
