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

import {useEffect, useState} from 'react';

export default function(useResource: () => void) {
  const [resourceAcquired, setResourceAcquired] = useState(false);

  // Unlike traditional locks, operations that fail to grab lock are skipped.
  useEffect(() => {
    if (resourceAcquired) {
      useResource();
    }
  }, [resourceAcquired, useResource]);

  const acquireResource = () => {
    setResourceAcquired(true);
  };

  const releaseResource = () => {
    setResourceAcquired(false);
  };

  return {
    runOrSkip: acquireResource,
    release: releaseResource,
  };
}
