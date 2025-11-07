/** @format */

export interface IndexedDBData {
	[key: string]: unknown;
}

// Helper functions để tương tác với IndexedDB
export async function openDB(): Promise<IDBDatabase> {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open('NghichThuyHanOfflineDB', 1);

		request.onerror = () => reject(request.error);
		request.onsuccess = () => resolve(request.result);

		request.onupgradeneeded = (event) => {
			const db = (event.target as IDBOpenDBRequest).result;
			if (!db.objectStoreNames.contains('offlineData')) {
				db.createObjectStore('offlineData');
			}
		};
	});
}

export async function getData<T>(
	db: IDBDatabase,
	key: string
): Promise<T | null> {
	return new Promise((resolve, reject) => {
		const transaction = db.transaction(['offlineData'], 'readonly');
		const store = transaction.objectStore('offlineData');
		const request = store.get(key);

		request.onerror = () => reject(request.error);
		request.onsuccess = () => resolve(request.result);
	});
}

export async function saveToDB<T>(
	db: IDBDatabase,
	key: string,
	data: T
): Promise<void> {
	return new Promise((resolve, reject) => {
		const transaction = db.transaction(['offlineData'], 'readwrite');
		const store = transaction.objectStore('offlineData');
		const request = store.put(data, key);

		request.onerror = () => reject(request.error);
		request.onsuccess = () => resolve();
	});
}
