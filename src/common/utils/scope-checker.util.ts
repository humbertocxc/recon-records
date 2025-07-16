import * as net from 'net';
import { URL } from 'url';

function isIP(value: string): boolean {
  return net.isIP(value) !== 0;
}

function isWildcardDomain(scope: string): boolean {
  return scope.startsWith('*.');
}

function normalizeDomain(domain: string): string {
  return domain.toLowerCase().replace(/\.$/, '');
}

function extractHostname(target: string): string | null {
  try {
    if (!/^https?:\/\//.test(target)) {
      target = 'http://' + target;
    }
    const url = new URL(target);
    return normalizeDomain(url.hostname);
  } catch {
    return null;
  }
}

function extractPath(target: string): string {
  try {
    if (!/^https?:\/\//.test(target)) {
      target = 'http://' + target;
    }
    const url = new URL(target);
    return url.pathname;
  } catch {
    return '';
  }
}

export function isTargetInScope(target: string, scopeList?: string[]): boolean {
  const normalizedTarget = target.trim().toLowerCase();

  if (!scopeList || scopeList.length === 0) {
    return false;
  }

  if (scopeList.length === 1 && scopeList[0].trim() === '*') {
    return true;
  }

  for (const rawScope of scopeList) {
    const scope = rawScope.trim().toLowerCase();

    if (isIP(scope) && isIP(normalizedTarget)) {
      if (scope === normalizedTarget) return true;
    }

    if (isWildcardDomain(scope)) {
      const domain = scope.replace(/^\*\./, '');
      const targetHost = extractHostname(normalizedTarget);
      if (
        targetHost &&
        (targetHost === domain || targetHost.endsWith(`.${domain}`))
      ) {
        return true;
      }
    }

    if (scope.startsWith('http')) {
      try {
        const scopeUrl = new URL(scope);
        const targetUrl = new URL(
          normalizedTarget.startsWith('http')
            ? normalizedTarget
            : `http://${normalizedTarget}`,
        );

        if (
          scopeUrl.origin === targetUrl.origin &&
          targetUrl.pathname.startsWith(scopeUrl.pathname)
        ) {
          return true;
        }
      } catch {
        continue;
      }
    }

    if (scope.includes('/*')) {
      const [scopePrefix] = scope.split('/*');
      const targetHost = extractHostname(normalizedTarget);
      const targetPath = extractPath(normalizedTarget);

      if (
        normalizedTarget.startsWith(scopePrefix) ||
        (targetHost &&
          normalizedTarget.startsWith(`${targetHost}${targetPath}`))
      ) {
        return true;
      }
    }

    const targetHost = extractHostname(normalizedTarget) || normalizedTarget;
    if (targetHost === scope) {
      return true;
    }
  }

  return false;
}
