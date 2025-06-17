
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import globals from 'globals';
import js from '@eslint/js';
import reactPlugin from 'eslint-plugin-react';
import importPlugin from 'eslint-plugin-import';
import reactHooksPlugin from 'eslint-plugin-react-hooks';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default [
    js.configs.recommended,
    importPlugin.flatConfigs.recommended,
    reactPlugin.configs.flat.recommended,
    reactPlugin.configs.flat['jsx-runtime'], // not importing react in modules since it is available globally from the CDN
    {
        languageOptions: {
            globals: {
                ...globals.browser,
            },

            ecmaVersion: 12,
            sourceType: 'module',
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },

        plugins: {
            react: reactPlugin,
            'react-hooks': reactHooksPlugin,
        },

        rules: {
            'array-bracket-spacing': ['error', 'never'],
            'arrow-spacing': ['error'],
            'block-scoped-var': ['error'],
            'block-spacing': ['error'],
            'brace-style': ['error', 'stroustrup', { 'allowSingleLine': true }],
            'camelcase': ['off'],
            'comma-spacing': ['error', { 'after': true }],
            'computed-property-spacing': ['error'],
            'curly': ['error'],
            'dot-notation': ['error'],
            'eol-last': ['error', 'always'],
            'eqeqeq': ['error'],
            'func-call-spacing': ['error'],
            'import/extensions': ['error', 'ignorePackages'],
            'import/no-duplicates': ['error'],
            'import/order': ['warn'],
            'indent-legacy': ['error', 4],
            'key-spacing': ['error'],
            'keyword-spacing': ['error', { 'after': true }],
            'linebreak-style': ['error', 'unix'],
            'max-depth': ['error', { 'max': 4 }],
            'no-console': ['warn', { 'allow': ['warn', 'error'] }],
            'no-duplicate-imports': ['error'],
            'no-else-return': ['error'],
            'no-extra-bind': ['error'],
            'no-floating-decimal': ['error'],
            'no-implicit-globals': ['error'],
            'no-irregular-whitespace': ['error'],
            'no-lone-blocks': ['error'],
            'no-loop-func': ['error'],
            'no-multiple-empty-lines': ['warn', { 'max': 1, 'maxEOF': 0 }],
            'no-multi-spaces': ['warn', { ignoreEOLComments: true }],
            'no-plusplus': ['error'],
            'no-shadow': ['error'],
            'no-shadow-restricted-names': ['error'],
            'no-trailing-spaces': ['error'],
            'no-unneeded-ternary': ['error', { 'defaultAssignment': false }],
            'no-unused-expressions': ['error'],
            'no-unused-vars': ['warn', { 'argsIgnorePattern': '^_', 'caughtErrorsIgnorePattern': '^_', 'destructuredArrayIgnorePattern': '^_', 'varsIgnorePattern': '^_', }],
            'no-use-before-define': ['error'],
            'no-useless-return': ['error'],
            'no-var': ['error'],
            'no-whitespace-before-property': ['error'],
            'object-curly-newline': ['error'],
            'object-curly-spacing': ['error', 'always'],
            'one-var-declaration-per-line': ['error', 'always'],
            'one-var': ['error', 'never'],
            'quotes': ['error', 'single', { 'avoidEscape': true }],
            'radix': ['error'],
            'react-hooks/exhaustive-deps': 'warn',
            'react-hooks/rules-of-hooks': 'error',
            'react/prop-types': ['off'],
            'semi': ['error', 'always'],
            'semi-spacing': ['error'],
            // should be changed to error eventually
            'space-before-blocks': ['error'],
            'space-before-function-paren': ['error', { 'anonymous': 'never', 'named': 'never', 'asyncArrow': 'always' }],
            'space-infix-ops': ['error'],
            'space-in-parens': ['error'],
            'space-unary-ops': ['error', { 'words': true, 'overrides': { '!': false, } }],
        },
    }
];
