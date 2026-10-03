import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Target,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Activity,
} from 'lucide-react';
import { useAppState } from '../contexts/AppStateContext';
import { roadmap, currentDay, daysRemaining } from '../data/store';
import type { SkillStatus, MemberRole } from '../types';
import './CommandCenter.css';

/* ---------- HELPERS ---------- */

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

const statusLabels: Record<SkillStatus, string> = {
  'not-started': 'Not Started',
  'learning':    'Learning',
  'practicing':  'Practicing',
  'comfortable': 'Comfortable',
  'can-teach':   'Can Teach',
};

const roleLabels: Record<MemberRole, string> = {
  lead:       'Lead',
  researcher: 'Researcher',
  designer:   'Designer',
  presenter:  'Presenter',
};

const stagger = {
  container: {
    hidden: {},
    show: { transition: { staggerChildren: 0.06 } },
  },
  item: {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] as const } },
  },
} as const;

/* ============================================================
   COMMAND CENTER
   ============================================================ */

export default function CommandCenter() {
  const navigate = useNavigate();
  const { state, getSkillGaps, getBlockers } = useAppState();
  const today = roadmap[currentDay - 1];
  const skillGaps = getSkillGaps().slice(0, 5);
  const blockers = getBlockers();

  const getMemberName = (role: string) => state.team.find(m => m.role === role)?.name ?? role;

  return (
    <div className="cc">
      {/* ======== HERO — TIME + MISSION ======== */}
      <motion.section
        className="cc-hero"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Time */}
        <div className="cc-hero__time">
          <span className="cc-hero__days-number">{daysRemaining}</span>
          <div className="cc-hero__days-label">
            <span className="cc-hero__days-text">Days Remaining</span>
            <span className="cc-hero__days-sub">
              Day {currentDay} of 12
            </span>
          </div>
        </div>

        <div className="cc-hero__divider" />

        {/* Today's Mission */}
        <div className="cc-mission">
          <div className="cc-mission__header">
            <span className="cc-mission__tag">Today's Mission</span>
            <span className="cc-mission__day-badge">DAY {String(currentDay).padStart(2, '0')}</span>
          </div>

          <h2 className="cc-mission__title">{today.title}</h2>

          <div className="cc-mission__topics">
            {today.objectives.map((obj) => (
              <span key={obj} className="cc-mission__topic">{obj}</span>
            ))}
          </div>

          <div className="cc-mission__deliverable">
            <Target size={16} className="cc-mission__deliverable-icon" />
            <div className="cc-mission__deliverable-content">
              <span className="cc-mission__deliverable-label">Team Deliverable</span>
              <span className="cc-mission__deliverable-text">{today.deliverable}</span>
            </div>
          </div>

          {/* Responsibilities */}
          <motion.div
            className="cc-responsibilities"
            variants={stagger.container}
            initial="hidden"
            animate="show"
          >
            {state.team.map((member) => (
              <motion.div key={member.id} className="cc-responsibility" variants={stagger.item}>
                <div className="cc-responsibility__header">
                  <div
                    className="avatar avatar--sm"
                    style={{
                      background: avatarColors[member.color],
                      color: avatarTextColors[member.color],
                    }}
                  >
                    {member.initials}
                  </div>
                  <span className="cc-responsibility__name">
                    {roleLabels[member.role]}
                  </span>
                </div>
                <span className="cc-responsibility__task">
                  {today.teamAssignments[member.role]}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* ======== TEAM STATUS ======== */}
      <section className="cc-section">
        <div className="cc-section__header">
          <h2 className="cc-section__title">Team Status</h2>
          <button className="cc-section__action" onClick={() => navigate('/team')}>
            View Team <ChevronRight size={14} />
          </button>
        </div>

        <motion.div
          className="cc-team"
          variants={stagger.container}
          initial="hidden"
          animate="show"
        >
          {state.team.map((member) => (
            <motion.div key={member.id} className="cc-member" variants={stagger.item}>
              <div className="cc-member__top">
                <div
                  className="avatar"
                  style={{
                    background: avatarColors[member.color],
                    color: avatarTextColors[member.color],
                  }}
                >
                  {member.initials}
                </div>
                <div className="cc-member__info">
                  <div className="cc-member__name">{member.name}</div>
                  <div className="cc-member__role">{member.title}</div>
                </div>
              </div>

              <div className="cc-member__focus">{member.currentFocus}</div>

              <div className="cc-member__task">
                <span className="cc-member__task-label">Building</span>
                <span className="cc-member__task-text">{member.currentTask}</span>
              </div>

              <div className="cc-member__progress">
                <div className="progress-bar" style={{ flex: 1 }}>
                  <motion.div
                    className="progress-bar__fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${member.progress}%` }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                  />
                </div>
                <span className="cc-member__progress-value">{member.progress}%</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ======== BOTTOM — GAPS + BLOCKERS + ACTIVITY ======== */}
      <div className="cc-bottom">
        {/* Skill Gaps */}
        <section className="cc-section">
          <div className="cc-section__header">
            <h2 className="cc-section__title">Top Skill Gaps</h2>
            <button className="cc-section__action" onClick={() => navigate('/skills')}>
              Full Matrix <ArrowRight size={14} />
            </button>
          </div>

          <motion.div
            className="cc-gaps"
            variants={stagger.container}
            initial="hidden"
            animate="show"
          >
            {skillGaps.length === 0 ? (
              <div className="cc-blockers--empty">
                <CheckCircle2 size={16} />
                <span>No skill gaps — team is fully prepared.</span>
              </div>
            ) : (
              skillGaps.map((gap, i) => (
                <motion.div key={`${gap.skill}-${gap.member}-${i}`} className="cc-gap" variants={stagger.item}>
                  <span className="cc-gap__skill">{gap.skill}</span>
                  <div className="cc-gap__info">
                    <span className="cc-gap__member">{getMemberName(gap.member)}</span>
                    <span className="cc-gap__arrow">→</span>
                    <span className="cc-gap__status">
                      <span className={`status-dot status-dot--${gap.currentStatus}`} />
                      <span>{statusLabels[gap.currentStatus]}</span>
                    </span>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </section>

        {/* Blockers */}
        <section className="cc-section">
          <div className="cc-section__header">
            <h2 className="cc-section__title">Blockers</h2>
          </div>

          {blockers.length === 0 ? (
            <div className="cc-blockers--empty">
              <CheckCircle2 size={16} />
              <span>No blockers — all clear.</span>
            </div>
          ) : (
            <motion.div
              className="cc-blockers"
              variants={stagger.container}
              initial="hidden"
              animate="show"
            >
              {blockers.map((blocker) => (
                <motion.div key={blocker.id} className="cc-blocker" variants={stagger.item}>
                  <AlertTriangle size={14} className="cc-blocker__icon" />
                  <span className="cc-blocker__text">
                    <span className="cc-blocker__member">{getMemberName(blocker.member)}</span>
                    {' '}{blocker.description}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>
      </div>

      {/* ======== ACTIVITY LOG ======== */}
      {state.activityLog.length > 0 && (
        <section className="cc-section">
          <div className="cc-section__header">
            <h2 className="cc-section__title">
              <Activity size={16} style={{ marginRight: 'var(--sp-2)', opacity: 0.6 }} />
              Recent Activity
            </h2>
          </div>
          <div className="cc-activity">
            {state.activityLog.slice(0, 8).map(log => (
              <div key={log.id} className="cc-activity__item">
                <span className="cc-activity__msg">{log.message}</span>
                <span className="cc-activity__time">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
