import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { globalIgnores } from 'eslint/config'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist', 'src/templates','tests','playwright.config.ts']),

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    files: ['**/*.{ts,tsx}'],

    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'react-dom': reactDom,
    },

    rules: {
      ...reactHooks.configs.recommended.rules,
      ...reactRefresh.configs.vite.rules,
      ...reactDom.configs.recommended.rules,

      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: true,
        },
      ],

      '@typescript-eslint/no-empty-object-type': 'error',
      'import/prefer-default-export': 'off',
    },

    languageOptions: {
      parserOptions: {
        project: [
          './tsconfig.node.json',
          './tsconfig.app.json',
          './tsconfig.test.json',
        ],
        tsconfigRootDir: import.meta.dirname,
      },

      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
])