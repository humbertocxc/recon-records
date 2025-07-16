import { URL } from 'url';

function normalizeUrlTarget(target: string): URL | null {
  try {
    if (!/^https?:\/\//.test(target)) {
      target = 'http://' + target;
    }
    return new URL(target);
  } catch {
    return null;
  }
}

export function isUrlInScope(
  targetUrlStr: string,
  scopeList?: string[],
): boolean {
  if (!scopeList || scopeList.length === 0) return false;

  const targetUrl = normalizeUrlTarget(targetUrlStr);
  if (!targetUrl) return false;

  for (const rawScope of scopeList) {
    const scope = rawScope.trim();

    if (!scope.startsWith('http')) continue;

    const scopeUrl = normalizeUrlTarget(scope);
    if (!scopeUrl) continue;

    if (
      scopeUrl.origin === targetUrl.origin &&
      targetUrl.pathname.startsWith(scopeUrl.pathname)
    ) {
      return true;
    }
  }

  return false;
}
