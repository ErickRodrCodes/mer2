import baseConfig from '../../eslint.config.mjs';

export default [
  ...baseConfig,
  {
    ignores: [
      '**/*.html',
    ],
  },
  {
    files: ['**/*.ts'],
    rules: {},
  },
  {
    files: ['**/*.html'],
    // Override or add rules here
    rules: {},
  },
];
