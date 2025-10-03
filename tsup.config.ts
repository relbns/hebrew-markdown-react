import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  external: ['react', 'react-dom'],
  noExternal: ['react-icons'],
  sourcemap: true,
  clean: true,
  minify: false,
  splitting: false,
  treeshake: false,
  bundle: true,
  injectStyle: true,
  esbuildOptions(options) {
    options.jsx = 'transform';
    options.jsxFactory = 'React.createElement';
    options.jsxFragment = 'React.Fragment';
  },
});
