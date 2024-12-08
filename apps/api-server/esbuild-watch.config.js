/* eslint-disable @typescript-eslint/no-var-requires */
const esbuild = require('esbuild');

const baseOptions = require('./esbuild.base');
esbuild
  .context(baseOptions)
  .then((ctx) => {
    return ctx.watch();
  })
  .then((result) => console.log('watch build succeeded:', result))
  .catch((error) => {
    console.error('watch build failed:', error);
    process.exit(1);
  });
