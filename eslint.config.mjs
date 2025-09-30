// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';

/**
 * We use a JavaScript file for the eslint config (instead of a JSON file) as it supports
 * comments that can be used to better describe rules and allows us to write some logic.
 *
 * This config lints both TS and JS. Shared rules are defined below, and any additional rules specific
 * to either TS or JS are specified in addition to those.
 *
 * This config uses Prettier as an ESLint rule. The advantage of having prettier setup as an
 * ESLint rule using eslint-plugin-prettier is that JS and TS code can automatically be fixed using ESLint's --fix option.
 *
 * From the command line, type `npm run lint` to run ESLint manually. This script will run ESLint through all
 * the .js, .ts, .jsx and .tsx (used with React) files. Any ESLint errors that can be automatically fixed will
 * be fixed with this command, but any other errors will be printed out in the command line.
 */
export default [
  {
    ignores: [
      '.cache/',
      'public/',
      'node_modules/',
      'firebase/functions/lib/',
      'lib/',
      'dist/',
      '**/*.js.old', // Ignoring old config files
    ],
  },

  eslint.configs.recommended,
  ...tseslint.configs.recommended,

  {
    files: ['**/*.{js,jsx,mjs,ts,tsx}'],
    plugins: {
      react: pluginReact,
      'react-hooks': pluginReactHooks,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...pluginReact.configs.recommended.rules,
      ...pluginReactHooks.configs.recommended.rules,
      'react/display-name': 'off',
      'react/prop-types': 'off',
      'react/no-unescaped-entities': 'off',
    },
  },

  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-empty-object-type': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-var-requires': 'off',
    },
  },

  {
    files: ['**/*.{js,jsx,mjs}'],
    rules: {
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'prettier/prettier': 'warn',
    },
  },

  eslintPluginPrettierRecommended,
];
