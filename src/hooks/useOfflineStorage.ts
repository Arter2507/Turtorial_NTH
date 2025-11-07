/** @format */

import { useEffect, useState } from 'react';

interface UseOfflineStorage<T> {
	data: T | null;
	isLoading: boolean;
	error: Error | null;
	saveData: (data: T) => Promise<void>;
}

export function useOfflineStorage<T>(
	key: string,
	initialData?: T
): UseOfflineStorage<T> {
	const [data, setData] = useState<T | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	// Load data from IndexedDB khi component mount
	useEffect(() => {
		const loadData = async () => {
			try {
				const db = await openDB();
				const storedData = await getData<T>(db, key);
				setData(storedData ?? initialData ?? null);
			} catch (err) {
				setError(err instanceof Error ? err : new Error('Unknown error'));
			} finally {
				setIsLoading(false);
			}
		};
		loadData();
	}, [key, initialData]);

	// Lưu data vào IndexedDB
	const saveData = async (newData: T) => {
		try {
			const db = await openDB();
			await saveToDB(db, key, newData);
			setData(newData);
		} catch (err) {
			setError(err instanceof Error ? err : new Error('Failed to save data'));
			throw err;
		}
	};

	return { data, isLoading, error, saveData };
}

// Helper functions để tương tác với IndexedDB
async function openDB(): Promise<IDBDatabase> {
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

async function getData<T>(db: IDBDatabase, key: string): Promise<T | null> {
	return new Promise((resolve, reject) => {
		const transaction = db.transaction(['offlineData'], 'readonly');
		const store = transaction.objectStore('offlineData');
		const request = store.get(key);

		request.onerror = () => reject(request.error);
		request.onsuccess = () => resolve(request.result as T);
	});
}

async function saveToDB(
	db: IDBDatabase,
	key: string,
	data: unknown
): Promise<void> {
	return new Promise((resolve, reject) => {
		const transaction = db.transaction(['offlineData'], 'readwrite');
		const store = transaction.objectStore('offlineData');
		const request = store.put(data, key);

		request.onerror = () => reject(request.error);
		request.onsuccess = () => resolve();
	});
}
