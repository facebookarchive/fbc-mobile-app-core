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

import type {LocationProviderInfo, PowerState} from 'react-native-device-info';

import * as beaver from 'beaver-logger';
import AsyncStorage from '@react-native-community/async-storage';
import DeviceInfo from 'react-native-device-info';
import NetInfo from '@react-native-community/netinfo';

export type MetricData = {|
  key: string,
  metric: number,
|};

export type ErrorData = {|
  key: string,
  errorMessage: string,
|};

export type EventData = {|
  key: string,
  logMessage?: ?string,
|};

export type QueryData = {|
  key: string,
  metric: number,
  operationKind?: ?string,
  queryName?: ?string,
  correlationId?: ?string,
|};

export type BugData = {|
  key: string,
  details: ?string,
  screenShot: ?string, // base-64 encoded image
|};

export type FetchParams = {
  method: 'POST',
  headers: {
    accept: string,
    origin: string,
    host: string,
    'x-auth-organization': ?string,
    'cache-control': string,
    'content-type': string,
    'upgrade-insecure-requests': string,
    'x-csrf-token': ?string,
  },
  credentials: string,
  body?: ?string,
};

type LogData = {
  eventType: string,
  error?: ?string,
  metricValue?: ?number,
  tenant?: ?string,
  logMessage?: ?string,
  screenShot?: ?string,
  operationKind?: ?string,
  queryName?: ?string,
  correlationId?: ?string,
};

const KEYS = {
  LOG_EVENTS: 'log_events',
};

class UserActionLogger {
  static logger: UserActionLogger;

  _asyncFieldsLoaded: boolean;

  // DeviceInfo fields
  _apiLevel: number;
  _applicationName: string;
  _availableLocationProviders: LocationProviderInfo;
  _brand: string;
  _buildNumber: string;
  _bundleId: string;
  _carrier: string;
  _codeName: string;
  _device: string;
  _deviceId: string;
  _display: string;
  _devicename: string;
  _firstInstallTime: number;
  _freeDiskStorage: number;
  _hardware: string;
  _host: string;
  _incremental: string;
  _installerPackageName: string;
  _installReferrer: string;
  _lastUpdateTime: number;
  _manufacturer: string;
  _model: string;
  _product: string;
  _readableVersion: string;
  _systemVersion: string;
  _buildId: string;
  _tags: string;
  _type: string;
  _userAgent: string;
  _version: string;
  _isEmulator: boolean;
  _isTablet: string;
  _supportedAbis: string[];

  _baseUrl: string;
  _fetchParams: FetchParams;
  _customPayload: {[string]: string};

  _beaverLogger;

  constructor() {
    // beaver-logger expects a value for window.location.protocol but
    // React Native doesn't polyfill window.location.  We'll do it here.
    if (typeof window != 'undefined' && !window.location) {
      window.location = {protocol: 'http'};
    }

    this._asyncFieldsLoaded = false;

    // Listen for changes to network status.  If the network is available again
    // try to flush all the stored log events from disk.
    let isConnected = true;
    NetInfo.addEventListener(state => {
      if (state.isConnected != isConnected) {
        isConnected = state.isConnected;
        if (isConnected) {
          this._flushEventsFromDisk();
        }
      }
    });

    this._applicationName = DeviceInfo.getApplicationName();
    this._brand = DeviceInfo.getBrand();
    this._buildNumber = DeviceInfo.getBuildNumber();
    this._bundleId = DeviceInfo.getBundleId();
    this._deviceId = DeviceInfo.getDeviceId();
    this._model = DeviceInfo.getModel();
    this._readableVersion = DeviceInfo.getReadableVersion();
    this._systemVersion = DeviceInfo.getSystemVersion();
    this._version = DeviceInfo.getVersion();
    this._isTablet = DeviceInfo.isTablet() ? 'true' : 'false';

    this._beaverLogger = beaver.Logger({
      // Url to send logs to - is customized in transport function
      url: '',

      // Prefix to prepend to all events
      prefix: 'mobile_app',

      logLevel: beaver.LOG_LEVEL.INFO,

      // Interval to flush logs to server - 5 seconds
      flushInterval: 5 * 1000,

      transport: async ({_url, _method, json}): Promise<any> => {
        const eventData = json.events.map(e => {
          const {event, level, payload} = e;
          const {timestamp, ...rest} = payload;
          return {
            event: {name: event},
            level,
            ts: timestamp / 1000,
            ...rest,
          };
        });

        if (!this._baseUrl) {
          return;
        }
        this._fetchParams.body = JSON.stringify(eventData);

        fetch(this._baseUrl, this._fetchParams)
          .then(_response => {
            // noop - the service returns an empty response when logs are received
          })
          .catch((_error: Error) => {
            // Store failed log events to disk so they don't get lost.
            this._setLogEvent(JSON.stringify(eventData));
          });
      },
    });
  }

  _flushEventsFromDisk() {
    this._getLogEvents().then((events: Array<string>) => {
      const eventsThatFailedToUpload = [];
      events.forEach(event => {
        this._fetchParams.body = event;
        fetch(this._baseUrl, this._fetchParams)
          .then(_response => {
            // noop - the service returns an empty response when logs are received
          })
          .catch((_error: Error) => {
            // store events that failed to upload so we can try to upload them again later
            eventsThatFailedToUpload.push(event);
          });
      });
      this._setLogEvent(null); // clear out the disk cache
      if (eventsThatFailedToUpload.length > 0) {
        this._setLogEvents(eventsThatFailedToUpload);
      }
    });
  }

  /**
   * Log Events functions
   * Events are expected to be stringified before calling these functions.
   * Passing a null value clears the log event data from local storage.
   */
  async _setLogEvent(logEvent: ?LogData): Promise<void> {
    if (logEvent) {
      const value = await AsyncStorage.getItem(KEYS.LOG_EVENTS);
      const logEvents: Array<LogData> = value ? JSON.parse(value) : [];
      logEvents.push(logEvent);
      return await AsyncStorage.setItem(
        KEYS.LOG_EVENTS,
        JSON.stringify(logEvents),
      );
    }
    AsyncStorage.removeItem(KEYS.LOG_EVENTS);
  }

  async _setLogEvents(logEvents: Array<string>): Promise<void> {
    if (logEvents.length > 0) {
      AsyncStorage.setItem(KEYS.LOG_EVENTS, logEvents);
    }
  }

  async _getLogEvents(): Promise<Array<string>> {
    const value = await AsyncStorage.getItem(KEYS.LOG_EVENTS);
    const logEvents: Array<string> = value ? JSON.parse(value) : [];
    return logEvents;
  }

  /*
   * Example logging a metric:
   * logMetric({key: METRIC.MY_METRIC_MS, metric: 12345});
   */
  static logMetric(data: MetricData) {
    UserActionLogger.getInstance()._logEvent({
      eventType: data.key,
      metricValue: data.metric,
    });
  }

  /*
   * Example logging an error:
   * logError({key: ERROR.MY_ERROR, errorMessage: 'really bad error'});
   */
  static logError(data: ErrorData) {
    UserActionLogger.getInstance()._logEvent({
      eventType: data.key,
      error: data.errorMessage,
    });
  }

  /*
   * Example logging an event:
   * logEvent({
   *   key: EVENT.MY_EVENT,
   *   logMessage: 'Here is the event message',
   * });
   */
  static logEvent(data: EventData) {
    UserActionLogger.getInstance()._logEvent({
      eventType: data.key,
      logMessage: data.logMessage,
    });
  }

  /*
   * Example logging a query:
   * logQuery({
   *   key: METRIC.MY_QUERY_METRIC_MS,
   *   metric: 12345,
   *   operationKind: 'mutation',
   *   queryName: 'MySpecialCreateMutation',
   *   correlationId: 'abcdef1234567890',
   * });
   */
  static logQuery(data: QueryData) {
    UserActionLogger.getInstance()._logEvent({
      eventType: data.key,
      metricValue: data.metric,
      operationKind: data.operationKind,
      queryName: data.queryName,
      correlationId: data.correlationId,
    });
  }

  /*
   * Example logging a bug report:
   * logBug({
   *   key: EVENT.BUG_REPORT,
   *   details: 'There is a bug in this screen',
   *   screenShot: 'data:image/png;base64,ABCDEFG123456...',
   * });
   */
  static async logBug(data: BugData) {
    // Get extra device data if this is a bug report
    const usedMemory: number = await DeviceInfo.getUsedMemory();
    const isAirplaneMode: boolean = await DeviceInfo.isAirplaneMode();
    const isBatteryCharging: boolean = await DeviceInfo.isBatteryCharging();
    const isLocationEnabled: boolean = await DeviceInfo.isLocationEnabled();
    const powerState: PowerState | {} = await DeviceInfo.getPowerState();
    let lowPowerMode, batteryLevel, batteryState;
    if (powerState) {
      lowPowerMode = powerState.lowPowerMode ? powerState.lowPowerMode : null;
      batteryLevel = powerState.batteryLevel ? powerState.batteryLevel : null;
      batteryState = powerState.batteryState ? powerState.batteryState : null;
    }
    UserActionLogger.getInstance()._logEvent({
      eventType: data.key,
      logMessage: data.details,
      screenShot: data.screenShot,
      usedMemory,
      isAirplaneMode: isAirplaneMode ? 'true' : 'false',
      isBatteryCharging: isBatteryCharging ? 'true' : 'false',
      isLocationEnabled: isLocationEnabled ? 'true' : 'false',
      lowPowerMode: lowPowerMode ? 'true' : 'false',
      batteryLevel,
      batteryState,
    });
  }

  /*
   * Explicitly flush all log events to the server without
   * waiting for the configured flush interval.
   */
  static async flush() {
    await UserActionLogger.getInstance()._beaverLogger.flush();
  }

  /*
   * Get an instance of the logger
   */
  static getInstance(): UserActionLogger {
    if (UserActionLogger.logger == null) {
      UserActionLogger.logger = new UserActionLogger();
    }
    return this.logger;
  }

  /*
   * Initialize the logger with all async data
   */
  async init() {
    // syncronous calls
    this._applicationName = DeviceInfo.getApplicationName();
    this._brand = DeviceInfo.getBrand();
    this._buildNumber = DeviceInfo.getBuildNumber();
    this._bundleId = DeviceInfo.getBundleId();
    this._deviceId = DeviceInfo.getDeviceId();
    this._model = DeviceInfo.getModel();
    this._readableVersion = DeviceInfo.getReadableVersion();
    this._systemVersion = DeviceInfo.getSystemVersion();
    this._version = DeviceInfo.getVersion();
    this._isTablet = DeviceInfo.isTablet() ? 'true' : 'false';

    // async calls
    const apiLevel = DeviceInfo.getApiLevel();
    const availableLocationProviders = DeviceInfo.getAvailableLocationProviders();
    const buildId = DeviceInfo.getBuildId();
    const carrier = DeviceInfo.getCarrier();
    const codeName = DeviceInfo.getCodename();
    const device = DeviceInfo.getDevice();
    const display = DeviceInfo.getDisplay();
    const devicename = DeviceInfo.getDeviceName();
    const firstInstallTime = DeviceInfo.getFirstInstallTime();
    const freeDiskStorage = DeviceInfo.getFreeDiskStorage();
    const hardware = DeviceInfo.getHardware();
    const host = DeviceInfo.getHost();
    const incremental = DeviceInfo.getIncremental();
    const installerPackageName = DeviceInfo.getInstallerPackageName();
    const installReferrer = DeviceInfo.getInstallReferrer();
    const lastUpdateTime = DeviceInfo.getLastUpdateTime();
    const manufacturer = DeviceInfo.getManufacturer();
    const product = DeviceInfo.getProduct();
    const tags = DeviceInfo.getTags();
    const type = DeviceInfo.getType();
    const userAgent = DeviceInfo.getUserAgent();
    const isEmulator = DeviceInfo.isEmulator();
    const supportedAbis = DeviceInfo.supportedAbis();

    this._apiLevel = await apiLevel;
    this._availableLocationProviders = await availableLocationProviders;
    this._buildId = await buildId;
    this._carrier = await carrier;
    this._codeName = await codeName;
    this._device = await device;
    this._display = await display;
    this._devicename = await devicename;
    this._firstInstallTime = await firstInstallTime;
    this._freeDiskStorage = await freeDiskStorage;
    this._hardware = await hardware;
    this._host = await host;
    this._incremental = await incremental;
    this._installerPackageName = await installerPackageName;
    this._installReferrer = await installReferrer;
    this._lastUpdateTime = await lastUpdateTime;
    this._manufacturer = await manufacturer;
    this._product = await product;
    this._tags = await tags;
    this._type = await type;
    this._userAgent = await userAgent;
    this._isEmulator = await isEmulator;
    this._supportedAbis = await supportedAbis;

    this._asyncFieldsLoaded = true;
  }

  setFetchParams(fetchParams: FetchParams) {
    this._fetchParams = fetchParams;
  }

  setCustomPayload(payload: {[string]: string}) {
    this._customPayload = payload;
  }

  setBaseUrl(baseUrl: string) {
    this._baseUrl = baseUrl;
  }

  _logEvent(payload: LogData) {
    if (this._asyncFieldsLoaded) {
      this._sendToBeaverLogger(payload);
    } else {
      this.init().then(() => {
        console.error(
          'Consider calling UserActionLogger.getInstance().init() before attempting to use any logging functions',
        );
        this._sendToBeaverLogger(payload);
      });
    }
  }

  _sendToBeaverLogger(payload: LogData) {
    this._beaverLogger.addPayloadBuilder(payload => {
      return {
        ...this._customPayload,
        apiLevel: this._apiLevel,
        applicationName: this._applicationName,
        availableLocationProviders: JSON.stringify(
          this._availableLocationProviders,
        ),
        brand: this._brand,
        buildId: this._buildId,
        buildNumber: this._buildNumber,
        bundleId: this._bundleId,
        carrier: this._carrier,
        codeName: this._codeName,
        device: this._device,
        deviceId: this._deviceId,
        display: this._display,
        devicename: this._devicename,
        firstInstallTime: this._firstInstallTime,
        freeDiskStorage: this._freeDiskStorage,
        hardware: this._hardware,
        host: this._host,
        incremental: this._incremental,
        installerPackageName: this._installerPackageName,
        installReferrer: this._installReferrer,
        lastUpdateTime: this._lastUpdateTime,
        manufacturer: this._manufacturer,
        model: this._model,
        product: this._product,
        readableVersion: this._readableVersion,
        systemVersion: this._systemVersion,
        tags: this._tags,
        type: this._type,
        userAgent: this._userAgent,
        versionString: this._version,
        isEmulator: this._isEmulator,
        isTablet: this._isTablet,
        supportedAbis: JSON.stringify(this._supportedAbis),
        ...payload,
      };
    });

    this._beaverLogger.info(payload.eventType, payload);
  }
}

export default UserActionLogger;
