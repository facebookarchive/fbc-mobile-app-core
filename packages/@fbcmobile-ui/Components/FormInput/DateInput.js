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

import DateTimePicker from '@react-native-community/datetimepicker';
import React, {useState} from 'react';
import Text from '@fbcmobile/ui/Components/Core/Text';
import {StyleSheet, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

type Props = {
  +unixTimestamp: ?number,
  +onChangeDate?: (value: ?number) => void,
};

const DateInput = (props: Props) => {
  const {unixTimestamp, onChangeDate} = props;

  const [show, setShow] = useState<boolean>(false);
  const [newDate, setNewDate] = useState<Date>(
    unixTimestamp ? new Date(unixTimestamp * 1000) : new Date(),
  );

  const getFormattedDate = (date: Date): string => {
    return `${date.getFullYear()}-${date.getMonth() +
      1}-${date.getDate()}, ${date.getHours()}:${date.getMinutes()}`;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setShow(true)}>
        <Text weight="regular">{getFormattedDate(newDate)}</Text>
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          style={styles.datePicker}
          value={newDate}
          mode={'date'}
          minimumDate={new Date(1970, 1, 1)}
          display="default"
          onChange={(event, date) => {
            setShow(false);
            if (date) {
              const now = new Date();
              date.setHours(now.getHours());
              date.setMinutes(now.getMinutes());
              date.setSeconds(now.getSeconds());
              date.setMilliseconds(now.getMilliseconds());
              setNewDate(date);
              onChangeDate && onChangeDate(Math.round(date.getTime() / 1000));
            }
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
  },
  datePicker: {
    width: 160,
  },
});

export default DateInput;
