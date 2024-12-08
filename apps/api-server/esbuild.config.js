/* eslint-disable @typescript-eslint/no-var-requires */
const esbuild = require('esbuild');

const baseOptions = require('./esbuild.base');
esbuild
  .context(baseOptions)
  .then(async (ctx) => {
    const result = await ctx.rebuild();
    console.log('esbuild done:', result);
    return await ctx.dispose();
  })
  .catch(() => process.exit(1));
