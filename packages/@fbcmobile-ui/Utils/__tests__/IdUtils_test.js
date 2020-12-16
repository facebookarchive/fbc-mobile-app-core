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

import {
  TEMP_ID_PREFIX,
  generateTempId,
  isTempId,
} from "@fbcmobile/ui/Utils/IdUtils";
import shortid from "shortid";

describe("IdUtils tests", () => {
  test("Test generate temp id", () => {
    const id = generateTempId();
    expect(id).toContain(TEMP_ID_PREFIX + "_");
  });

  test("Test is temp id", () => {
    const isId = isTempId(TEMP_ID_PREFIX + "_" + shortid.generate());
    expect(isId).toBeTrue();
  });
});
