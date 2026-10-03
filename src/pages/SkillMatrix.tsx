import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, Edit3 } from 'lucide-react';
import { useAppState } from '../contexts/AppStateContext';
import { useAuth } from '../contexts/AuthContext';
import type { SkillStatus, MemberRole } from '../types';
import './SkillMatrix.css';

const statusLabels: Record<SkillStatus, string> = {
  'not-started': 'Not Started',
  'learning':    'Learning',
  'practicing':  'Practicing',
  'comfortable': 'Comfortable',
  'can-teach':   'Can Teach',
};

const statusOrder: SkillStatus[] = ['not-started', 'learning', 'practicing', 'comfortable', 'can-teach'];

const roles: MemberRole[] = ['lead', 'researcher', 'designer', 'presenter'];

export default function SkillMatrix() {
  const { state, dispatch } = useAppState();
  const { user, isLead } = useAuth();
  const [expandedCats, setExpandedCats] = useState<Record<string, boolean>>(() => {
    // All expanded by default
    const init: Record<string, boolean> = {};
    state.skillCategories.forEach(c => { init[c.name] = true; });
    return init;
  });
  const [editingCell, setEditingCell] = useState<string | null>(null); // "category|skill|role"
  const [editingSkill, setEditingSkill] = useState<{ category: string, oldSkillName: string } | null>(null);
  const [newSkillName, setNewSkillName] = useState("");

  const toggleCat = (name: string) => {
    setExpandedCats(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const handleStatusChange = (category: string, skill: string, role: MemberRole, status: SkillStatus) => {
    dispatch({
      type: 'UPDATE_SKILL',
      category,
      skill,
      role,
      status,
      actor: user?.name ?? 'Unknown',
    });
    setEditingCell(null);
  };

  const handleRenameSkill = (category: string, oldName: string, newName: string) => {
    if (oldName !== newName && newName.trim()) {
      dispatch({ type: 'RENAME_SKILL', category, oldName, newName, actor: user?.name ?? 'Unknown' });
    }
    setEditingSkill(null);
  };

  // Compute per-member completion % per category
  const getCategoryCompletion = (catName: string, role: MemberRole): number => {
    const cat = state.skillCategories.find(c => c.name === catName);
    if (!cat || cat.skills.length === 0) return 0;
    const done = cat.skills.filter(s => {
      const status = s[role] as SkillStatus;
      return status === 'comfortable' || status === 'can-teach';
    }).length;
    return Math.round((done / cat.skills.length) * 100);
  };

  return (
    <div className="matrix-page">
      {/* Per-member overall summary */}
      <div className="matrix-summary">
        {state.team.map(member => {
          const totalSkills = state.skillCategories.reduce((sum, c) => sum + c.skills.length, 0);
          const completedSkills = state.skillCategories.reduce((sum, c) => {
            return sum + c.skills.filter(s => {
              const st = s[member.role] as SkillStatus;
              return st === 'comfortable' || st === 'can-teach';
            }).length;
          }, 0);
          const pct = totalSkills > 0 ? Math.round((completedSkills / totalSkills) * 100) : 0;
          return (
            <div key={member.id} className="matrix-summary__card">
              <span className="matrix-summary__name">{member.name}</span>
              <span className="matrix-summary__pct" style={{ color: `var(--accent-${member.color})` }}>{pct}%</span>
              <div className="progress-bar" style={{ height: 4 }}>
                <div className="progress-bar__fill" style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      {state.skillCategories.map(cat => {
        const isExpanded = expandedCats[cat.name];
        const gaps = cat.skills.reduce((acc, skill) => {
          let count = 0;
          roles.forEach(role => {
            const st = skill[role] as SkillStatus;
            if (st === 'learning' || st === 'not-started') count++;
          });
          return acc + count;
        }, 0);

        return (
          <div key={cat.name} className="matrix-category">
            <div className="matrix-category__header" onClick={() => toggleCat(cat.name)}>
              <span className="matrix-category__title">{cat.name}</span>
              <div className="matrix-category__meta">
                {gaps > 0 && <span className="matrix-category__gaps">{gaps} gaps</span>}
                {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </div>
            </div>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  style={{ overflow: 'hidden' }}
                >
                  <div className="matrix-content">
                    <div className="matrix-row matrix-row--header">
                      <span>Skill</span>
                      <span>Naivedya</span>
                      <span>Satwik</span>
                      <span>Mohit</span>
                      <span>Pragna</span>
                    </div>
                    {cat.skills.map(skill => (
                      <div key={skill.skill} className="matrix-row">
                        {isLead() && editingSkill?.category === cat.name && editingSkill?.oldSkillName === skill.skill ? (
                          <input
                            className="matrix-skill-name-input"
                            value={newSkillName}
                            onChange={(e) => setNewSkillName(e.target.value)}
                            onBlur={() => handleRenameSkill(cat.name, skill.skill, newSkillName)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleRenameSkill(cat.name, skill.skill, newSkillName); if (e.key === 'Escape') setEditingSkill(null); }}
                            autoFocus
                          />
                        ) : (
                          <span 
                            className="matrix-skill-name"
                            onClick={() => {
                              if (isLead()) {
                                setEditingSkill({ category: cat.name, oldSkillName: skill.skill });
                                setNewSkillName(skill.skill);
                              }
                            }}
                            style={{ cursor: isLead() ? 'text' : 'default', display: 'flex', alignItems: 'center' }}
                          >
                            {skill.skill}
                            {isLead() && <Edit3 size={10} style={{ marginLeft: 6, opacity: 0.5 }} />}
                          </span>
                        )}
                        {roles.map(role => {
                          const status = skill[role] as SkillStatus;
                          const cellKey = `${cat.name}|${skill.skill}|${role}`;
                          const isEditing = editingCell === cellKey;

                          return (
                            <div key={role} className="matrix-cell" onClick={() => {
                              setEditingCell(isEditing ? null : cellKey);
                            }}>
                              {isEditing ? (
                                <select
                                  className="matrix-cell__select"
                                  value={status}
                                  onChange={(e) => handleStatusChange(cat.name, skill.skill, role, e.target.value as SkillStatus)}
                                  onBlur={() => setEditingCell(null)}
                                  autoFocus
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {statusOrder.map(s => (
                                    <option key={s} value={s}>{statusLabels[s]}</option>
                                  ))}
                                </select>
                              ) : (
                                <>
                                  <span className={`status-dot status-dot--${status}`} />
                                  <span className="matrix-cell__text">{statusLabels[status]}</span>
                                  <Edit3 size={10} className="matrix-cell__edit" />
                                </>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ))}

                    {/* Category completion row */}
                    <div className="matrix-row matrix-row--footer">
                      <span className="matrix-skill-name" style={{ fontWeight: 700 }}>Completion</span>
                      {roles.map(role => (
                        <div key={role} className="matrix-cell">
                          <span className="matrix-cell__text" style={{ fontWeight: 600 }}>
                            {getCategoryCompletion(cat.name, role)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
