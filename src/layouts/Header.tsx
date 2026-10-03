import { Menu, Clock, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import './Header.css';

interface HeaderProps {
  title: string;
  description?: string;
  onMenuClick: () => void;
}

const avatarColors: Record<string, string> = {
  cyan:  'var(--accent-cyan-dim)',
  green: 'var(--accent-green-dim)',
  blue:  'var(--accent-blue-dim)',
  amber: 'var(--color-warning-dim)',
};

const avatarTextColors: Record<string, string> = {
  cyan:  'var(--accent-cyan)',
  green: 'var(--accent-green)',
  blue:  'var(--accent-blue)',
  amber: 'var(--color-warning)',
};

export default function Header({ title, description, onMenuClick }: HeaderProps) {
  const { user, logout, isLead } = useAuth();
  const daysRemaining = 12 - 4 + 1; // currentDay is 4

  return (
    <header className="header" role="banner">
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-4)' }}>
        <button
          className="header__menu-btn"
          onClick={onMenuClick}
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} />
        </button>

        <div className="header__left">
          <h1 className="header__title">{title}</h1>
          {description && <p className="header__description">{description}</p>}
        </div>
      </div>

      <div className="header__right">
        <div className="header__days">
          <Clock size={12} />
          <span className="header__days-number">{daysRemaining}</span>
          <span>days left</span>
        </div>

        {/* Logged-in user badge */}
        {user && (
          <div className="header__user">
            <div
              className="header__avatar"
              style={{
                background: avatarColors[user.color],
                color: avatarTextColors[user.color],
              }}
            >
              {user.initials}
            </div>
            <div className="header__user-info">
              <span className="header__user-name">{user.name}</span>
              <span className="header__user-role">
                {isLead() ? 'TEAM LEAD' : user.role.toUpperCase()}
              </span>
            </div>
            <button
              className="header__logout"
              onClick={logout}
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
