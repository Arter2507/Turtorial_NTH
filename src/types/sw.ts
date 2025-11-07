/** @format */

/// <reference lib="webworker" />
/// <reference lib="dom" />
/// <reference no-default-lib="true"/>

declare const self: ServiceWorkerGlobalScope;

import { precacheAndRoute } from 'workbox-precaching';
import { clientsClaim } from 'workbox-core';
import { registerRoute } from 'workbox-routing';
import {
	NetworkFirst,
	CacheFirst,
	StaleWhileRevalidate,
} from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration';

// Tự động chuyển đến service worker mới
self.skipWaiting();
clientsClaim();

// Precache và route các assets
precacheAndRoute(self.__WB_MANIFEST || []);

// Cache các request API
registerRoute(
	({ url }) => url.pathname.startsWith('/api/'),
	new NetworkFirst({
		cacheName: 'api-cache',
		plugins: [
			new CacheableResponsePlugin({
				statuses: [0, 200],
			}),
			new ExpirationPlugin({
				maxEntries: 50,
				maxAgeSeconds: 24 * 60 * 60, // 24 giờ
			}),
		],
	})
);

// Cache các static assets
registerRoute(
	({ request }) =>
		request.destination === 'image' ||
		request.destination === 'style' ||
		request.destination === 'script' ||
		request.destination === 'font',
	new CacheFirst({
		cacheName: 'assets-cache',
		plugins: [
			new CacheableResponsePlugin({
				statuses: [0, 200],
			}),
			new ExpirationPlugin({
				maxEntries: 100,
				maxAgeSeconds: 7 * 24 * 60 * 60, // 7 ngày
			}),
		],
	})
);

// Cache các page HTML
registerRoute(
	({ request }) => request.destination === 'document',
	new StaleWhileRevalidate({
		cacheName: 'pages-cache',
		plugins: [
			new CacheableResponsePlugin({
				statuses: [0, 200],
			}),
		],
	})
);
