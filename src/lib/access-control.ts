import type { SessionPayload } from '@/types';

/**
 * Returns true if the current date falls within the Arita Pottery Market period
 * (April 29 – May 5, JST approximated via TZ env var).
 */
export function isMarketPeriod(now: Date = new Date()): boolean {
  const m = now.getMonth() + 1; // local month (TZ=Asia/Tokyo via env)
  const d = now.getDate();
  return (m === 4 && d >= 29) || (m === 5 && d <= 5);
}

/**
 * Returns true if the visitor can see detail pages.
 * Members (any role with a session) can always view.
 * Non-members can only view during the market period.
 */
export function canViewDetail(session: SessionPayload | null): boolean {
  return !!session || isMarketPeriod();
}
