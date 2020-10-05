/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

package com.fbc.signalscan;

import android.Manifest;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.wifi.ScanResult;
import android.net.wifi.WifiManager;
import android.provider.Settings;
import android.util.Log;
import androidx.core.content.ContextCompat;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.module.annotations.ReactModule;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.annotation.Nonnull;
import javax.annotation.Nullable;

@ReactModule(name = WiFiScanResultsModule.TAG)
public class WiFiScanResultsModule extends ReactContextBaseJavaModule {
  static final String TAG = "WiFiScanResultsModule";

  // Constants from https://en.wikipedia.org/wiki/List_of_WLAN_channels
  private static final int LOW_2_DOT_4GHZ = 2412;
  private static final int HIGH_2_DOT_4GHZ = 2484;
  private static final int LOW_3_DOT_65GHZ = 3655;
  private static final int HIGH_3_DOT_65GHZ = 3695;
  private static final int LOW_4_DOT_9GHZ = 4940;
  private static final int HIGH_4_DOT_9GHZ = 4990;
  private static final int LOW_5GHZ = 5030;
  private static final int HIGH_5GHZ = 5875;

  private static final String ERROR_KEY = "error";
  private static final String ERROR_CODE_PERMISSION = "error_permission";
  private static final String ERROR_PERMISSION = "ACCESS_FINE_LOCATION permission not granted";
  private static final String ERROR_CODE_WIFI_MANAGER = "error_wifi_manager";
  private static final String ERROR_WIFI_MANAGER = "Cannot get WifiManager";
  private static final String ERROR_CODE_WIFI_DISABLED = "error_wifi_disabled";
  private static final String ERROR_WIFI_DISABLED = "WiFi disabled";
  private static final String ERROR_ACTIVITY_DOES_NOT_EXIST = "error_activity_does_not_exist";
  private static final String ERROR_FAILED_TO_SHOW_WIFI_SETTINGS =
      "error_failed_to_show_wifi_settings";
  private static final String WIFI_SETTINGS_OPENED = "wifi_settings_opened";

  private ReactApplicationContext reactContext;

  WiFiScanResultsModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @Nonnull
  @Override
  public String getName() {
    return TAG;
  }

  @Nullable
  @Override
  public Map<String, Object> getConstants() {
    Map<String, Object> constants = new HashMap<>();
    constants.put("ERROR_KEY", ERROR_KEY);
    constants.put("ERROR_CODE_PERMISSION", ERROR_CODE_PERMISSION);
    constants.put("ERROR_CODE_WIFI_MANAGER", ERROR_CODE_WIFI_MANAGER);
    constants.put("ERROR_CODE_WIFI_DISABLED", ERROR_CODE_WIFI_DISABLED);
    constants.put("ERROR_FAILED_TO_SHOW_WIFI_SETTINGS", ERROR_FAILED_TO_SHOW_WIFI_SETTINGS);
    constants.put("WIFI_SETTINGS_OPENED", WIFI_SETTINGS_OPENED);
    return constants;
  }

  @ReactMethod
  public void getNetworkScanResults(Promise promise) {
    Context context = reactContext.getApplicationContext();

    // Prepare Writable Map for ScanResults
    WritableMap map = Arguments.createMap();

    if (ContextCompat.checkSelfPermission(context, Manifest.permission.ACCESS_FINE_LOCATION)
        != PackageManager.PERMISSION_GRANTED) {
      map.putString(ERROR_KEY, ERROR_CODE_PERMISSION);
      promise.resolve(map);
      Log.d(TAG, ERROR_PERMISSION);
      return;
    }

    WifiManager wifiManager = (WifiManager) context.getSystemService(Context.WIFI_SERVICE);
    if (wifiManager == null) {
      map.putString(ERROR_KEY, ERROR_CODE_WIFI_MANAGER);
      promise.resolve(map);
      Log.d(TAG, ERROR_WIFI_MANAGER);
      return;
    }

    if (!wifiManager.isWifiEnabled()) {
      map.putString(ERROR_KEY, ERROR_CODE_WIFI_DISABLED);
      promise.resolve(map);
      Log.d(TAG, ERROR_WIFI_DISABLED);
      return;
    }

    // Level of a Scan Result
    List<ScanResult> wifiList = wifiManager.getScanResults();
    for (ScanResult scanResult : wifiList) {
      WritableMap fields = Arguments.createMap();
      int level = WifiManager.calculateSignalLevel(scanResult.level, 5);
      fields.putString("ssid", scanResult.SSID);
      fields.putInt("strength", level);
      fields.putString("bssid", scanResult.BSSID);
      fields.putString("capabilities", scanResult.capabilities);
      fields.putInt("frequency", scanResult.frequency);
      fields.putInt("channel", getChannelFromFrequency(scanResult.frequency));
      fields.putString("band", getBandFromFrequency(scanResult.frequency));
      // Need API 23 for channelWidth
      if (android.os.Build.VERSION.SDK_INT >= 23) {
        fields.putInt("channelWidth", scanResult.channelWidth);
      }
      fields.putDouble("timestamp", scanResult.timestamp);
      map.putMap(scanResult.BSSID, fields);
    }
    promise.resolve(map);
  }

  @ReactMethod
  public void navigateToWiFiSettings(Promise promise) {
    Activity currentActivity = getCurrentActivity();

    if (currentActivity == null) {
      promise.resolve(ERROR_ACTIVITY_DOES_NOT_EXIST);
    }

    try {
      currentActivity.startActivity(new Intent(Settings.ACTION_WIFI_SETTINGS));
      promise.resolve(WIFI_SETTINGS_OPENED);
    } catch (Exception e) {
      promise.resolve(ERROR_FAILED_TO_SHOW_WIFI_SETTINGS);
    }
  }

  private static String getBandFromFrequency(int frequency) {
    if (frequency >= LOW_2_DOT_4GHZ && frequency <= HIGH_2_DOT_4GHZ) {
      return "2.4GHz";
    }
    if (frequency >= LOW_3_DOT_65GHZ && frequency <= HIGH_3_DOT_65GHZ) {
      return "3.65GHz";
    }
    if (frequency >= LOW_4_DOT_9GHZ && frequency <= HIGH_4_DOT_9GHZ) {
      return "4.9GHz";
    }
    if (frequency >= LOW_5GHZ && frequency <= HIGH_5GHZ) {
      return "5GHz";
    }
    // Just return empty string if we don't know the band
    return "";
  }

  // Using the 802.11--2012 standard
  private static int getChannelFromFrequency(int frequency) {
    // Hardcode channel 14 to 2482 which is designated for Japan
    if (frequency == HIGH_2_DOT_4GHZ) {
      return 14;
    }

    // Frequencies between 2412MHz and 2484MHz are in the 2.4GHz range.  The
    // starting freqency in that range is 2412 so we use that to calculate
    // the channel which has 5MHz width.
    if (frequency < HIGH_2_DOT_4GHZ) {
      return (frequency - LOW_2_DOT_4GHZ) / 5 + 1;
    }

    // Frequencies in the 5GHz range
    if (frequency > LOW_5GHZ && frequency < HIGH_5GHZ) {
      return frequency / 5 - 1000;
    }

    // Outside the 2.4GHz and 5GHz range we'll just return zero for the channel
    return 0;
  }
}
