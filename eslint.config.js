import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/coverage/**',
      '**/docs/**',
      '**/jsdoc/**',
      '**/templates/**',
      '**/tmp/**',
      '**/postgres-data/**',
      '**/venv/**',
      '**/.eslintrc.js',
      '**/esbuild.config.js',
      '**/esbuild-watch.config.js',
      '**/esbuild.base.js',
    ],
  },
];
