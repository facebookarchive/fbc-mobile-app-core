/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

package com.fbc.signalscan;

import android.Manifest;
import android.annotation.TargetApi;
import android.content.Context;
import android.content.pm.PackageManager;
import android.os.AsyncTask;
import android.os.Build;
import android.telephony.AccessNetworkConstants;
import android.telephony.CellIdentityCdma;
import android.telephony.CellIdentityGsm;
import android.telephony.CellIdentityLte;
import android.telephony.CellIdentityWcdma;
import android.telephony.CellInfo;
import android.telephony.CellInfoCdma;
import android.telephony.CellInfoGsm;
import android.telephony.CellInfoLte;
import android.telephony.CellInfoWcdma;
import android.telephony.CellLocation;
import android.telephony.CellSignalStrengthCdma;
import android.telephony.CellSignalStrengthGsm;
import android.telephony.CellSignalStrengthLte;
import android.telephony.CellSignalStrengthWcdma;
import android.telephony.NetworkScan;
import android.telephony.NetworkScanRequest;
import android.telephony.RadioAccessSpecifier;
import android.telephony.TelephonyManager;
import android.telephony.TelephonyScanManager;
import android.telephony.cdma.CdmaCellLocation;
import android.telephony.gsm.GsmCellLocation;
import android.util.Log;
import androidx.core.content.ContextCompat;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.module.annotations.ReactModule;
import com.fbc.signalscan.events.TelephonyScanManangerExceptionEvent;
import com.fbc.signalscan.utils.CellInfoUtil;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import org.greenrobot.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;

@ReactModule(name = CellScanResultsModule.TAG)
public class CellScanResultsModule extends ReactContextBaseJavaModule {
  static final String TAG = "CellScanResultsModule";
  private static final String GSM = "GSM";
  private static final String CDMA = "CDMA";
  private static final String LTE = "LTE";
  private static final String WCDMA = "WCDMA";

  private static final String CELL_FIELD_TYPE = "networkType";
  private static final String CELL_FIELD_ID = "cellID";
  private static final String CELL_FIELD_PCI = "physicalCellID";
  private static final String CELL_FIELD_BASE_STATION_ID = "baseStationID";
  private static final String CELL_FIELD_NETWORK_ID = "networkID";
  private static final String CELL_FIELD_SYSTEM_ID = "systemID";
  private static final String CELL_FIELD_DBM = "signalStrength";
  private static final String CELL_FIELD_MCC = "mobileCountryCode";
  private static final String CELL_FIELD_MNC = "mobileNetworkCode";
  private static final String CELL_FIELD_LAC = "locationAreaCode";
  private static final String CELL_FIELD_TAC = "trackingAreaCode";
  private static final String CELL_FIELD_PSC = "primaryScramblingCode";
  private static final String CELL_FIELD_ARFCN = "arfcn";
  private static final String CELL_FIELD_EARFCN = "earfcn";
  private static final String CELL_FIELD_UARFCN = "uarfcn";
  private static final String CELL_FIELD_TIMING_ADVANCE = "timingAdvance";

  private static final String ERROR_KEY = "error";
  private static final String ERROR_CODE_PERMISSION = "errorPermission";
  private static final String ERROR_PERMISSION = "READ_PHONE_STATE permission not granted";
  private static final String ERROR_CODE_TELEPHONY_MANAGER = "errorTelephonyManager";
  private static final String ERROR_TELEPHONY_MANAGER = "Telephony manager is null";
  private static final String ERROR_CODE_NO_DATA = "errorNoData";
  private static final String ERROR_NO_DATA = "getCellLocation returned no results";
  private static final String ERROR_CODE_RUNTIME_EX = "errorRuntimeEx";
  private static final String ERROR_RUNTIME_EX = "runtime error exception was thrown";

  // https://powerfulsignal.com/cell-signal-strength/
  private static final int MIN_SIGNAL_STRENGTH = -110;

  private ReactApplicationContext reactContext;
  private Promise mPromise;
  private NetworkScan mNetworkScan;

  private Thread.UncaughtExceptionHandler handler =
      new Thread.UncaughtExceptionHandler() {
        public void uncaughtException(Thread thread, Throwable ex) {
          Log.e(TAG, "Detected an uncaught exception: ", ex);
          StackTraceElement[] stackTrace = ex.getStackTrace();
          String tsmClassName = TelephonyScanManager.class.getSimpleName();
          for (StackTraceElement trace : stackTrace) {
            if (trace.getClassName().contains(tsmClassName)) {
              EventBus.getDefault()
                  .post(
                      new TelephonyScanManangerExceptionEvent(
                          "Runtime Exception caught in TelephonyScanManager"));
              break;
            }
          }
        }
      };

  CellScanResultsModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
    Thread.setDefaultUncaughtExceptionHandler(handler);
    EventBus.getDefault().register(this);
  }

  @Subscribe
  public void handleRuntimeException(TelephonyScanManangerExceptionEvent event) {
    WritableMap map = Arguments.createMap();
    map.putString(ERROR_KEY, ERROR_CODE_RUNTIME_EX);
    Log.d(TAG, ERROR_RUNTIME_EX);
    if (this.mPromise != null) {
      Log.d(TAG, "runtime exception was caught in telephony stack so resolve the promise");
      this.mPromise.resolve(map);
    }
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
    return constants;
  }

  @ReactMethod
  public void stopCellScan() {
    if (this.mNetworkScan != null) {
      Log.d(TAG, "stopping cell scan");
      this.mNetworkScan.stopScan();
    }
  }

  @ReactMethod
  public void getCellScanResults(Promise promise) {
    this.mPromise = promise;
    Context context = reactContext.getApplicationContext();

    if (ContextCompat.checkSelfPermission(context, Manifest.permission.READ_PHONE_STATE)
        != PackageManager.PERMISSION_GRANTED) {
      WritableMap map = Arguments.createMap();
      map.putString(ERROR_KEY, ERROR_CODE_PERMISSION);
      Log.d(TAG, ERROR_PERMISSION);
      this.mPromise.resolve(map);
      return;
    }

    TelephonyManager teleManager =
        (TelephonyManager) context.getSystemService(Context.TELEPHONY_SERVICE);

    if (teleManager == null) {
      WritableMap map = Arguments.createMap();
      map.putString(ERROR_KEY, ERROR_CODE_TELEPHONY_MANAGER);
      Log.d(TAG, ERROR_TELEPHONY_MANAGER);
      this.mPromise.resolve(map);
      return;
    }

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P
        && (teleManager.hasCarrierPrivileges()
            || ContextCompat.checkSelfPermission(context, Manifest.permission.MODIFY_PHONE_STATE)
                == PackageManager.PERMISSION_GRANTED)) {
      scanAllNetworks(teleManager);
    } else {
      scanRegisteredNetwork(teleManager);
    }
  }

  @TargetApi(Build.VERSION_CODES.P)
  private void scanAllNetworks(final TelephonyManager teleManager) {
    Log.d(TAG, "performing network scan using scanAllNetworks()");
    RadioAccessSpecifier[] radioAccesses = {
      /* gsm */
      new RadioAccessSpecifier(AccessNetworkConstants.AccessNetworkType.GERAN, null, null),
      /* lte */
      new RadioAccessSpecifier(AccessNetworkConstants.AccessNetworkType.EUTRAN, null, null),
      /* wcdma */
      new RadioAccessSpecifier(AccessNetworkConstants.AccessNetworkType.UTRAN, null, null)
    };

    class NetworkScanCallback extends TelephonyScanManager.NetworkScanCallback {

      private Promise promise;
      private List<CellInfo> cellList;

      private NetworkScanCallback(Promise promise) {
        super();
        this.promise = promise;
      }

      @Override
      public void onResults(List<CellInfo> results) {
        Log.d(TAG, String.format("receive network scan results: %s", results.toString()));
        this.cellList = results;
      }

      @Override
      public void onError(int error) {
        Log.d(
            TAG,
            String.format(
                "requestNetworkScan failed with error %d, falling back to scanRegisteredNetwork()",
                error));
        scanRegisteredNetwork(teleManager);
      }

      @Override
      public void onComplete() {
        Log.d(TAG, "network scan complete");
        WritableMap map = processCellScanResults(teleManager, this.cellList);
        this.promise.resolve(map);
      }
    }

    NetworkScanRequest mRequest =
        new NetworkScanRequest(
            NetworkScanRequest.SCAN_TYPE_ONE_SHOT,
            radioAccesses,
            6, // period to restart scan (in seconds) if no network found, not used for one shot but
            // scan must be greater than 5 to pass request validation
            61, // maximum duration of search (in seconds).  Must be greater than 60
            // to pass request validation
            true, // whether to report incremental scan results, not used for one shot scan
            3, // period to report incremental scan results (in seconds)
            null // terminate scan once any network in the list is found
            );
    this.mNetworkScan =
        teleManager.requestNetworkScan(
            mRequest, AsyncTask.SERIAL_EXECUTOR, new NetworkScanCallback(this.mPromise));
  }

  private void scanRegisteredNetwork(TelephonyManager teleManager) {
    Log.d(TAG, "perform network scan using scanRegisteredNetwork()");
    List<CellInfo> cellList = CellInfoUtil.getAllCellInfoOrNull(teleManager);

    WritableMap map = processCellScanResults(teleManager, cellList);
    this.mPromise.resolve(map);
  }

  private WritableMap processCellScanResults(
      TelephonyManager teleManager, @Nullable List<CellInfo> cellList) {
    Context context = reactContext.getApplicationContext();

    WritableMap map = Arguments.createMap();

    if (cellList == null || cellList.isEmpty()) {
      Log.d(TAG, "cell scan found 0 cells, falling back to getCellLocation()");
      CellLocation cellLocation = null;
      if (ContextCompat.checkSelfPermission(context, Manifest.permission.ACCESS_FINE_LOCATION)
          == PackageManager.PERMISSION_GRANTED) {
        cellLocation = teleManager.getCellLocation();
      }
      if (cellLocation == null) {
        map.putString(ERROR_KEY, ERROR_CODE_NO_DATA);
        Log.d(TAG, ERROR_NO_DATA);
        return map;
      }
      WritableMap fields = Arguments.createMap();
      fields.putInt(CELL_FIELD_DBM, MIN_SIGNAL_STRENGTH);
      if (cellLocation instanceof GsmCellLocation) {
        Log.d(TAG, "cell is instance of GsmCellLocation");
        fields.putString(CELL_FIELD_TYPE, GSM);
        fields.putString(
            CELL_FIELD_ID, Integer.toString(((GsmCellLocation) cellLocation).getCid()));
        fields.putString(
            CELL_FIELD_LAC, Integer.toString(((GsmCellLocation) cellLocation).getLac()));
      } else if (cellLocation instanceof CdmaCellLocation) {
        Log.d(TAG, "cell is instance of CdmaCellLocation");
        fields.putString(CELL_FIELD_TYPE, CDMA);
        fields.putString(
            CELL_FIELD_ID, Integer.toString(((CdmaCellLocation) cellLocation).getBaseStationId()));
        fields.putString(
            CELL_FIELD_BASE_STATION_ID,
            Integer.toString(((CdmaCellLocation) cellLocation).getBaseStationId()));
        fields.putString(
            CELL_FIELD_NETWORK_ID,
            Integer.toString(((CdmaCellLocation) cellLocation).getNetworkId()));
        fields.putString(
            CELL_FIELD_SYSTEM_ID,
            Integer.toString(((CdmaCellLocation) cellLocation).getSystemId()));
      } else {
        fields.putString(CELL_FIELD_TYPE, "UNKNOWN");
        fields.merge(getDefaultValues());
        Log.d(TAG, "Unknown cell type");
      }
      map.putMap(Integer.toString(0), fields);
      return map;
    }

    Log.d(TAG, String.format("cell scan found %s cells", cellList.size()));
    int i = 0;
    for (CellInfo cell : cellList) {
      WritableMap fields;
      if (cell instanceof CellInfoCdma) {
        Log.d(TAG, "cell is instance of CellInfoCdma");
        fields = setCDMAInfo((CellInfoCdma) cell);
      } else if (cell instanceof CellInfoGsm) {
        Log.d(TAG, "cell is instance of CellInfoGsm");
        fields = setGSMInfo((CellInfoGsm) cell);
      } else if (cell instanceof CellInfoLte) {
        Log.d(TAG, "cell is instance of CellInfoLte");
        fields = setLTEInfo((CellInfoLte) cell);
      } else if (cell instanceof CellInfoWcdma) {
        Log.d(TAG, "cell is instance of CellInfoWcdma");
        fields = setWCDMAInfo((CellInfoWcdma) cell);
      } else {
        fields = Arguments.createMap();
        fields.putString(CELL_FIELD_TYPE, "UNKNOWN");
        fields.merge(getDefaultValues());
        Log.d(TAG, String.format("Unknown cell type: %s", cell.toString()));
      }
      map.putMap(Integer.toString(i), fields);
      i++;
    }
    return map;
  }

  private static WritableMap getDefaultValues() {
    WritableMap fields = Arguments.createMap();
    fields.putInt(CELL_FIELD_DBM, MIN_SIGNAL_STRENGTH);
    fields.putString(CELL_FIELD_ID, "0");
    fields.putString(CELL_FIELD_MNC, "0");
    return fields;
  }

  // Write fields relevant for CDMA networks
  private static WritableMap setCDMAInfo(CellInfoCdma cell) {
    WritableMap fields = Arguments.createMap();
    fields.putString(CELL_FIELD_TYPE, CDMA);
    final CellSignalStrengthCdma cdma = cell.getCellSignalStrength();
    final CellIdentityCdma identityCdma = cell.getCellIdentity();
    fields.putString(CELL_FIELD_ID, Integer.toString(identityCdma.getBasestationId()));
    fields.putInt(CELL_FIELD_DBM, cdma.getDbm() != Integer.MAX_VALUE ? cdma.getDbm() : 0);
    fields.putString(CELL_FIELD_BASE_STATION_ID, Integer.toString(identityCdma.getBasestationId()));
    fields.putString(CELL_FIELD_NETWORK_ID, Integer.toString(identityCdma.getNetworkId()));
    fields.putString(CELL_FIELD_SYSTEM_ID, Integer.toString(identityCdma.getSystemId()));
    return fields;
  }

  // Write fields relevant for GSM networks
  private static WritableMap setGSMInfo(CellInfoGsm cell) {
    WritableMap fields = Arguments.createMap();
    fields.putString(CELL_FIELD_TYPE, GSM);
    final CellSignalStrengthGsm gsm = cell.getCellSignalStrength();
    final CellIdentityGsm identityGsm = cell.getCellIdentity();
    fields.putString(CELL_FIELD_ID, Integer.toString(identityGsm.getCid()));
    fields.putInt(CELL_FIELD_DBM, gsm.getDbm() != Integer.MAX_VALUE ? gsm.getDbm() : 0);
    fields.putString(CELL_FIELD_LAC, Integer.toString(identityGsm.getLac()));
    fields.putString(CELL_FIELD_MCC, Integer.toString(identityGsm.getMcc()));
    fields.putString(CELL_FIELD_MNC, Integer.toString(identityGsm.getMnc()));
    if (Build.VERSION.SDK_INT >= 24) {
      fields.putString(CELL_FIELD_BASE_STATION_ID, Integer.toString(identityGsm.getBsic()));
      fields.putInt(CELL_FIELD_ARFCN, identityGsm.getArfcn());
    }
    if (Build.VERSION.SDK_INT >= 28) {
      fields.putString(CELL_FIELD_MCC, identityGsm.getMccString());
      fields.putString(CELL_FIELD_MNC, identityGsm.getMncString());
    }
    return fields;
  }

  // Write fields relevant for LTE networks
  private static WritableMap setLTEInfo(CellInfoLte cell) {
    WritableMap fields = Arguments.createMap();
    fields.putString(CELL_FIELD_TYPE, LTE);
    final CellSignalStrengthLte lte = cell.getCellSignalStrength();
    final CellIdentityLte identityLte = cell.getCellIdentity();
    fields.putString(CELL_FIELD_ID, Integer.toString(identityLte.getCi()));
    fields.putInt(CELL_FIELD_DBM, lte.getDbm() != Integer.MAX_VALUE ? lte.getDbm() : 0);
    fields.putString(CELL_FIELD_PCI, Integer.toString(identityLte.getPci()));
    fields.putString(CELL_FIELD_TAC, Integer.toString(identityLte.getTac()));
    fields.putInt(CELL_FIELD_TIMING_ADVANCE, lte.getTimingAdvance());
    fields.putString(CELL_FIELD_MCC, Integer.toString(identityLte.getMcc()));
    fields.putString(CELL_FIELD_MNC, Integer.toString(identityLte.getMnc()));
    if (Build.VERSION.SDK_INT >= 24) {
      fields.putInt(CELL_FIELD_EARFCN, identityLte.getEarfcn());
    }
    if (Build.VERSION.SDK_INT >= 28) {
      fields.putString(CELL_FIELD_MCC, identityLte.getMccString());
      fields.putString(CELL_FIELD_MNC, identityLte.getMncString());
    }
    return fields;
  }

  // Write fields relevant for WCDMA networks
  private static WritableMap setWCDMAInfo(CellInfoWcdma cell) {
    WritableMap fields = Arguments.createMap();
    fields.putString(CELL_FIELD_TYPE, WCDMA);
    final CellSignalStrengthWcdma wcdma = cell.getCellSignalStrength();
    final CellIdentityWcdma identityWcdma = cell.getCellIdentity();
    fields.putString(CELL_FIELD_ID, Integer.toString(identityWcdma.getCid()));
    fields.putInt(CELL_FIELD_DBM, wcdma.getDbm() != Integer.MAX_VALUE ? wcdma.getDbm() : 0);
    fields.putString(CELL_FIELD_LAC, Integer.toString(identityWcdma.getLac()));
    fields.putString(CELL_FIELD_MCC, Integer.toString(identityWcdma.getMcc()));
    fields.putString(CELL_FIELD_MNC, Integer.toString(identityWcdma.getMnc()));
    fields.putString(CELL_FIELD_PSC, Integer.toString(identityWcdma.getPsc()));
    if (Build.VERSION.SDK_INT >= 24) {
      fields.putInt(CELL_FIELD_UARFCN, identityWcdma.getUarfcn());
    }
    if (Build.VERSION.SDK_INT >= 28) {
      fields.putString(CELL_FIELD_MCC, identityWcdma.getMccString());
      fields.putString(CELL_FIELD_MNC, identityWcdma.getMncString());
    }
    return fields;
  }
}
