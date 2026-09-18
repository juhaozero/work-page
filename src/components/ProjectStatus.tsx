import { useProjectHealth, type HealthStatus } from '../lib/projectHealthStore';
import type { UITranslations } from '../i18n/ui';
import type { ProjectKind } from '../types/project';

interface ProjectStatusProps {
  projectId: string;
  labels: UITranslations['status'];
  /** web：在线/离线；package：发布可用/不可用 */
  kind?: ProjectKind;
  className?: string;
}

const STATUS_CLASS: Record<HealthStatus, string> = {
  checking: 'status-checking',
  online: 'status-online',
  offline: 'status-offline',
};

export default function ProjectStatus({
  projectId,
  labels,
  kind = 'web',
  className = '',
}: ProjectStatusProps) {
  const status = useProjectHealth(projectId);
  const isPackage = kind === 'package';

  const statusLabel: Record<HealthStatus, string> = {
    checking: labels.checking,
    online: isPackage ? labels.available : labels.online,
    offline: isPackage ? labels.unavailable : labels.offline,
  };

  const ariaLabel: Record<HealthStatus, string> = {
    checking: labels.ariaChecking,
    online: isPackage ? labels.ariaAvailable : labels.ariaOnline,
    offline: isPackage ? labels.ariaUnavailable : labels.ariaOffline,
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
