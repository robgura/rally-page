import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [...compat.extends('eslint:recommended'), {
    languageOptions: {
        globals: {
            ...globals.browser,
        },

        ecmaVersion: 12,
        sourceType: 'module',
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
        'one-var': ['error', 'never'],
        'one-var-declaration-per-line': ['error', 'always'],
        'quotes': ['error', 'single', { 'avoidEscape': true }],
        'radix': ['error'],
        'semi': ['error', 'always'],
        'semi-spacing': ['error'],
        // should be changed to error eventually
        'space-before-blocks': ['error'],
        'space-before-function-paren': ['error', { 'anonymous': 'never', 'named': 'never', 'asyncArrow': 'always' }],
        'space-infix-ops': ['error'],
        'space-in-parens': ['error'],
        'space-unary-ops': ['error', { 'words': true, 'overrides': { '!': false, } }],
    },
}];
