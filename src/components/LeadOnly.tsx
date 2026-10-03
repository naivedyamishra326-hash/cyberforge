import { useAuth } from '../contexts/AuthContext';
import { Lock } from 'lucide-react';

interface LeadOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showLock?: boolean;
}

/** Renders children only when the current user is the team lead. */
export default function LeadOnly({ children, fallback, showLock = true }: LeadOnlyProps) {
  const { isLead } = useAuth();

  if (isLead()) return <>{children}</>;

  if (fallback) return <>{fallback}</>;

  if (showLock) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', gap: 'var(--sp-2)',
        padding: 'var(--sp-3) var(--sp-4)',
        background: 'var(--glass-subtle)', borderRadius: 'var(--radius-md)',
        fontSize: 'var(--fs-small)', color: 'var(--text-tertiary)',
      }}>
        <Lock size={14} />
        <span>Team Lead only</span>
      </div>
    );
  }

  return null;
}
