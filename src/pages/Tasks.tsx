import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { useAppState } from '../contexts/AppStateContext';
import { useAuth } from '../contexts/AuthContext';
import LeadOnly from '../components/LeadOnly';
import type { TaskStatus, MemberRole } from '../types';
import './Tasks.css';

const columns: { id: TaskStatus; label: string }[] = [
  { id: 'today', label: 'Today' },
  { id: 'upcoming', label: 'Up Next' },
  { id: 'blocked', label: 'Blocked' },
  { id: 'done', label: 'Done' },
];

const nextStatusMap: Record<TaskStatus, TaskStatus> = {
  'upcoming': 'today',
  'today': 'done',
  'blocked': 'today',
  'done': 'upcoming',
};

export default function Tasks() {
  const { state, dispatch } = useAppState();
  const { user } = useAuth();
  const [showAdd, setShowAdd] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', owner: 'lead' as MemberRole, priority: 'medium' as 'high' | 'medium' | 'low', estimatedMinutes: 60 });

  const stagger = {
    container: { show: { transition: { staggerChildren: 0.05 } } },
    item: { hidden: { opacity: 0, scale: 0.95 }, show: { opacity: 1, scale: 1 } },
  };

  const handleMoveTask = (taskId: string, currentStatus: TaskStatus) => {
    dispatch({
      type: 'UPDATE_TASK_STATUS',
      taskId,
      status: nextStatusMap[currentStatus],
      actor: user?.name ?? 'Unknown',
    });
  };

  const handleAddTask = () => {
    if (!newTask.title.trim()) return;
    dispatch({
      type: 'ADD_TASK',
      task: { title: newTask.title, owner: newTask.owner, status: 'upcoming', priority: newTask.priority, estimatedMinutes: newTask.estimatedMinutes, day: 4 },
      actor: user?.name ?? 'Unknown',
    });
    setNewTask({ title: '', owner: 'lead', priority: 'medium', estimatedMinutes: 60 });
    setShowAdd(false);
  };

  return (
    <div className="tasks-page">
      <LeadOnly showLock={false}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 'var(--sp-2)' }}>
          <button className="btn btn--primary" onClick={() => setShowAdd(!showAdd)}>
            <Plus size={14} /> Add Task
          </button>
        </div>
      </LeadOnly>

      {/* ADD FORM */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div className="resource-add-form__inner" style={{ marginBottom: 'var(--sp-4)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 className="section-label">New Task</h3>
                <button className="btn btn--ghost" onClick={() => setShowAdd(false)}><X size={16} /></button>
              </div>
              <div style={{ display: 'flex', gap: 'var(--sp-3)', flexWrap: 'wrap' }}>
                <div className="login-field" style={{ flex: 2 }}>
                  <label className="login-field__label">Title</label>
                  <input className="login-field__input" value={newTask.title} onChange={(e) => setNewTask(p => ({ ...p, title: e.target.value }))} placeholder="Task title..." onKeyDown={(e) => { if (e.key === 'Enter') handleAddTask(); }} />
                </div>
                <div className="login-field" style={{ flex: 1 }}>
                  <label className="login-field__label">Owner</label>
                  <select className="login-field__input" value={newTask.owner} onChange={(e) => setNewTask(p => ({ ...p, owner: e.target.value as MemberRole }))}>
                    <option value="lead">Lead</option>
                    <option value="researcher">Researcher</option>
                    <option value="designer">Designer</option>
                    <option value="presenter">Presenter</option>
                  </select>
                </div>
                <div className="login-field" style={{ flex: 1 }}>
                  <label className="login-field__label">Priority</label>
                  <select className="login-field__input" value={newTask.priority} onChange={(e) => setNewTask(p => ({ ...p, priority: e.target.value as any }))}>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>
              <button className="btn btn--primary" onClick={handleAddTask} disabled={!newTask.title.trim()} style={{ alignSelf: 'flex-end' }}>
                Add Task
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="tasks-hint">
        <span className="text-meta text-tertiary">Click a task card to move it to the next column →</span>
      </div>

      <div className="tasks-board">
        {columns.map(col => {
          const colTasks = state.tasks.filter(t => t.status === col.id);

          return (
            <div key={col.id} className="task-col">
              <div className="task-col__header">
                <span className="task-col__title">{col.label}</span>
                <span className="task-col__count">{colTasks.length}</span>
              </div>

              <motion.div
                variants={stagger.container}
                initial="hidden"
                animate="show"
                style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}
              >
                {colTasks.map(task => {
                  const owner = state.team.find(m => m.role === task.owner);

                  return (
                    <motion.div
                      key={task.id}
                      className="task-card"
                      variants={stagger.item}
                      onClick={() => handleMoveTask(task.id, task.status)}
                      title={`Click to move to "${nextStatusMap[task.status]}"`}
                    >
                      <span className="task-card__title">{task.title}</span>
                      <div className="task-card__meta">
                        <div className="task-card__badges">
                          <span className={`task-badge task-badge--${task.priority}`}>
                            {task.priority}
                          </span>
                          <span className="text-meta text-tertiary">{task.estimatedMinutes}m</span>
                        </div>
                        {owner && (
                          <div className="avatar avatar--sm avatar--cyan" title={owner.name}>
                            {owner.initials}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
