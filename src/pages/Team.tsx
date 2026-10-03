import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Target } from 'lucide-react';
import { useAppState } from '../contexts/AppStateContext';
import type { TeamMember } from '../types';
import './Team.css';

const avatarColors: Record<string, string> = {
  cyan: 'var(--accent-cyan-dim)', green: 'var(--accent-green-dim)',
  blue: 'var(--accent-blue-dim)', amber: 'var(--color-warning-dim)',
};
const avatarTextColors: Record<string, string> = {
  cyan: 'var(--accent-cyan)', green: 'var(--accent-green)',
  blue: 'var(--accent-blue)', amber: 'var(--color-warning)',
};

export default function Team() {
  const { state, getSkillGaps, getTodaysTasks } = useAppState();
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const stagger = {
    container: { show: { transition: { staggerChildren: 0.05 } } },
    item: { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } },
  };

  return (
    <div className="team-page">
      <motion.div
        className="team-grid"
        variants={stagger.container}
        initial="hidden"
        animate="show"
      >
        {state.team.map((member) => (
          <motion.div
            key={member.id}
            className="team-card"
            variants={stagger.item}
            onClick={() => setSelectedMember(member)}
          >
            <div className="team-card__top">
              <div className="avatar avatar--xl" style={{ background: avatarColors[member.color], color: avatarTextColors[member.color] }}>
                {member.initials}
              </div>
              <div>
                <div className="team-card__name">{member.name}</div>
                <div className="team-card__title">{member.title}</div>
              </div>
            </div>

            <div className="team-card__tracks">
              <div className="team-card__track">{member.primaryTrack}</div>
              <div className="team-card__track team-card__track--sub">{member.secondaryTrack}</div>
            </div>

            <div className="team-card__divider" />

            <div className="team-card__section">
              <span className="team-card__label">Current Focus</span>
              <span className="team-card__value">{member.currentFocus}</span>
            </div>

            <div className="team-card__section">
              <span className="team-card__label">Task</span>
              <span className="team-card__value">{member.currentTask}</span>
            </div>

            <div className="team-card__section">
              <span className="team-card__label">Learning Progress</span>
              <div className="progress-bar" style={{ marginTop: 4 }}>
                <div className="progress-bar__fill" style={{ width: `${member.progress}%` }} />
              </div>
              <span className="text-meta text-tertiary" style={{ marginTop: 2 }}>{member.progress}%</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* SIDE PANEL */}
      <AnimatePresence>
        {selectedMember && (
          <>
            <motion.div className="team-panel-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedMember(null)} />
            <motion.div className="team-panel" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}>
              <button className="team-panel__close" onClick={() => setSelectedMember(null)}>
                <X size={24} />
              </button>

              <div className="team-panel__header">
                <div className="avatar avatar--lg" style={{ background: avatarColors[selectedMember.color], color: avatarTextColors[selectedMember.color] }}>
                  {selectedMember.initials}
                </div>
                <div>
                  <h2 className="team-panel__name">{selectedMember.name}</h2>
                  <div className="team-panel__role">{selectedMember.title}</div>
                </div>
              </div>

              <div className="cc-section">
                <h3 className="section-label">Today's Tasks</h3>
                <div className="rm-list">
                  {getTodaysTasks()
                    .filter(t => t.owner === selectedMember.role)
                    .map(t => (
                      <div key={t.id} className="rm-list-item">
                        <Target size={16} className="rm-list-item__icon" />
                        <span>{t.title}</span>
                      </div>
                    ))}
                  {getTodaysTasks().filter(t => t.owner === selectedMember.role).length === 0 && (
                    <span className="text-tertiary text-sm">No tasks assigned for today.</span>
                  )}
                </div>
              </div>

              <div className="cc-section">
                <h3 className="section-label">Top Skill Gaps</h3>
                <div className="rm-list">
                  {getSkillGaps()
                    .filter(g => g.member === selectedMember.role)
                    .slice(0, 5)
                    .map((g, i) => (
                      <div key={i} className="cc-gap" style={{ background: 'var(--glass-base)' }}>
                        <span className="cc-gap__skill">{g.skill}</span>
                        <div className="cc-gap__status">
                          <span className={`status-dot status-dot--${g.currentStatus}`} />
                          <span className="text-meta text-tertiary">{g.currentStatus}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
