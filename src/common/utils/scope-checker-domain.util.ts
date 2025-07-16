import * as net from 'net';

function isIP(value: string): boolean {
  return net.isIP(value) !== 0;
}

function normalizeDomain(domain: string): string {
  return domain.toLowerCase().replace(/\.$/, '');
}

function isWildcardDomain(scope: string): boolean {
  return scope.startsWith('*.');
}

export function isDomainInScope(domain: string, scopeList?: string[]): boolean {
  if (!scopeList || scopeList.length === 0) return false;

  const normalizedDomain = normalizeDomain(domain);

  for (const rawScope of scopeList) {
    const scope = normalizeDomain(rawScope.trim());

    if (scope === '*') return true;

    if (isIP(scope) && isIP(normalizedDomain)) {
      if (scope === normalizedDomain) return true;
    }

    if (isWildcardDomain(scope)) {
      const base = scope.replace(/^\*\./, '');

      if (normalizedDomain === base || normalizedDomain.endsWith('.' + base)) {
        return true;
      }
    } else {
      if (normalizedDomain === scope) return true;
    }
  }

  return false;
}
