const DB_NAME = 'rs-bot-pulse-files';
const STORE = 'screenshots';

let dbPromise: Promise<IDBDatabase> | undefined;

function openDb(): Promise<IDBDatabase> {
  dbPromise ??= new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('No se pudo abrir IndexedDB'));
  });
  return dbPromise;
}

async function run<T>(mode: IDBTransactionMode, action: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const request = action(db.transaction(STORE, mode).objectStore(STORE));
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Error de IndexedDB'));
  });
}

/** Almacén de capturas de pantalla (blobs) fuera de localStorage por su tamaño. */
export const imageStore = {
  put: (id: string, blob: Blob) => run('readwrite', (s) => s.put(blob, id)).then(() => undefined),
  get: (id: string) => run<Blob | undefined>('readonly', (s) => s.get(id)),
  remove: (id: string) => run('readwrite', (s) => s.delete(id)).then(() => undefined),
  clear: () => run('readwrite', (s) => s.clear()).then(() => undefined),

  async entries(): Promise<[string, Blob][]> {
    const [keys, values] = await Promise.all([
      run<IDBValidKey[]>('readonly', (s) => s.getAllKeys()),
      run<Blob[]>('readonly', (s) => s.getAll()),
    ]);
    return keys.map((key, i) => [key as string, values[i]!]);
  },
};
