import type { PairCategory, TradingPair } from 'src/types';
import { CURRENCY_FLAGS } from './currency-flags';

const PAIR_DEFINITIONS: Record<Exclude<PairCategory, 'custom'>, string[]> = {
  major: ['EURUSD', 'GBPUSD', 'USDJPY', 'USDCHF', 'AUDUSD', 'USDCAD', 'NZDUSD'],
  cross: [
    'EURGBP', 'EURJPY', 'EURCHF', 'EURAUD', 'EURCAD', 'EURNZD',
    'GBPJPY', 'GBPCHF', 'GBPAUD', 'GBPCAD', 'GBPNZD',
    'AUDJPY', 'AUDCAD', 'AUDCHF', 'AUDNZD',
    'CADJPY', 'CADCHF', 'CHFJPY',
    'NZDJPY', 'NZDCAD', 'NZDCHF',
  ],
  exotic: ['USDBRL', 'USDMXN', 'USDZAR', 'USDTRY', 'USDSEK', 'USDNOK', 'USDSGD'],
};

function buildPair(id: string, category: PairCategory): TradingPair {
  const base = id.slice(0, 3);
  const quote = id.slice(3);

  return {
    id,
    symbol: `${base}/${quote}`,
    base,
    quote,
    baseFlag: CURRENCY_FLAGS[base] ?? 'un',
    quoteFlag: CURRENCY_FLAGS[quote] ?? 'un',
    category,
  };
}

export const TRADING_PAIRS: TradingPair[] = (
  Object.entries(PAIR_DEFINITIONS) as [PairCategory, string[]][]
).flatMap(([category, ids]) => ids.map((id) => buildPair(id, category)));
