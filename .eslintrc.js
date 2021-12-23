module.exports = {
  root: true,
  extends: ['next/core-web-vitals', '@metamask/eslint-config'],
  ignorePatterns: ['node_modules/**', 'dist/**'],
  rules: {
    // Allow `x != null` checks
    'no-eq-null': 'off',
    'no-negated-condition': 'off',
  },
  overrides: [
    {
      files: [
        '.eslintrc.js',
        'next.config.js',
        'postcss.config.js',
        'tailwind.config.js',
      ],
      extends: ['@metamask/eslint-config-nodejs'],
      rules: {
        'node/no-unpublished-import': 'off',
        'node/no-unpublished-require': 'off',
      },
    },
    {
      files: [
        'next-env.d.ts',
        'src/**/*.js',
        'src/**/*.jsx',
        'src/**/*.ts',
        'src/**/*.tsx',
        'src/types.d.ts',
      ],
      extends: [
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        '@metamask/eslint-config-typescript',
      ],
      env: {
        browser: true,
        node: true,
      },
      globals: {
        event: 'off',
        name: 'off',
        status: 'off',
      },
      rules: {
        'import/no-unassigned-import': 'off',
        'import/unambiguous': 'off',
        // Allow ///-comment type declarations
        'spaced-comment': 'off',
        'react/no-unescaped-entities': 'off',
        'react/no-unused-prop-types': 'error',
        'react/no-unused-state': 'error',
        'react/jsx-boolean-value': 'error',
        'react/jsx-curly-brace-presence': [
          'error',
          { props: 'never', children: 'never' },
        ],
        'react/no-deprecated': 'error',
        'react/default-props-match-prop-types': 'error',
        'react/jsx-no-duplicate-props': 'error',
        // Doesn't matter whether we use types or interfaces, they're both valid
        '@typescript-eslint/consistent-type-definitions': 'off',
      },
      // Needed? Who knows
      settings: {
        'import/resolver': {
          typescript: {},
        },
      },
    },
  ],
};
