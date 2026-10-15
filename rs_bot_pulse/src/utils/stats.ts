import type { Trade } from 'src/types';

export interface TradeSummary {
  count: number;
  wins: number;
  losses: number;
  winRate: number;
  totalResult: number;
  totalInvested: number;
  roi: number;
  averageResult: number;
}

export interface TradeGroup {
  key: string;
  count: number;
  wins: number;
  losses: number;
  result: number;
  winRate: number;
}

export interface EquityPoint {
  x: number;
  y: number;
}

export function summarize(trades: Trade[]): TradeSummary {
  const count = trades.length;
  const wins = trades.filter((t) => t.result > 0).length;
  const losses = trades.filter((t) => t.result < 0).length;
  const totalResult = trades.reduce((sum, t) => sum + t.result, 0);
  const totalInvested = trades.reduce((sum, t) => sum + t.investment, 0);

  return {
    count,
    wins,
    losses,
    winRate: count ? (wins / count) * 100 : 0,
    totalResult,
    totalInvested,
    roi: totalInvested ? (totalResult / totalInvested) * 100 : 0,
    averageResult: count ? totalResult / count : 0,
  };
}

export function groupTrades(trades: Trade[], keyOf: (trade: Trade) => string): TradeGroup[] {
  const buckets = new Map<string, Trade[]>();

  for (const trade of trades) {
    const key = keyOf(trade);
    const bucket = buckets.get(key);
    if (bucket) bucket.push(trade);
    else buckets.set(key, [trade]);
  }

  return [...buckets.entries()].map(([key, items]) => {
    const { count, wins, losses, winRate, totalResult } = summarize(items);
    return { key, count, wins, losses, winRate, result: totalResult };
  });
}

export function buildEquityCurve(trades: Trade[]): EquityPoint[] {
  let balance = 0;

  return [...trades]
    .sort((a, b) => Date.parse(a.closedAt) - Date.parse(b.closedAt))
    .map((trade) => {
      balance += trade.result;
      return { x: Date.parse(trade.closedAt), y: Number(balance.toFixed(2)) };
    });
}

export function openingHour(trade: Trade): string {
  return String(new Date(trade.openedAt).getHours()).padStart(2, '0');
}
