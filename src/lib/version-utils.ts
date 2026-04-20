type Project = { id: string; name: string };

export function getProjectFromPath(pathname: string, projects: Project[]): string | undefined {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length > 0 && projects.some(p => p.id === parts[0])) {
    return parts[0];
  }
  return undefined;
}

export function getEffectiveProject(pathname: string, projects: Project[]): string | undefined {
  return getProjectFromPath(pathname, projects);
}

export function getTopicFromPath(pathname: string, projects: Project[]): string | undefined {
  const parts = pathname.split('/').filter(Boolean);
  const hasProject = parts.length > 0 && projects.some(p => p.id === parts[0]);
  
  if (hasProject) {
    return parts.length > 1 ? parts[1] : undefined;
  }
  return parts.length > 0 ? parts[0] : undefined;
}

export function getRelativePath(pathname: string, projects: Project[]): string {
  const parts = pathname.split('/').filter(Boolean);
  const proj = getProjectFromPath(pathname, projects);
  
  if (proj) {
    return parts.slice(1).join('/');
  }
  return parts.join('/');
}
