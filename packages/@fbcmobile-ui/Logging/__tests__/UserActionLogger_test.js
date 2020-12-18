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

import UserActionLogger from '../UserActionLogger';
import {EVENT} from '../UserActionEvents';
import type {
  BugData,
  ErrorData,
  EventData,
  MetricData,
  QueryData,
} from '../UserActionLogger';

describe('UserActionLogger Tests', () => {
  test('initiate logger', async () => {
    await UserActionLogger.getInstance().init();
  });
  test('log event', async () => {
    const data: EventData = {
      key: EVENT.BUG_REPORT,
      logMessage: 'log message',
    };
    UserActionLogger.logEvent(data);
  });
  test('log metric', async () => {
    const data: MetricData = {
      key: EVENT.BUG_REPORT,
      metric: 123,
    };
    await UserActionLogger.getInstance().init();
    UserActionLogger.logMetric(data);
  });
  test('log metric', async () => {
    const data: ErrorData = {
      key: EVENT.BUG_REPORT,
      errorMessage: 'something bad happened',
    };
    await UserActionLogger.getInstance().init();
    UserActionLogger.logError(data);
  });
  test('log query', async () => {
    const data: QueryData = {
      key: EVENT.BUG_REPORT,
      metric: 123,
      operationKind: 'query',
      queryName: 'myQuery',
      correlationId: '123456abcde',
    };
    await UserActionLogger.getInstance().init();
    UserActionLogger.logQuery(data);
  });
  test('log query', async () => {
    const data: BugData = {
      key: EVENT.BUG_REPORT,
      details: 'bug report',
      screenShot: '1234abcd',
    };
    await UserActionLogger.getInstance().init();
    UserActionLogger.logBug(data);
  });
  test('flush log', async () => {
    await UserActionLogger.getInstance().init();
    UserActionLogger.flush();
  });
  test('set logger params', async () => {
    await UserActionLogger.getInstance().init();
    const fetchParams = {
      method: 'POST',
      headers: {
        accept: '*/*',
        origin: 'http://example.com',
        host: 'example.host',
        'cache-control': 'max-age=0',
        'content-type': 'application/json;charset=UTF-8',
        'upgrade-insecure-requests': '1',
        'x-csrf-token': '123abc',
        'x-auth-organization': 'testorg',
      },
      credentials: 'include',
    };
    UserActionLogger.getInstance().setFetchParams(fetchParams);
    UserActionLogger.getInstance().setCustomPayload({
      email: 'me@example.com',
      tenant: 'testorg',
    });
    UserActionLogger.getInstance().setBaseUrl('http://example.com');
  });
});
