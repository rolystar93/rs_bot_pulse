export interface CatalogItem {
  id: string;
  name: string;
  /** Solo lo usan los catálogos que lo admiten (p. ej. estrategias) */
  description?: string;
}

export type PairCategory = 'major' | 'cross' | 'exotic' | 'crypto' | 'metal' | 'custom';

export interface TradingPair {
  /** Identificador estable, p. ej. "EURUSD" */
  id: string;
  /** Símbolo legible, p. ej. "EUR/USD" */
  symbol: string;
  base: string;
  quote: string;
  /** Códigos de país para `flag-icons` */
  /** Vac�o = sin bandera (metales, cripto...) */
  baseFlag: string;
  quoteFlag: string;
  category: PairCategory;
}

export interface Trade {
  id: string;
  /** ISO 8601 */
  openedAt: string;
  /** ISO 8601 */
  closedAt: string;
  investment: number;
  /** Resultado neto: positivo = ganancia, negativo = pérdida */
  result: number;
  pairId: string;
  timeframe: string;
  brokerId: string;
  operationTypeId: string;
  /** Ausente en operaciones registradas antes de existir las estrategias */
  strategyId?: string | null;
  /** Clave de la captura en IndexedDB */
  screenshotId?: string | null;
}

export type TradeInput = Omit<Trade, 'id' | 'screenshotId' | 'strategyId'> & { strategyId: string };

export type ScreenshotChange =
  | { action: 'keep' }
  | { action: 'set'; file: File }
  | { action: 'remove' };
