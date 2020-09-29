/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

// This pattern will match these texts:
//   var Foo = require('Foo');
//   var Bar = require('Foo').Bar;
//   var BarFoo = require(Bar + 'Foo');
//   var {Bar, Foo} = require('Foo');
//   import type {Bar, Foo} from 'Foo';
//   import {Bar, Foo} from 'Foo';
//   } from 'Foo';
// Also supports 'let' and 'const'.
const variableNamePattern = String.raw`\s*[a-zA-Z_$][a-zA-Z_$\d]*\s*`;
const atLeastOneVariablePattern =
  '\\{?' + variableNamePattern + '(?:,' + variableNamePattern + ')*\\}?';
const importStatement =
  String.raw`^(?:var|let|const|import type|import)\s+` +
  atLeastOneVariablePattern;
const maxLenIgnorePattern =
  '(?:' +
  importStatement +
  '|\\})' +
  String.raw`\s*(?:=\s*require\(|from)[a-zA-Z_+./"'\s\d\-]+\)?[^;\n]*[;\n]`;
const path = require('path');
const {buildSchema, printSchema} = require('graphql');
const fs = require('fs');

// This file should be copied from an up-to-date version from the symphony schema
const schemaPath = path.resolve(
  __dirname,
  './src/Platform/Relay/symphony.graphql',
);

const schemaFile = fs.readFileSync(schemaPath, {encoding: 'utf8'});
const schemaObject = buildSchema(schemaFile);
const schemaString = printSchema(schemaObject);
const templateStrings = [
  'error',
  {
    env: 'relay',
    schemaString: schemaString,
    tagName: 'graphql',
  },
];
const noDeprecatedFields = [
  'error',
  {
    env: 'relay',
    schemaString: schemaString,
    tagName: 'graphql',
  },
];

module.exports = {
  extends: 'eslint-config-fbcnms',
  env: {
    node: true,
    jest: true,
  },
  plugins: ['react-hooks', 'graphql', 'relay'],
  parser: 'babel-eslint',
  rules: {
    // Because of this behavior:
    // https://github.com/eslint/eslint/issues/6361#issuecomment-353750861
    // We have to copy the complete rule from the base config.
    'max-len': [
      'warn',
      100,
      {
        ignorePattern: maxLenIgnorePattern,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreUrls: true,
      },
    ],

    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error',
    'react/prefer-read-only-props': 1,

    'flowtype/no-weak-types': 'off',
    'flowtype/require-valid-file-annotation': [
      2,
      'always',
      {
        annotationStyle: 'block',
        strict: true,
      },
    ],

    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/default.md#when-not-to-use-it
    'import/default': 'off',

    // There is currently an issue with 'import/named' being able to resolve components in 'react-native'.
    // Disabling this rule until the issue is fixed.  Note: Flow essentially performs this rule anyway.
    // TODO: Enable once the issue is fixed.
    'import/named': 'off',

    // Enforcing Linux's end of line style
    'prettier/prettier': [
      2,
      {
        endOfLine: 'lf',
        singleQuote: true,
        trailingComma: 'all',
        bracketSpacing: false,
        jsxBracketSameLine: true,
      },
    ],

    // GraphQL query validation
    'graphql/template-strings': templateStrings,
    'graphql/no-deprecated-fields': noDeprecatedFields,

    // Relay
    'relay/graphql-syntax': 'error',
    'relay/generated-flow-types': 'warn',
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      node: {
        paths: [path.resolve(__dirname, 'src')],
      },
    },
    node: {
      resolvePaths: ['.'],
      tryExtensions: ['.js'],
    },
  },
  globals: {
    __DEV__: true,
  },
};
