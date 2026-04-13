import { GITHUB_CONFIG } from '@/config';

export function getVersionFromPath(pathname: string): string | undefined {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length > 0 && GITHUB_CONFIG.versions.some(v => v.id === parts[0])) {
    return parts[0];
  }
  return undefined;
}

export function getEffectiveVersion(pathname: string): string | undefined {
  const version = getVersionFromPath(pathname);
  if (version) return version;
  return GITHUB_CONFIG.versions.length > 0 ? GITHUB_CONFIG.versions[0].id : undefined;
}

export function getTopicFromPath(pathname: string): string | undefined {
  const parts = pathname.split('/').filter(Boolean);
  const hasVersion = parts.length > 0 && GITHUB_CONFIG.versions.some(v => v.id === parts[0]);
  
  if (hasVersion) {
    return parts.length > 1 ? parts[1] : undefined;
  }
  return parts.length > 0 ? parts[0] : undefined;
}

export function getRelativePath(pathname: string): string {
  const parts = pathname.split('/').filter(Boolean);
  const version = getVersionFromPath(pathname);
  
  if (version) {
    return parts.slice(1).join('/');
  }
  return parts.join('/');
}
