/**
 * Title sanitization utilities
 * Guarantees clean, production-grade job and requisition titles.
 * Ensures no "(No Bounty)", "(Bounty)", or internal markers appear anywhere in titles.
 */
export function cleanJobTitle(title?: string): string {
  if (!title) return "";
  return title
    .replace(/\s*\((?:no\s+)?bounty\)/gi, "")
    .replace(/\s*\|\s*(?:no\s+)?bounty/gi, "")
    .replace(/\s*-\s*(?:no\s+)?bounty/gi, "")
    .trim();
}
