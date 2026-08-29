/**
 * Which slide a snap rail has come to rest on, from its scroll position.
 *
 * Measured across the *scrollable* distance rather than the content width: the
 * last slide can never centre itself (the rail runs out of scroll before it
 * gets there), so a formula based on content width drifts on the final slide
 * and on any rail whose padding or gap changes. Progress across the track is
 * exact at both ends by construction.
 *
 * Renamed from lib/rail.ts to free the name for the payment Rail interface
 * (TECHNICAL.md §4).
 */
export function railIndex(
  scrollLeft: number,
  scrollWidth: number,
  clientWidth: number,
  count: number,
): number {
  const track = scrollWidth - clientWidth;
  if (track <= 0 || count < 2) return 0;
  const i = Math.round((scrollLeft / track) * (count - 1));
  return Math.min(count - 1, Math.max(0, i));
}
