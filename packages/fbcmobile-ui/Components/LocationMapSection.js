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

import type {ViewStyleProp} from 'react-native/Libraries/StyleSheet/StyleSheet';

import * as React from 'react';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {Colors} from '@fbcmobile/ui/Theme';
import {Icon} from 'react-native-material-ui';
import {StyleSheet, View} from 'react-native';

type Props = {
  +style?: ViewStyleProp,
  +latitude: number,
  +longitude: number,
};

const ZOOM_LEVEL = 15; // Street level zoom - able to see buildings (https://docs.mapbox.com/help/glossary/zoom-level/)

const LocationMapSection = ({longitude, latitude, style}: Props) => {
  return (
    <View style={[styles.root, style]}>
      <View style={styles.mapContainer}>
        <MapboxGL.MapView
          style={styles.map}
          rotateEnabled={false}
          pitchEnabled={false}
          scrollEnabled={false}
          zoomEnabled={false}
          centerCoordinate={[longitude, latitude]}
          logoEnabled={false}
          compassEnabled={false}>
          <MapboxGL.Camera
            zoomLevel={ZOOM_LEVEL}
            centerCoordinate={[longitude, latitude]}
          />
          <MapboxGL.ShapeSource
            id="location"
            shape={{
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [longitude, latitude],
              },
            }}
          />
        </MapboxGL.MapView>
        <Icon name="place" iconSet="MaterialIcons" style={styles.centerIcon} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    position: 'relative',
  },
  mapContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  centerIcon: {
    color: Colors.Gray80,
  },
});

export default LocationMapSection;
