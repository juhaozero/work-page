import { useSyncExternalStore } from 'react';
import { probeProjectUrl } from './probeProject';
import type { Project } from '../types/project';

export type HealthStatus = 'checking' | 'online' | 'offline';

const store = {
  statuses: {} as Record<string, HealthStatus>,
  listeners: new Set<() => void>(),
  started: false,
};

function notify() {
  store.listeners.forEach((listener) => listener());
}

function setStatus(id: string, status: HealthStatus) {
  if (store.statuses[id] === status) return;
  store.statuses[id] = status;
  notify();
}

export function initProjectHealth(projects: Project[]) {
  if (store.started) return;
  store.started = true;

  for (const project of projects) {
    store.statuses[project.id] = 'checking';
  }
  notify();

  for (const project of projects) {
    void probeProjectUrl(project.url).then((online) => {
      setStatus(project.id, online ? 'online' : 'offline');
    });
  }
}

export function getProjectHealth(id: string): HealthStatus {
  return store.statuses[id] ?? 'checking';
}

export function useProjectHealth(projectId: string): HealthStatus {
  return useSyncExternalStore(
    (onStoreChange) => {
      store.listeners.add(onStoreChange);
      return () => store.listeners.delete(onStoreChange);
    },
    () => getProjectHealth(projectId),
    () => 'checking' as HealthStatus,
  );
}
