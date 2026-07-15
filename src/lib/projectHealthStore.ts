import { useSyncExternalStore } from 'react';
import { probeProjectUrl } from './probeProject';
import type { HealthReport, Project, ProjectHealthEntry } from '../types/project';

export type HealthStatus = 'checking' | 'online' | 'offline';

export interface HealthSnapshot {
  status: HealthStatus;
  httpStatus: number | null;
  reason: ProjectHealthEntry['reason'] | null;
  checkedAt: string | null;
  error?: string;
}

const store = {
  checkedAt: null as string | null,
  snapshots: {} as Record<string, HealthSnapshot>,
  listeners: new Set<() => void>(),
  started: false,
};

function notify() {
  store.listeners.forEach((listener) => listener());
}

function setSnapshot(id: string, snapshot: HealthSnapshot) {
  const prev = store.snapshots[id];
  if (
    prev &&
    prev.status === snapshot.status &&
    prev.httpStatus === snapshot.httpStatus &&
    prev.reason === snapshot.reason &&
    prev.checkedAt === snapshot.checkedAt
  ) {
    return;
  }
  store.snapshots[id] = snapshot;
  notify();
}

function applyReport(report: HealthReport) {
  store.checkedAt = report.checkedAt;
  for (const [id, entry] of Object.entries(report.projects)) {
    setSnapshot(id, {
      status: entry.online ? 'online' : 'offline',
      httpStatus: entry.httpStatus,
      reason: entry.reason,
      checkedAt: report.checkedAt,
      error: entry.error,
    });
  }
  notify();
}

export function initProjectHealth(
  projects: Project[],
  options: {
    initialReport?: HealthReport | null;
    liveRefresh?: boolean;
  } = {},
) {
  if (store.started) return;
  store.started = true;

  const { initialReport = null, liveRefresh = false } = options;

  for (const project of projects) {
    const fromReport = initialReport?.projects?.[project.id];
    if (fromReport) {
      setSnapshot(project.id, {
        status: fromReport.online ? 'online' : 'offline',
        httpStatus: fromReport.httpStatus,
        reason: fromReport.reason,
        checkedAt: initialReport.checkedAt,
        error: fromReport.error,
      });
    } else {
      setSnapshot(project.id, {
        status: 'checking',
        httpStatus: null,
        reason: null,
        checkedAt: null,
      });
    }
  }

  if (initialReport) {
    store.checkedAt = initialReport.checkedAt;
  }

  if (!liveRefresh) {
    // 无静态结果时仍尝试拉取 /status.json
    if (!initialReport || Object.keys(initialReport.projects).length === 0) {
      void fetch('/status.json', { cache: 'no-store' })
        .then((res) => (res.ok ? res.json() : null))
        .then((report: HealthReport | null) => {
          if (report?.projects) applyReport(report);
        })
        .catch(() => {
          /* ignore */
        });
    }
    return;
  }

  for (const project of projects) {
    void probeProjectUrl(project.url).then((online) => {
      setSnapshot(project.id, {
        status: online ? 'online' : 'offline',
        httpStatus: null,
        reason: online ? 'ok' : 'network_error',
        checkedAt: new Date().toISOString(),
      });
    });
  }
}

export function getProjectHealth(id: string): HealthStatus {
  return store.snapshots[id]?.status ?? 'checking';
}

export function getProjectHealthSnapshot(id: string): HealthSnapshot {
  return (
    store.snapshots[id] ?? {
      status: 'checking',
      httpStatus: null,
      reason: null,
      checkedAt: null,
    }
  );
}

export function getHealthCheckedAt(): string | null {
  return store.checkedAt;
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

export function useProjectHealthSnapshot(projectId: string): HealthSnapshot {
  return useSyncExternalStore(
    (onStoreChange) => {
      store.listeners.add(onStoreChange);
      return () => store.listeners.delete(onStoreChange);
    },
    () => getProjectHealthSnapshot(projectId),
    () =>
      ({
        status: 'checking',
        httpStatus: null,
        reason: null,
        checkedAt: null,
      }) as HealthSnapshot,
  );
}
