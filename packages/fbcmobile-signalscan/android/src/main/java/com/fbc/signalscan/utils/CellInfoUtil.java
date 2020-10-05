/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

package com.fbc.signalscan.utils;

import android.telephony.CellIdentityCdma;
import android.telephony.CellIdentityGsm;
import android.telephony.CellIdentityLte;
import android.telephony.CellIdentityWcdma;
import android.telephony.CellInfo;
import android.telephony.CellInfoCdma;
import android.telephony.CellInfoGsm;
import android.telephony.CellInfoLte;
import android.telephony.CellInfoWcdma;
import android.telephony.TelephonyManager;
import android.util.Log;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.Nullable;

public class CellInfoUtil {
  private static final String TAG = "CellInfoUtil";

  /**
   * Gets all available cell info.
   *
   * @return the list of all available cell info or null if there is none.
   */
  @Nullable
  public static List<CellInfo> getAllCellInfoOrNull(TelephonyManager teleManager) {
    try {
      return filterCellsWithNullIds(teleManager.getAllCellInfo());
    } catch (SecurityException ex) {
      Log.e(TAG, "SecurityException was caught", ex);
      return null;
    }
  }

  /**
   * Filter out cell infos with invalid Cell IDs.
   *
   * @param cellScanList list of cell info
   * @return filtered cell infos
   */
  private static List<CellInfo> filterCellsWithNullIds(List<CellInfo> cellScanList) {
    if (cellScanList == null) {
      Log.d(TAG, "cellScanList was null");
      return null;
    }
    List<CellInfo> validCellScanList = new ArrayList<>(cellScanList.size());
    for (CellInfo cell : cellScanList) {
      boolean isValid = false;
      if (cell instanceof CellInfoCdma) {
        CellInfoCdma cdmaCell = (CellInfoCdma) cell;
        CellIdentityCdma cellId = cdmaCell.getCellIdentity();
        isValid =
            cellId != null
                && cellId.getBasestationId() != Integer.MAX_VALUE
                && cellId.getSystemId() != Integer.MAX_VALUE
                && cellId.getNetworkId() != Integer.MAX_VALUE;
      } else if (cell instanceof CellInfoGsm) {
        CellInfoGsm gsmCell = (CellInfoGsm) cell;
        CellIdentityGsm id = gsmCell.getCellIdentity();
        isValid =
            id != null
                && id.getCid() != Integer.MAX_VALUE
                && id.getLac() != Integer.MAX_VALUE
                && id.getMcc() != Integer.MAX_VALUE
                && id.getMnc() != Integer.MAX_VALUE
                && !(id.getMcc() == 0 && id.getMnc() == 0);
      } else if (cell instanceof CellInfoLte) {
        CellInfoLte lteCell = (CellInfoLte) cell;
        CellIdentityLte id = lteCell.getCellIdentity();
        isValid =
            id != null
                && id.getCi() != Integer.MAX_VALUE
                && id.getMcc() != Integer.MAX_VALUE
                && id.getMnc() != Integer.MAX_VALUE
                && !(id.getMcc() == 0 && id.getMnc() == 0);
      } else if (cell instanceof CellInfoWcdma) {
        CellInfoWcdma wcdmaCell = (CellInfoWcdma) cell;
        CellIdentityWcdma id = wcdmaCell.getCellIdentity();
        isValid =
            id != null
                && id.getCid() != Integer.MAX_VALUE
                && id.getLac() != Integer.MAX_VALUE
                && id.getMcc() != Integer.MAX_VALUE
                && id.getMnc() != Integer.MAX_VALUE
                && !(id.getMcc() == 0 && id.getMnc() == 0);
      }
      if (isValid) {
        validCellScanList.add(cell);
      }
    }
    return validCellScanList;
  }
}
