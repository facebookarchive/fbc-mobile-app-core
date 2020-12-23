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

import type {Coords} from '@fbcmobile/ui/Utils/MapUtils';

import Button from '@fbcmobile/ui/Components/Core/Button';
import MapboxGL from '@react-native-mapbox-gl/maps';
import React, {useState} from 'react';
import Text from '@fbcmobile/ui/Components/Core/Text';
import fbt from 'fbt';
import {ActivityIndicator, View} from 'react-native';
import {Colors} from '@fbcmobile/ui/Theme';
import {Icon} from 'react-native-material-ui';

type Props = {
  +value?: ?Coords,
  +onChangeCoords?: (value: ?Coords) => void,
};

// https://docs.mapbox.com/help/glossary/zoom-level/
const ZOOM_LEVEL = 15;
// https://en.wikipedia.org/wiki/Decimal_degrees
const COORD_PRECISION = 4; // precision: ~10 meters

const CoordsInput = (props: Props) => {
  let _map;
  const {value, onChangeCoords} = props;
  const [currentLocation, setCurrentLocation] = useState<?Coords>(value);
  const [userLocation, setUserLocation] = useState<?Coords>(null);

  const setCoordsToUserLocation = () => {
    setCurrentLocation(userLocation);
    onChangeCoords && onChangeCoords(userLocation);
  };

  const setCoordsToCenterOfMap = async () => {
    if (_map != null) {
      const center = await _map.getCenter();
      const location: Coords = {
        latitude: center[1], // latitude
        longitude: center[0], // longitude
        altitude: 0, // TODO: get altitude from MapBox
        locationAccuracy: 0, // TODO: get accuracy from MapBox
      };
      setCurrentLocation(location);
      onChangeCoords && onChangeCoords(location);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <View style={styles.fieldContainer}>
          <Text variant="h7" color="gray">
            <fbt desc="Label for latitude coordinate">Latitude</fbt>
          </Text>
          <Text style={styles.text}>
            {currentLocation &&
            currentLocation?.latitude &&
            currentLocation.latitude
              ? currentLocation.latitude.toFixed(COORD_PRECISION)
              : ''}
          </Text>
        </View>
        <View style={styles.fieldContainer}>
          <Text variant="h7" color="gray">
            <fbt desc="Label for longitude coordinate">Longitude</fbt>
          </Text>
          <Text style={styles.text}>
            {currentLocation &&
            currentLocation?.longitude &&
            currentLocation.longitude
              ? currentLocation.longitude.toFixed(COORD_PRECISION)
              : ''}
          </Text>
        </View>
        <View style={styles.fieldContainer}>
          {userLocation ? (
            <Button onPress={setCoordsToUserLocation}>
              <Text weight="bold">
                {fbt(
                  'My Location',
                  'My location button text to get GPS coordinates',
                )}
              </Text>
            </Button>
          ) : (
            <ActivityIndicator size="small" color={Colors.Blue} />
          )}
        </View>
      </View>
      <View style={styles.mapContainer}>
        <MapboxGL.MapView
          onRegionDidChange={setCoordsToCenterOfMap}
          ref={c => (_map = c)}
          style={styles.map}
          rotateEnabled={false}>
          <MapboxGL.UserLocation
            onUpdate={userLocation => {
              const location: Coords = {
                latitude: userLocation.coords.latitude,
                longitude: userLocation.coords.longitude,
                altitude: 0,
                locationAccuracy: 0,
              };
              if (currentLocation == null) {
                setCurrentLocation(location);
              }
              setUserLocation(location);
            }}
          />
          <MapboxGL.ShapeSource
            id="currentLocation"
            shape={{
              type: 'Feature',
              properties: {
                icon: 'example',
              },
              geometry: {
                type: 'Point',
                coordinates: [
                  currentLocation?.longitude,
                  currentLocation?.latitude,
                ],
              },
            }}>
            <MapboxGL.CircleLayer
              id={'currentLocation'}
              sourceLayerID={'currentLocation'}
              style={{circleRadius: 7, circleColor: Colors.Blue}}
            />
          </MapboxGL.ShapeSource>
          <MapboxGL.Camera
            animationDuration={200}
            zoomLevel={ZOOM_LEVEL}
            centerCoordinate={
              currentLocation == null
                ? null
                : [currentLocation.longitude, currentLocation.latitude]
            }
          />
        </MapboxGL.MapView>
        <Icon
          name={'place'}
          iconSet="MaterialIcons"
          style={styles.centerIcon}
        />
      </View>
    </View>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: 300,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  fieldContainer: {
    flexDirection: 'column',
    flex: 1,
  },
  text: {
    padding: 0,
    fontSize: 10,
  },
  mapContainer: {
    flexGrow: 1,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
  },
  centerIcon: {
    fontSize: 20,
    marginTop: 80, // half the height of the map minus the icon size
  },
};

export default CoordsInput;
