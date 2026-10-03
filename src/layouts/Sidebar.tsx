import { NavLink, useLocation } from 'react-router-dom';
import {
  Shield,
  LayoutDashboard,
  CalendarDays,
  BookOpen,
  BarChart3,
  Database,
  Users,
  CheckSquare,
  StickyNote,
  Crosshair,
  Boxes,
  TrendingUp,
} from 'lucide-react';
import { team, daysRemaining } from '../data/store';
import './Sidebar.css';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navGroups = [
  {
    label: 'Command',
    items: [
      { label: 'Command Center', path: '/', icon: LayoutDashboard },
      { label: '12-Day Roadmap', path: '/roadmap', icon: CalendarDays },
    ],
  },
  {
    label: 'Learning',
    items: [
      { label: 'Learning Paths', path: '/learning', icon: BookOpen },
      { label: 'Skill Matrix', path: '/skills', icon: BarChart3 },
      { label: 'Resources', path: '/resources', icon: Database },
    ],
  },
  {
    label: 'Team',
    items: [
      { label: 'Members', path: '/team', icon: Users },
      { label: 'Tasks', path: '/tasks', icon: CheckSquare },
      { label: 'Team Notes', path: '/notes', icon: StickyNote },
    ],
  },
  {
    label: 'Execution',
    items: [
      { label: 'Problem Mode', path: '/problem', icon: Crosshair },
      { label: 'Architecture', path: '/architecture', icon: Boxes },
    ],
  },
  {
    label: 'Analytics',
    items: [
      { label: 'Progress', path: '/progress', icon: TrendingUp },
    ],
  },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`sidebar-overlay ${isOpen ? 'sidebar-overlay--visible' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`} role="navigation" aria-label="Main navigation">
        {/* Brand */}
        <div className="sidebar__brand">
          <div className="sidebar__logo">
            <div className="sidebar__logo-icon">
              <Shield strokeWidth={2.5} />
            </div>
            <span className="sidebar__logo-text">CYBERFORGE</span>
          </div>
          <div className="sidebar__subtitle">AI × Security System</div>
        </div>

        {/* Navigation */}
        <nav className="sidebar__nav">
          {navGroups.map((group) => (
            <div key={group.label}>
              <div className="sidebar__group-label">{group.label}</div>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.path === '/'
                    ? location.pathname === '/'
                    : location.pathname.startsWith(item.path);

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={`sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}
                    onClick={onClose}
                  >
                    <Icon className="sidebar__link-icon" size={18} />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar__footer">
          <div className="sidebar__footer-row">
            <span className="sidebar__footer-dot" />
            <span>{team.length} Team Members</span>
          </div>
          <div className="sidebar__footer-row">
            <span className={`sidebar__footer-dot ${daysRemaining <= 3 ? 'sidebar__footer-dot--warning' : ''}`} />
            <span>{daysRemaining} Days Left</span>
          </div>
        </div>
      </aside>
    </>
  );
}
