import { useProjectHealth, type HealthStatus } from '../lib/projectHealthStore';
import type { UITranslations } from '../i18n/ui';

interface ProjectStatusProps {
  projectId: string;
  labels: UITranslations['status'];
  className?: string;
}

const STATUS_CLASS: Record<HealthStatus, string> = {
  checking: 'status-checking',
  online: 'status-online',
  offline: 'status-offline',
};

export default function ProjectStatus({ projectId, labels, className = '' }: ProjectStatusProps) {
  const status = useProjectHealth(projectId);

  const statusLabel: Record<HealthStatus, string> = {
    checking: labels.checking,
    online: labels.online,
    offline: labels.offline,
  };

  const ariaLabel: Record<HealthStatus, string> = {
    checking: labels.ariaChecking,
    online: labels.ariaOnline,
    offline: labels.ariaOffline,
  };

  return (
    <span
      className={`${STATUS_CLASS[status]} shrink-0 ${className}`}
      aria-label={ariaLabel[status]}
      title={statusLabel[status]}
    >
      {statusLabel[status]}
    </span>
  );
}
