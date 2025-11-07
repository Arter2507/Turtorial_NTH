/** @format */

import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, '.', '');
	return {
		plugins: [react()],
		server: {
			port: 3000,
			host: '0.0.0.0',
		},
		build: {
			// Enable minification and tree shaking
			minify: 'terser',
			target: 'esnext',
			// Split chunks for better caching
			rollupOptions: {
				output: {
					manualChunks: {
						'react-vendor': ['react', 'react-dom'],
					},
				},
			},
			// Generate source maps for production
			sourcemap: true,
		},
		define: {
			'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
			'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
		},
		resolve: {
			alias: {
				'@': path.resolve('./src'),
				'@components': path.resolve('./src/components'),
				'@hooks': path.resolve('./src/hooks'),
				'@styles': path.resolve('./src/styles'),
			},
		},
		optimizeDeps: {
			// Enable dependency pre-bundling
			include: ['react', 'react-dom'],
		},
	};
});
