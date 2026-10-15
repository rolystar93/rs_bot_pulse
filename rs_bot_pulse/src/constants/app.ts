export const APP_NAME = 'RS Bot Pulse';

export const FORMAT = {
  locale: 'pt-BR',
  dateTime: 'DD/MM/YYYY HH:mm',
} as const;

export const TIMEFRAMES = ['S5', 'S15', 'S30', 'M1', 'M5', 'M15', 'M30', 'H1', 'H4', 'D1'] as const;

export const DEFAULT_TIMEFRAME = 'M5';

export const STORAGE_PREFIX = 'rs-bot-pulse';
