/* eslint-disable @typescript-eslint/no-var-requires */
// Automatically exclude all node_modules from the bundled version
const { nodeExternalsPlugin } = require('esbuild-node-externals');

module.exports = {
  entryPoints: ['./src/app.ts'],
  outdir: './dist',
  bundle: true,
  minify: false,
  platform: 'node',
  sourcemap: true,
  target: 'node16',
  plugins: [
    nodeExternalsPlugin({
      allowList: ['@checkbox/core'],
    }),
  ],
};
