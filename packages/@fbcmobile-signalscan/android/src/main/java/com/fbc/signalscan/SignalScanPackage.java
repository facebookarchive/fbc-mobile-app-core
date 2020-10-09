/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

package com.fbc.signalscan;

// import com.facebook.react.TurboReactPackage;
// import com.facebook.react.bridge.NativeModule;
// import com.facebook.react.bridge.ReactApplicationContext;
// import com.facebook.react.module.annotations.ReactModule;
// import com.facebook.react.module.model.ReactModuleInfo;
// import com.facebook.react.module.model.ReactModuleInfoProvider;
// import java.util.ArrayList;
// import java.util.Arrays;
// import java.util.HashMap;
// import java.util.List;
// import java.util.Map;

// public class SignalcanPackage extends TurboReactPackage {
//   @Override
//   public NativeModule getModule(String name, ReactApplicationContext reactContext) {
//     switch (name) {
//       case WiFiScanResultsModule.TAG:
//         return new WiFiScanResultsModule(reactContext);
//       default:
//         return null;
//     }
//   }

//   @Override
//   public ReactModuleInfoProvider getReactModuleInfoProvider() {
//     List<Class<? extends NativeModule>> classes =
//         new ArrayList<>(Arrays.asList(WiFiScanResultsModule.class));

//     final Map<String, ReactModuleInfo> reactModuleInfoMap = new HashMap<>();
//     for (Class<? extends NativeModule> moduleClass : classes) {
//       ReactModule module = moduleClass.getAnnotation(ReactModule.class);
//       if (module == null) {
//         continue;
//       }
//       reactModuleInfoMap.put(
//           module.name(),
//           new ReactModuleInfo(
//               module.name(),
//               moduleClass.getName(),
//               module.canOverrideExistingModule(),
//               module.needsEagerInit(),
//               module.hasConstants(),
//               module.isCxxModule(),
//               false));
//     }

//     return () -> reactModuleInfoMap;
//   }
// }

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class SignalScanPackage implements ReactPackage {
  @Override
  public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
    return Arrays.<NativeModule>asList(
        new CellScanResultsModule(reactContext), new WiFiScanResultsModule(reactContext));
  }

  @Override
  public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
    return Collections.emptyList();
  }
}
