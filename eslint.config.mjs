import js from '@eslint/js'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import prettier from 'eslint-plugin-prettier'
import jest from 'eslint-plugin-jest'

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    ignores: [
      'node_modules',
      'dist',
      '.eslintrc.json',
      '.eslintignore',
      'jest.config.ts',
      'package.json',
      'package-lock.json',
      'yarn.lock',
      'serverless.ts',
    ],
  },
  js.configs.recommended,
  {
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2021,
      sourceType: 'module',
    },
    plugins: {
      '@typescript-eslint': tseslint,
      prettier,
      jest,
    },
    rules: {
      indent: ['error', 2, { SwitchCase: 1 }],
      semi: ['error', 'never'],
      quotes: ['error', 'single'],
      'comma-dangle': [2, 'always-multiline'],
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
      'no-useless-constructor': 'off',
      '@typescript-eslint/no-useless-constructor': 'error',
    },
  },
  {
    files: [
      '**/__tests__/**/*.[jt]s?(x)',
      '**/?(*.)+(spec|test).[tj]s?(x)',
    ],
    plugins: { jest },
    languageOptions: {
      globals: {
        jest: true,
        describe: true,
        it: true,
        expect: true,
        beforeEach: true,
        afterEach: true,
        beforeAll: true,
        afterAll: true,
        test: true,
      },
    },
  },
]
