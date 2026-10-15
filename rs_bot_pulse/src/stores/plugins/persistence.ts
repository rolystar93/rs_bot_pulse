import type { PiniaPluginContext, StateTree } from 'pinia';
import { STORAGE_PREFIX } from 'src/constants/app';

declare module 'pinia' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export interface DefineStoreOptionsBase<S, Store> {
    /** Persiste el estado del store en localStorage. */
    persist?: boolean;
  }
}

/**
 * Plugin de persistencia local. La app es de escritorio y sin servidor,
 * por lo que localStorage (perfil de Electron) es el almacenamiento de datos.
 */
export function persistencePlugin({ store, options }: PiniaPluginContext): void {
  if (!options.persist) return;

  const key = `${STORAGE_PREFIX}:${store.$id}`;
  const saved = localStorage.getItem(key);

  if (saved) {
    try {
      store.$patch(JSON.parse(saved) as StateTree);
    } catch {
      localStorage.removeItem(key);
    }
  }

  store.$subscribe((_mutation, state) => localStorage.setItem(key, JSON.stringify(state)), {
    detached: true,
  });
}
