/** @format */

import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { manifestForPlugin } from './manifest';
import * as path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, '.', '');
	return {
		plugins: [
			react(),
			VitePWA({
				strategies: 'generateSW',
				registerType: 'prompt',
				workbox: {
					globPatterns: ['**/*.{js,css,html,ico,png,svg,json,vue,txt,woff2}'],
					runtimeCaching: [
						{
							urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
							handler: 'CacheFirst',
							options: {
								cacheName: 'google-fonts-cache',
								expiration: {
									maxEntries: 10,
									maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
								},
								cacheableResponse: {
									statuses: [0, 200],
								},
							},
						},
						{
							urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
							handler: 'CacheFirst',
							options: {
								cacheName: 'gstatic-fonts-cache',
								expiration: {
									maxEntries: 10,
									maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
								},
								cacheableResponse: {
									statuses: [0, 200],
								},
							},
						},
					],
				},
				includeAssets: [
					'favicon.ico',
					'apple-touch-icon.png',
					'masked-icon.svg',
				],
				manifest: manifestForPlugin,
			}),
		],
		base: '/Turtorial_NTH/',
		server: {
			port: 3000,
			host: '0.0.0.0',
		},
		build: {
			outDir: 'dist',
			assetsDir: 'assets',
			// Enable minification and tree shaking
			minify: 'terser',
			target: 'esnext',
			// Split chunks for better caching
			rollupOptions: {
				output: {
					assetFileNames: 'assets/[name].[hash][extname]',
					chunkFileNames: 'assets/[name].[hash].js',
					entryFileNames: 'assets/[name].[hash].js',
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
