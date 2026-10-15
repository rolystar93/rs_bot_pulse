import { date } from 'quasar';
import { useBrokersStore } from 'src/stores/brokers-store';
import { useOperationTypesStore } from 'src/stores/operation-types-store';
import { usePairsStore } from 'src/stores/pairs-store';
import { useStrategiesStore } from 'src/stores/strategies-store';
import { useTradesStore } from 'src/stores/trades-store';
import { imageStore } from 'src/services/image-store';
import type { CatalogItem, Trade, TradingPair } from 'src/types';

const BACKUP_APP = 'rs-bot-pulse';
const BACKUP_VERSION = 1;

export interface BackupFile {
  app: typeof BACKUP_APP;
  version: number;
  exportedAt: string;
  data: {
    trades: Trade[];
    brokers: CatalogItem[];
    operationTypes: CatalogItem[];
    strategies: CatalogItem[];
    customPairs: TradingPair[];
    /** id de captura -> data URL */
    screenshots: Record<string, string>;
  };
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error ?? new Error('No se pudo leer la imagen'));
    reader.readAsDataURL(blob);
  });
}

async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  return (await fetch(dataUrl)).blob();
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isCatalogItem = (v: unknown): v is CatalogItem =>
  isRecord(v) && typeof v.id === 'string' && typeof v.name === 'string';

const isPair = (v: unknown): v is TradingPair =>
  isRecord(v) &&
  typeof v.id === 'string' &&
  typeof v.symbol === 'string' &&
  typeof v.base === 'string' &&
  typeof v.quote === 'string' &&
  typeof v.baseFlag === 'string' &&
  typeof v.quoteFlag === 'string';

const isTrade = (v: unknown): v is Trade =>
  isRecord(v) &&
  ['id', 'openedAt', 'closedAt', 'pairId', 'timeframe', 'brokerId', 'operationTypeId'].every(
    (key) => typeof v[key] === 'string',
  ) &&
  typeof v.investment === 'number' &&
  typeof v.result === 'number';

/** Valida el contenido del archivo y lanza un Error con mensaje legible si no es un backup válido. */
export function parseBackup(text: string): BackupFile {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    throw new Error('El archivo no es un JSON válido');
  }

  if (!isRecord(raw) || raw.app !== BACKUP_APP || !isRecord(raw.data)) {
    throw new Error('El archivo no es una copia de seguridad de RS Bot Pulse');
  }
  if (typeof raw.version !== 'number' || raw.version > BACKUP_VERSION) {
    throw new Error('La copia fue creada con una versión más reciente de la app');
  }

  const { trades, brokers, operationTypes, customPairs, screenshots } = raw.data;
  // Las copias anteriores a las estrategias no incluyen este campo
  const strategies = raw.data.strategies ?? [];

  if (
    !Array.isArray(trades) || !trades.every(isTrade) ||
    !Array.isArray(brokers) || !brokers.every(isCatalogItem) ||
    !Array.isArray(operationTypes) || !operationTypes.every(isCatalogItem) ||
    !Array.isArray(strategies) || !strategies.every(isCatalogItem) ||
    !Array.isArray(customPairs) || !customPairs.every(isPair) ||
    !isRecord(screenshots) || !Object.values(screenshots).every((v) => typeof v === 'string')
  ) {
    throw new Error('La copia de seguridad está dañada o incompleta');
  }

  return { ...raw, data: { ...raw.data, strategies } } as unknown as BackupFile;
}

export async function createBackup(): Promise<BackupFile> {
  const screenshots: Record<string, string> = {};
  for (const [id, blob] of await imageStore.entries()) {
    screenshots[id] = await blobToDataUrl(blob);
  }

  return {
    app: BACKUP_APP,
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    data: {
      trades: useTradesStore().trades,
      brokers: useBrokersStore().items,
      operationTypes: useOperationTypesStore().items,
      strategies: useStrategiesStore().items,
      customPairs: usePairsStore().customPairs,
      screenshots,
    },
  };
}

/** Genera y descarga el archivo de copia de seguridad. Devuelve el nombre del archivo. */
export async function downloadBackup(): Promise<string> {
  const backup = await createBackup();
  const fileName = `rs-bot-pulse-backup-${date.formatDate(Date.now(), 'YYYY-MM-DD_HH-mm')}.json`;

  const url = URL.createObjectURL(new Blob([JSON.stringify(backup)], { type: 'application/json' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);

  return fileName;
}

/**
 * Restaura una copia: reemplaza operaciones, brokers, tipos y capturas.
 * Los pares personalizados se unen a los existentes (nunca se pierden).
 */
export async function restoreBackup(backup: BackupFile): Promise<void> {
  const { data } = backup;

  await imageStore.clear();
  for (const [id, dataUrl] of Object.entries(data.screenshots)) {
    await imageStore.put(id, await dataUrlToBlob(dataUrl));
  }

  usePairsStore().mergeCustom(data.customPairs);
  useBrokersStore().replaceAll(data.brokers);
  useOperationTypesStore().replaceAll(data.operationTypes);
  useStrategiesStore().replaceAll(data.strategies);
  useTradesStore().replaceAll(data.trades);
}

/** Borra todos los datos excepto los pares (predeterminados y personalizados). */
export async function resetAppData(): Promise<void> {
  await imageStore.clear();
  useTradesStore().replaceAll([]);
  useBrokersStore().replaceAll([]);
  useOperationTypesStore().replaceAll([]);
  useStrategiesStore().replaceAll([]);
}
