/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

package com.fbc.signalscan.events;

public class TelephonyScanManangerExceptionEvent {

  public final String message;

  public TelephonyScanManangerExceptionEvent(String message) {
    this.message = message;
  }
}
