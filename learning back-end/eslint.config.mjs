import globals from 'globals'
import js from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'

export default [
  js.configs.recommended,
  {
    files: ['**/*.js'], // looks through all the .js files
    languageOptions: {
      sourceType: 'commonjs', // CommonJS is the method used by Node.js
      globals: { ...globals.node,
                 ...globals.browser,
       }, // Node.js globals like process
      ecmaVersion: 'latest', // latest JS features
    },
    plugins: {
      '@stylistic': stylistic,
    },
    rules: {
      '@stylistic/indent': ['error', 2],
      '@stylistic/linebreak-style': ['error', 'unix'],
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/semi': ['error', 'never'],
    },

  },
]
