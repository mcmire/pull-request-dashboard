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
      files: ['src/**/*.js', 'src/**/*.jsx'],
      extends: ['plugin:react/recommended', 'plugin:react-hooks/recommended'],
      env: {
        browser: true,
        node: true,
        es2017: true,
      },
      globals: {
        event: 'off',
        status: 'off',
      },
      parser: '@babel/eslint-parser',
      parserOptions: {
        sourceType: 'module',
        ecmaFeatures: {
          experimentalObjectRestSpread: true,
          impliedStrict: true,
          modules: true,
          blockBindings: true,
          arrowFunctions: true,
          objectLiteralShorthandMethods: true,
          objectLiteralShorthandProperties: true,
          templateStrings: true,
          classes: true,
          jsx: true,
        },
      },
      rules: {
        'import/no-unassigned-import': 'off',
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
      },
    },
  ],
};
