import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Lock, Save, CheckCircle2, Clock } from 'lucide-react';
import { useAppState } from '../contexts/AppStateContext';
import { useAuth } from '../contexts/AuthContext';
import type { MemberRole } from '../types';
import './ProblemMode.css';

export default function ProblemMode() {
  const { state, dispatch } = useAppState();
  const { isLead } = useAuth();
  const lead = isLead();

  // Timer
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(4 * 60 * 60); // 4 hours
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (timerRunning && timerSeconds > 0) {
      intervalRef.current = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) {
            setTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [timerRunning]);

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const completedStages = state.problem.stages.filter(s => s.status === 'completed').length;
  const progressPct = Math.round((completedStages / state.problem.stages.length) * 100);

  return (
    <div className="problem-page">
      {/* Timer Bar */}
      <div className="problem-timer">
        <div className="problem-timer__display">
          <Clock size={16} />
          <span className="problem-timer__time">{formatTime(timerSeconds)}</span>
        </div>
        <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
          <button
            className="btn btn--secondary"
            onClick={() => setTimerRunning(!timerRunning)}
          >
            {timerRunning ? <><Pause size={14} /> Pause</> : <><Play size={14} /> Start Timer</>}
          </button>
          <button
            className="btn btn--ghost"
            onClick={() => { setTimerRunning(false); setTimerSeconds(4 * 60 * 60); }}
          >
            Reset
          </button>
        </div>
        <div className="problem-timer__progress">
          <span className="text-meta text-tertiary">{completedStages}/{state.problem.stages.length} stages</span>
          <div className="progress-bar" style={{ width: 120, height: 4 }}>
            <div className="progress-bar__fill" style={{ width: `${progressPct}%` }} />
          </div>
        </div>
      </div>

      {/* Problem Statement */}
      <div className="problem-input">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="cc-section__title">Problem Statement</h2>
          {!lead && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', color: 'var(--text-tertiary)', fontSize: 'var(--fs-small)' }}>
              <Lock size={14} /> View Only
            </div>
          )}
          {state.problem.savedAt && (
            <span className="text-meta text-tertiary">
              Saved {new Date(state.problem.savedAt).toLocaleTimeString()}
            </span>
          )}
        </div>
        <textarea
          className="problem-textarea"
          placeholder={lead ? 'Paste the hackathon problem statement here...' : 'Waiting for Team Lead to add the problem statement...'}
          value={state.problem.text}
          onChange={(e) => lead && dispatch({ type: 'UPDATE_PROBLEM_TEXT', text: e.target.value })}
          readOnly={!lead}
          style={{ opacity: lead ? 1 : 0.7 }}
        />
        {lead && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--sp-3)' }}>
            <button className="btn btn--primary" onClick={() => dispatch({ type: 'SAVE_PROBLEM' })} disabled={!state.problem.text.trim()}>
              <Save size={14} /> SAVE
            </button>
          </div>
        )}
      </div>

      {/* Execution Flow */}
      <div className="cc-section">
        <h2 className="section-label" style={{ textAlign: 'center' }}>Execution Flow</h2>

        <div className="workflow-container">
          {state.problem.stages.map((stage, i) => (
            <div key={stage.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
              <motion.div
                className={`workflow-node ${stage.status === 'in-progress' ? 'workflow-node--active' : ''} ${stage.status === 'completed' ? 'workflow-node--completed' : ''}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="workflow-node__left">
                  <div
                    className="workflow-node__number"
                    style={{
                      background: stage.status === 'completed' ? 'var(--accent-green)' : stage.status === 'in-progress' ? 'var(--accent-cyan)' : 'var(--glass-base)',
                      color: stage.status !== 'pending' ? 'var(--bg-deepest)' : 'var(--text-secondary)',
                    }}
                  >
                    {stage.status === 'completed' ? <CheckCircle2 size={12} /> : i + 1}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span className="workflow-node__title">{stage.name}</span>
                    {stage.assignee !== 'unassigned' && (
                      <span className="text-meta" style={{ color: 'var(--text-tertiary)' }}>
                        {state.team.find(m => m.role === stage.assignee)?.name || stage.assignee}
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
                  {lead && (
                    <select
                      className="assignee-select"
                      value={stage.status}
                      onChange={(e) => dispatch({ type: 'UPDATE_PROBLEM_STAGE', stageIndex: i, updates: { status: e.target.value as any } })}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  )}
                  {lead && (
                    <select
                      className="assignee-select"
                      value={stage.assignee}
                      onChange={(e) => dispatch({ type: 'UPDATE_PROBLEM_STAGE', stageIndex: i, updates: { assignee: e.target.value as MemberRole | 'unassigned' } })}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value="unassigned">Unassigned</option>
                      <option value="lead">Lead</option>
                      <option value="researcher">Researcher</option>
                      <option value="designer">Designer</option>
                      <option value="presenter">Presenter</option>
                    </select>
                  )}
                </div>
              </motion.div>

              {/* Stage notes (Lead editable) */}
              {(stage.notes || lead) && (
                <div className="workflow-node__notes">
                  {lead ? (
                    <textarea
                      className="workflow-node__notes-input"
                      placeholder="Add notes for this stage..."
                      value={stage.notes}
                      onChange={(e) => dispatch({ type: 'UPDATE_PROBLEM_STAGE', stageIndex: i, updates: { notes: e.target.value } })}
                    />
                  ) : stage.notes ? (
                    <p className="text-sm text-secondary">{stage.notes}</p>
                  ) : null}
                </div>
              )}

              {i < state.problem.stages.length - 1 && (
                <div className="workflow-connector" style={{ background: stage.status === 'completed' ? 'var(--accent-green)' : 'var(--border-strong)' }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
