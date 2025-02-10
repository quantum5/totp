import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {nodePolyfills} from 'vite-plugin-node-polyfills';
import svgr from 'vite-plugin-svgr';

function yearPlugin() {
  return {
    name: 'year',
    transformIndexHtml(html: string): string {
      return html.replace('__YEAR__', new Date().getFullYear().toString());
    },
  } as const;
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svgr(),
    react(),
    yearPlugin(),
    nodePolyfills({
      include: ['buffer'],
      globals: {Buffer: true},
    }),
  ],
});
