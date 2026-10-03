import { motion } from 'framer-motion';
import { useAppState } from '../contexts/AppStateContext';
import type { SkillStatus, MemberRole } from '../types';
import './Progress.css';

const avatarColors: Record<string, string> = {
  cyan: 'var(--accent-cyan-dim)', green: 'var(--accent-green-dim)',
  blue: 'var(--accent-blue-dim)', amber: 'var(--color-warning-dim)',
};
const avatarTextColors: Record<string, string> = {
  cyan: 'var(--accent-cyan)', green: 'var(--accent-green)',
  blue: 'var(--accent-blue)', amber: 'var(--color-warning)',
};

export default function Progress() {
  const { state } = useAppState();

  // Overall stats
  const totalTasks = state.tasks.length;
  const completedTasks = state.tasks.filter(t => t.status === 'done').length;
  const taskPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const overallReadiness = state.team.length > 0
    ? Math.round(state.team.reduce((sum, m) => sum + m.progress, 0) / state.team.length)
    : 0;

  // Per-member skill breakdown
  const getSkillBreakdown = (role: MemberRole) => {
    return state.skillCategories.map(cat => {
      const total = cat.skills.length;
      const done = cat.skills.filter(s => {
        const st = s[role] as SkillStatus;
        return st === 'comfortable' || st === 'can-teach';
      }).length;
      return { name: cat.name, pct: total > 0 ? Math.round((done / total) * 100) : 0 };
    });
  };

  // Find weakest category per member
  const getWeakest = (role: MemberRole): string => {
    const breakdown = getSkillBreakdown(role);
    const weakest = breakdown.reduce((min, b) => b.pct < min.pct ? b : min, breakdown[0]);
    return weakest?.name ?? 'N/A';
  };

  return (
    <div className="progress-page">
      {/* OVERALL METRICS */}
      <div className="metrics-grid">
        <motion.div className="metric-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h3 className="metric-card__title">Team Readiness</h3>
          <span className="metric-card__value" style={{ color: 'var(--accent-cyan)' }}>{overallReadiness}%</span>
          <div className="progress-bar">
            <div className="progress-bar__fill" style={{ width: `${overallReadiness}%` }} />
          </div>
        </motion.div>

        <motion.div className="metric-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h3 className="metric-card__title">Tasks Done</h3>
          <span className="metric-card__value">{completedTasks} <span className="text-tertiary" style={{ fontSize: '1rem' }}>/ {totalTasks}</span></span>
          <div className="progress-bar">
            <div className="progress-bar__fill" style={{ width: `${taskPct}%` }} />
          </div>
        </motion.div>

        <motion.div className="metric-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h3 className="metric-card__title">Resources Completed</h3>
          <span className="metric-card__value" style={{ color: 'var(--accent-green)' }}>
            {Object.keys(state.completedResources).length}
            <span className="text-tertiary" style={{ fontSize: '1rem' }}> / {state.resources.length}</span>
          </span>
        </motion.div>
      </div>

      {/* INDIVIDUAL MEMBER CARDS */}
      <div className="cc-section">
        <h2 className="section-label">Individual Progress</h2>
        <div className="progress-members">
          {state.team.map((member, idx) => {
            const path = state.learningPaths.find(p => p.role === member.role);
            const pathTotal = path?.nodes.length ?? 0;
            const pathDone = path?.nodes.filter(n => n.status === 'completed').length ?? 0;
            const pathPct = pathTotal > 0 ? Math.round((pathDone / pathTotal) * 100) : 0;

            const breakdown = getSkillBreakdown(member.role);
            const weakest = getWeakest(member.role);

            const memberTasks = state.tasks.filter(t => t.owner === member.role);
            const memberTasksDone = memberTasks.filter(t => t.status === 'done').length;

            return (
              <motion.div
                key={member.id}
                className="progress-member-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + idx * 0.08 }}
              >
                <div className="progress-member-card__header">
                  <div
                    className="avatar"
                    style={{ background: avatarColors[member.color], color: avatarTextColors[member.color] }}
                  >
                    {member.initials}
                  </div>
                  <div>
                    <div className="progress-member-card__name">{member.name}</div>
                    <div className="progress-member-card__role">{member.title}</div>
                  </div>
                  <span className="progress-member-card__pct" style={{ color: `var(--accent-${member.color})` }}>
                    {member.progress}%
                  </span>
                </div>

                {/* Learning path progress */}
                <div className="progress-member-card__section">
                  <span className="progress-member-card__label">Learning Path</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
                    <div className="progress-bar" style={{ flex: 1, height: 6 }}>
                      <div className="progress-bar__fill" style={{ width: `${pathPct}%` }} />
                    </div>
                    <span className="text-meta" style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{pathDone}/{pathTotal}</span>
                  </div>
                </div>

                {/* Skill category bars */}
                <div className="progress-member-card__section">
                  <span className="progress-member-card__label">Skill Coverage</span>
                  <div className="progress-member-card__bars">
                    {breakdown.map(b => (
                      <div key={b.name} className="progress-mini-bar">
                        <span className="progress-mini-bar__label">{b.name}</span>
                        <div className="progress-bar" style={{ flex: 1, height: 4 }}>
                          <div className="progress-bar__fill" style={{ width: `${b.pct}%` }} />
                        </div>
                        <span className="progress-mini-bar__pct">{b.pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Flaw detection */}
                <div className="progress-member-card__flaw">
                  <span className="progress-member-card__label">⚠ Weakest Area</span>
                  <span className="text-sm" style={{ color: 'var(--color-warning)' }}>{weakest}</span>
                </div>

                {/* Tasks */}
                <div className="progress-member-card__tasks">
                  <span className="text-meta text-tertiary">Tasks: {memberTasksDone}/{memberTasks.length} done</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
