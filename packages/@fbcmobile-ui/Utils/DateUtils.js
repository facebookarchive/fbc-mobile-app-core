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

"use strict";

import "moment/min/locales";
import * as React from "react";
import fbt from "fbt";
import moment from "moment/min/moment-with-locales.min.js";

/**
 * Checks if the device locale is available in moment and returns the locale
 * to be loaded
 * @param  {string} locale locale to be checked
 * @return {string}        locale to be loaded by moment
 */
export function chooseMomentLocale(locale: string): string {
  // make the locale lower case
  // will fix crashes caused by "en-GB" (instead of "en-gb") not being found
  const localeLowerCase = locale.toLowerCase();
  if (moment.locales().includes(localeLowerCase)) {
    // check if the locale is included in the array returned by `locales()`
    // which (in this case) tells us which locales moment will support
    return localeLowerCase;
  } else if (moment.locales().includes(localeLowerCase.substring(0, 2))) {
    // check if the first two letters of the locale are included in the array
    // returned by `locales()` which (in this case) tells us which locales
    // moment will support
    // will fixes crashes caused by "en-US" not being found, as we'll tell
    // moment to load "en" instead
    return localeLowerCase.substring(0, 2);
  }
  // use "en" (the default language and locale for my app) as
  // a fallback if we can't find any other locale
  return "en";
}

export function getReadableDateString(
  date: moment$Moment,
  locale: string
): React.Node {
  const today = moment();
  const tomorrow = moment(today).add(1, "d");

  if (today.isSame(date, "day")) {
    return <fbt desc="Date label shown as today">Today</fbt>;
  } else if (tomorrow.isSame(date, "day")) {
    return <fbt desc="Date label shown as tomorrow">Tomorrow</fbt>;
  }

  return date.locale(locale).format("MMM DD");
}

export function getClosestFutureDayToToday(
  dates: Array<moment$Moment>,
  jsLocale: string
): ?moment$Moment {
  const todayMoment = moment()
    .locale(jsLocale)
    .startOf("day");

  const closestMoment = dates
    .map<moment$Moment>((date) =>
      moment(date)
        .locale(jsLocale)
        .startOf("day")
    )
    .filter((moment) => moment.isSameOrAfter(todayMoment, "days"))
    .reduce((closestMoment, currentMoment) => {
      if (closestMoment == null) {
        return currentMoment;
      }

      if (
        currentMoment.diff(todayMoment, "days") <
        closestMoment.diff(todayMoment, "days")
      ) {
        return currentMoment;
      }
      return closestMoment;
    }, null);

  return closestMoment;
}

export function getSimpleDateString(date: moment$Moment, locale: string) {
  return date.locale(locale).format("MM DD YYYY");
}

export function getLocaleDateTimeString(date: moment$Moment, locale: string) {
  return date.locale(locale).format("L LT");
}

// TODO: Support translations
export function timeSince(
  date: moment$Moment,
  locale: string,
  currentTime?: moment$Moment
) {
  const now = currentTime ? currentTime : moment().locale(locale);

  const intervals = {
    years: { diff: now.diff(date, "years"), unit: "y" },
    weeks: { diff: now.diff(date, "weeks"), unit: "w" },
    days: { diff: now.diff(date, "days"), unit: "d" },
    hours: { diff: now.diff(date, "hours"), unit: "h" },
    minutes: { diff: now.diff(date, "minutes"), unit: "m" },
    seconds: { diff: now.diff(date, "seconds"), unit: "s" },
  };

  let intervalType = null;
  if (intervals.years.diff >= 1) {
    intervalType = "years";
  } else if (intervals.weeks.diff >= 1) {
    intervalType = "weeks";
  } else if (intervals.days.diff >= 1) {
    intervalType = "days";
  } else if (intervals.hours.diff >= 1) {
    intervalType = "hours";
  } else if (intervals.minutes.diff >= 1) {
    intervalType = "minutes";
  } else if (intervals.seconds.diff >= 1) {
    intervalType = "seconds";
  }

  if (intervalType === null) {
    return "now";
  }

  const interval = intervals[intervalType];
  return `${interval.diff}${interval.unit}`;
}
