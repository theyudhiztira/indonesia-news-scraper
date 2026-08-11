import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['src/index.ts'],
    format: ['cjs'],
    outDir: 'dist/cjs',
    dts: true,
    clean: true,
    sourcemap: true,
    platform: 'node',
    target: 'node18',
    splitting: false,
  },
  {
    entry: ['src/index.ts'],
    format: ['esm'],
    outDir: 'dist/esm',
    dts: true,
    clean: false,
    sourcemap: true,
    platform: 'node',
    target: 'node18',
    splitting: false,
  },
]);
