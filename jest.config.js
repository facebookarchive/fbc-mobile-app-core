/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

'use strict';

module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|crc|react-navigation)/)',
  ],
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  collectCoverageFrom: [
    '**/packages/**/*.js',
    '**/src/**/*.js',
    '**/scripts/**/*.js',
    '!**/__tests__/**',
    '!**/node_modules/**',
  ],
  reporters: ['default', 'jest-junit'],
  modulePathIgnorePatterns: ['__tests__/__mocks__'],
  coverageReporters: ['json', 'html'],
  testPathIgnorePatterns: ['/node_modules/'],
  setupFilesAfterEnv: ['jest-extended', './jest/jest.setup.js'],
};
