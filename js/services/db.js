/**
 * On-Device Local SQLite-like Storage Service (Zero Cloud PII)
 * Manages pre-visit prep, consultation summaries, local records, and care directory entirely on-device.
 */

class LocalDatabase {
  constructor() {
    this.dbName = 'HealthCompanionDB';
    this.version = 1;
    this.initPromise = this._initDB();
  }

  async _initDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // 1. Pre-visit preparation & symptom timelines
        if (!db.objectStoreNames.contains('pre_visit_prep')) {
          db.createObjectStore('pre_visit_prep', { keyPath: 'id', autoIncrement: true });
        }

        // 2. Post-visit consultation summaries
        if (!db.objectStoreNames.contains('consultation_summaries')) {
          db.createObjectStore('consultation_summaries', { keyPath: 'id', autoIncrement: true });
        }

        // 3. Local health records & notes
        if (!db.objectStoreNames.contains('health_records')) {
          db.createObjectStore('health_records', { keyPath: 'id', autoIncrement: true });
        }

        // 4. Care navigation directory cache
        if (!db.objectStoreNames.contains('care_directory')) {
          const store = db.createObjectStore('care_directory', { keyPath: 'id', autoIncrement: true });
          store.createIndex('type', 'type', { unique: false });
        }
      };
    });
  }

  async _getStore(storeName, mode = 'readonly') {
    const db = await this.initPromise;
    const transaction = db.transaction(storeName, mode);
    return transaction.objectStore(storeName);
  }

  async add(storeName, data) {
    const store = await this._getStore(storeName, 'readwrite');
    return new Promise((resolve, reject) => {
      const record = { ...data, createdAt: new Date().toISOString() };
      const request = store.add(record);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getAll(storeName) {
    const store = await this._getStore(storeName, 'readonly');
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async update(storeName, data) {
    const store = await this._getStore(storeName, 'readwrite');
    return new Promise((resolve, reject) => {
      const record = { ...data, updatedAt: new Date().toISOString() };
      const request = store.put(record);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async delete(storeName, id) {
    const store = await this._getStore(storeName, 'readwrite');
    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
}

export const db = new LocalDatabase();
