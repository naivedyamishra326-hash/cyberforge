import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Clock, ExternalLink, Plus, Trash2, CheckCircle2, X } from 'lucide-react';
import { useAppState } from '../contexts/AppStateContext';
import { useAuth } from '../contexts/AuthContext';
import LeadOnly from '../components/LeadOnly';
import type { ResourceCategory } from '../types';
import './Resources.css';

const categories = ['All', 'Core', 'Optional', 'Cybersecurity', 'AI / ML', 'Development', 'Design', 'Presentation'];

function isYouTubeUrl(url?: string): boolean {
  if (!url) return false;
  return url.includes('youtube.com') || url.includes('youtu.be');
}

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=))([^&?\s]+)/);
  return match ? match[1] : null;
}

export default function Resources() {
  const { state, dispatch } = useAppState();
  const { user, isLead } = useAuth();
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRes, setNewRes] = useState({
    title: '', description: '', url: '', category: 'cybersecurity' as ResourceCategory,
    priority: 'optional' as 'core' | 'optional', estimatedMinutes: 30,
  });

  const filteredResources = state.resources.filter(res => {
    const matchesSearch = res.title.toLowerCase().includes(search.toLowerCase()) || res.description.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (filter === 'All') return true;
    if (filter === 'Core') return res.priority === 'core';
    if (filter === 'Optional') return res.priority === 'optional';
    const catMap: Record<string, ResourceCategory> = {
      'Cybersecurity': 'cybersecurity', 'AI / ML': 'ai-ml', 'Development': 'development',
      'Design': 'design', 'Presentation': 'presentation',
    };
    return res.category === catMap[filter];
  });

  const handleAddResource = () => {
    if (!newRes.title.trim()) return;
    dispatch({
      type: 'ADD_RESOURCE',
      resource: {
        title: newRes.title,
        description: newRes.description,
        url: newRes.url || undefined,
        category: newRes.category,
        priority: newRes.priority,
        estimatedMinutes: newRes.estimatedMinutes,
        relevantMembers: ['lead', 'researcher', 'designer', 'presenter'],
      },
      actor: user?.name ?? 'Unknown',
    });
    setNewRes({ title: '', description: '', url: '', category: 'cybersecurity', priority: 'optional', estimatedMinutes: 30 });
    setShowAddForm(false);
  };

  const handleComplete = (resourceId: string) => {
    if (!user) return;
    dispatch({
      type: 'COMPLETE_RESOURCE',
      resourceId,
      role: user.role,
      actor: user.name,
    });
  };

  const isCompleted = (resourceId: string): boolean => {
    if (!user) return false;
    return (state.completedResources[resourceId] || []).includes(user.role);
  };

  return (
    <div className="resources-page">
      <div className="resources-controls">
        <div style={{ display: 'flex', gap: 'var(--sp-3)', alignItems: 'center' }}>
          <div className="resources-search" style={{ flex: 1 }}>
            <Search size={18} className="text-secondary" />
            <input type="text" placeholder="Search resources..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <LeadOnly showLock={false}>
            <button className="btn btn--primary" onClick={() => setShowAddForm(!showAddForm)}>
              <Plus size={14} /> Add Resource
            </button>
          </LeadOnly>
        </div>
        <div className="resources-filters">
          {categories.map(c => (
            <button key={c} className={`resource-filter ${filter === c ? 'resource-filter--active' : ''}`} onClick={() => setFilter(c)}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* ADD FORM */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            className="resource-add-form"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div className="resource-add-form__inner">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 className="section-label">Add New Resource</h3>
                <button className="btn btn--ghost" onClick={() => setShowAddForm(false)}><X size={16} /></button>
              </div>
              <div className="resource-add-form__grid">
                <div className="login-field">
                  <label className="login-field__label">Title</label>
                  <input className="login-field__input" value={newRes.title} onChange={(e) => setNewRes(p => ({ ...p, title: e.target.value }))} placeholder="Resource title..." />
                </div>
                <div className="login-field">
                  <label className="login-field__label">URL (YouTube, article, etc.)</label>
                  <input className="login-field__input" value={newRes.url} onChange={(e) => setNewRes(p => ({ ...p, url: e.target.value }))} placeholder="https://..." />
                </div>
                <div className="login-field">
                  <label className="login-field__label">Description</label>
                  <input className="login-field__input" value={newRes.description} onChange={(e) => setNewRes(p => ({ ...p, description: e.target.value }))} placeholder="Brief description..." />
                </div>
                <div style={{ display: 'flex', gap: 'var(--sp-3)' }}>
                  <div className="login-field" style={{ flex: 1 }}>
                    <label className="login-field__label">Category</label>
                    <select className="login-field__input" value={newRes.category} onChange={(e) => setNewRes(p => ({ ...p, category: e.target.value as ResourceCategory }))}>
                      <option value="cybersecurity">Cybersecurity</option>
                      <option value="ai-ml">AI / ML</option>
                      <option value="development">Development</option>
                      <option value="design">Design</option>
                      <option value="presentation">Presentation</option>
                    </select>
                  </div>
                  <div className="login-field" style={{ flex: 1 }}>
                    <label className="login-field__label">Priority</label>
                    <select className="login-field__input" value={newRes.priority} onChange={(e) => setNewRes(p => ({ ...p, priority: e.target.value as 'core' | 'optional' }))}>
                      <option value="core">Core</option>
                      <option value="optional">Optional</option>
                    </select>
                  </div>
                  <div className="login-field" style={{ width: 100 }}>
                    <label className="login-field__label">Minutes</label>
                    <input className="login-field__input" type="number" value={newRes.estimatedMinutes} onChange={(e) => setNewRes(p => ({ ...p, estimatedMinutes: parseInt(e.target.value) || 0 }))} />
                  </div>
                </div>
              </div>
              <button className="btn btn--primary" onClick={handleAddResource} disabled={!newRes.title.trim()} style={{ alignSelf: 'flex-end' }}>
                Add Resource
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* RESOURCE GRID */}
      <motion.div layout className="resources-grid">
        <AnimatePresence>
          {filteredResources.map(res => {
            const completed = isCompleted(res.id);
            const ytId = res.url ? getYouTubeId(res.url) : null;

            return (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                key={res.id}
                className={`resource-card ${completed ? 'resource-card--completed' : ''}`}
              >
                {/* YouTube Preview */}
                {ytId && (
                  <div className="resource-card__yt">
                    <img src={`https://img.youtube.com/vi/${ytId}/mqdefault.jpg`} alt="" className="resource-card__yt-thumb" />
                  </div>
                )}

                <div className="resource-card__top">
                  <span className="status-badge" style={{ background: 'var(--glass-base)' }}>
                    {res.category.replace('-', ' ')}
                  </span>
                  <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
                    {res.priority === 'core' && <span className="status-badge status-badge--warning">CORE</span>}
                    {isYouTubeUrl(res.url) && <span className="status-badge" style={{ background: 'rgba(255,0,0,0.15)', color: '#f00' }}>YT</span>}
                  </div>
                </div>
                <h3 className="resource-card__title">{res.title}</h3>
                <p className="resource-card__desc">{res.description}</p>

                <div className="resource-card__meta">
                  <span className="text-meta text-tertiary" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={12} /> {res.estimatedMinutes}m
                  </span>

                  <div style={{ display: 'flex', gap: 'var(--sp-2)', marginLeft: 'auto' }}>
                    {!completed && (
                      <button className="btn btn--ghost" style={{ fontSize: 11, padding: '2px 8px' }} onClick={() => handleComplete(res.id)}>
                        <CheckCircle2 size={12} /> Done
                      </button>
                    )}
                    {completed && (
                      <span className="status-badge" style={{ background: 'rgba(52,211,153,0.15)', color: 'var(--accent-green)' }}>
                        <CheckCircle2 size={10} /> Completed
                      </span>
                    )}
                    {res.url && (
                      <a href={res.url} target="_blank" rel="noopener noreferrer" className="btn btn--ghost" style={{ fontSize: 11, padding: '2px 8px' }}>
                        <ExternalLink size={12} /> Open
                      </a>
                    )}
                    {isLead() && (
                      <button className="btn btn--ghost" style={{ fontSize: 11, padding: '2px 8px', color: 'var(--color-danger)' }} onClick={() => dispatch({ type: 'DELETE_RESOURCE', resourceId: res.id, actor: user?.name ?? '' })}>
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
