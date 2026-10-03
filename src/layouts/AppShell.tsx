import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Header from './Header';
import './AppShell.css';

/** Maps route paths to page metadata */
const pageInfo: Record<string, { title: string; description: string }> = {
  '/':              { title: 'Command Center',  description: 'Your team\'s mission control for the 12-day sprint.' },
  '/roadmap':       { title: '12-Day Roadmap',  description: 'Day-by-day preparation plan from foundation to full simulation.' },
  '/learning':      { title: 'Learning Paths',  description: 'Personalized tracks for every team member.' },
  '/skills':        { title: 'Skill Matrix',    description: 'See where the team is strong, learning, or blocked.' },
  '/resources':     { title: 'Resources',       description: 'Curated learning material for the 12-day sprint.' },
  '/team':          { title: 'Members',         description: 'Your 4-person hackathon team.' },
  '/tasks':         { title: 'Tasks',           description: 'Track what needs to get done today and this week.' },
  '/notes':         { title: 'Team Notes',      description: 'Shared research, decisions, and ideas.' },
  '/problem':       { title: 'Problem Mode',    description: 'Turn an unknown challenge into an execution plan.' },
  '/architecture':  { title: 'Architecture',    description: 'Technical system design and component mapping.' },
  '/progress':      { title: 'Progress',        description: 'Team learning and execution metrics.' },
};

export default function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const page = pageInfo[location.pathname] ?? { title: 'CyberForge', description: '' };

  return (
    <div className="app-shell">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="app-shell__main">
        <Header
          title={page.title}
          description={page.description}
          onMenuClick={() => setSidebarOpen((v) => !v)}
        />

        <main className="app-shell__content">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
