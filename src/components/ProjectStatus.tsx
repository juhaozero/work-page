import { useProjectHealth, type HealthStatus } from '../lib/projectHealthStore';

interface ProjectStatusProps {
  projectId: string;
  className?: string;
}

const STATUS_LABEL: Record<HealthStatus, string> = {
  checking: '◌ 检测中',
  online: '◉ 在线',
  offline: '◯ 离线',
};

const STATUS_CLASS: Record<HealthStatus, string> = {
  checking: 'status-checking',
  online: 'status-online',
  offline: 'status-offline',
};

export default function ProjectStatus({ projectId, className = '' }: ProjectStatusProps) {
  const status = useProjectHealth(projectId);

  return (
    <span
      className={`${STATUS_CLASS[status]} shrink-0 ${className}`}
      aria-label={`服务${status === 'online' ? '在线' : status === 'offline' ? '离线' : '检测中'}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}
