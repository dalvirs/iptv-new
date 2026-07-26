// IndexedDB Helper for storing recorded IPTV video streams and downloaded VOD Blobs offline

const DB_NAME = 'IBProIPTV_DB';
const DB_VERSION = 1;
const STORE_MEDIA = 'media_files'; // Stores video Blobs for offline viewing

export async function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_MEDIA)) {
        db.createObjectStore(STORE_MEDIA, { keyPath: 'key' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveMediaBlob(key: string, blob: Blob, metadata: Record<string, any>): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_MEDIA, 'readwrite');
    const store = tx.objectStore(STORE_MEDIA);

    const record = {
      key,
      blob,
      sizeMB: (blob.size / (1024 * 1024)).toFixed(2),
      mimeType: blob.type || 'video/mp4',
      updatedAt: new Date().toISOString(),
      ...metadata,
    };

    const req = store.put(record);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function getMediaBlob(key: string): Promise<Blob | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_MEDIA, 'readonly');
    const store = tx.objectStore(STORE_MEDIA);
    const req = store.get(key);

    req.onsuccess = () => {
      if (req.result && req.result.blob) {
        resolve(req.result.blob);
      } else {
        resolve(null);
      }
    };
    req.onerror = () => reject(req.error);
  });
}

export async function deleteMediaBlob(key: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_MEDIA, 'readwrite');
    const store = tx.objectStore(STORE_MEDIA);
    const req = store.delete(key);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function getStorageUsage(): Promise<{ usedMB: number; fileCount: number }> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_MEDIA, 'readonly');
      const store = tx.objectStore(STORE_MEDIA);
      const req = store.getAll();

      req.onsuccess = () => {
        const records = req.result || [];
        let totalBytes = 0;
        for (const r of records) {
          if (r.blob && r.blob.size) {
            totalBytes += r.blob.size;
          }
        }
        resolve({
          usedMB: parseFloat((totalBytes / (1024 * 1024)).toFixed(1)),
          fileCount: records.length,
        });
      };
      req.onerror = () => resolve({ usedMB: 0, fileCount: 0 });
    });
  } catch (e) {
    return { usedMB: 0, fileCount: 0 };
  }
}
