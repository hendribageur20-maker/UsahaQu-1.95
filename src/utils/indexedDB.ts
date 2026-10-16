/**
 * Lightweight IndexedDB wrapper with LocalStorage fallback
 * for UsahaQu Master Engine v1.90.
 * Ensures zero-bloat, safe DOM/Window checking, and offline-first speed.
 */

const DB_NAME = 'UsahaQuMasterDB';
const DB_VERSION = 1;

let dbInstance: IDBDatabase | null = null;

export async function openIndexedDB(): Promise<IDBDatabase> {
  if (dbInstance) return dbInstance;
  if (typeof window === 'undefined' || !window.indexedDB) {
    throw new Error('IndexedDB not supported in current environment');
  }

  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const stores = ['spareparts', 'transactions', 'queues', 'attendance', 'staff', 'settings'];
      stores.forEach((storeName) => {
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: 'id' });
        }
      });
    };

    request.onsuccess = (event) => {
      dbInstance = (event.target as IDBOpenDBRequest).result;
      resolve(dbInstance);
    };

    request.onerror = (event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
}

/**
 * Save collection to IndexedDB with localStorage sync
 */
export async function saveToDB<T extends { id: string }>(
  storeName: string,
  items: T[]
): Promise<void> {
  try {
    const db = await openIndexedDB();
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);

    // Clear existing
    store.clear();
    // Put all items
    items.forEach((item) => store.put(item));

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => {
        // Also sync key to local storage for instant fallback
        try {
          localStorage.setItem(`uq_idb_${storeName}`, JSON.stringify(items));
        } catch {}
        resolve();
      };
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // Graceful fallback to localStorage
    try {
      localStorage.setItem(`uq_idb_${storeName}`, JSON.stringify(items));
    } catch {}
  }
}

/**
 * Load collection from IndexedDB with localStorage fallback
 */
export async function loadFromDB<T>(storeName: string, fallback: T[]): Promise<T[]> {
  try {
    const db = await openIndexedDB();
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const request = store.getAll();

    return new Promise((resolve) => {
      request.onsuccess = () => {
        const result = request.result;
        if (Array.isArray(result) && result.length > 0) {
          resolve(result as T[]);
        } else {
          // Check local storage backup
          const ls = localStorage.getItem(`uq_idb_${storeName}`);
          resolve(ls ? JSON.parse(ls) : fallback);
        }
      };
      request.onerror = () => {
        const ls = localStorage.getItem(`uq_idb_${storeName}`);
        resolve(ls ? JSON.parse(ls) : fallback);
      };
    });
  } catch {
    const ls = localStorage.getItem(`uq_idb_${storeName}`);
    return ls ? JSON.parse(ls) : fallback;
  }
}
