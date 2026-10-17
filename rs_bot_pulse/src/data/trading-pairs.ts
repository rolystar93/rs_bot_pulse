import type { PairCategory, TradingPair } from 'src/types';
import { CURRENCY_FLAGS } from './currency-flags';

const SINGLE_ASSETS: Record<'crypto' | 'metal', string[]> = {
  crypto: [
    'BTC', 'ETH', 'BNB', 'XRP', 'SOL', 'ADA', 'DOGE', 'DOT', 'LTC', 'LINK',
    'AVAX', 'MATIC', 'TRX', 'BCH', 'XLM', 'ATOM', 'UNI', 'XMR', 'ETC', 'SHIB',
  ],
  metal: ['XAU', 'XAG', 'XPT', 'XPD', 'XCU'],
};

const PAIR_DEFINITIONS: Record<'major' | 'cross' | 'exotic', string[]> = {
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

function buildSingleAsset(code: string, category: PairCategory): TradingPair {
  return { id: code, symbol: code, base: code, quote: '', baseFlag: '', quoteFlag: '', category };
}

export const TRADING_PAIRS: TradingPair[] = [
  ...(Object.entries(PAIR_DEFINITIONS) as [PairCategory, string[]][]).flatMap(([category, ids]) =>
    ids.map((id) => buildPair(id, category)),
  ),
  ...(Object.entries(SINGLE_ASSETS) as [PairCategory, string[]][]).flatMap(([category, codes]) =>
    codes.map((code) => buildSingleAsset(code, category)),
  ),
];
