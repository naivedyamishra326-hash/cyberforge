import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, X, ZoomIn, ZoomOut, Maximize, Hand } from 'lucide-react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { useAppState } from '../contexts/AppStateContext';
import { useAuth } from '../contexts/AuthContext';
import type { LearningNodeStatus } from '../contexts/AppStateContext';
import './LearningPaths.css';

const statusColors: Record<LearningNodeStatus, string> = {
  'not-started': 'var(--border-strong)',
  'in-progress': 'var(--color-warning)',
  'completed':   'var(--accent-green)',
};

const nextStatus: Record<LearningNodeStatus, LearningNodeStatus> = {
  'not-started': 'in-progress',
  'in-progress': 'completed',
  'completed':   'not-started',
};

export default function LearningPaths() {
  const { state, dispatch } = useAppState();
  const { user, isLead } = useAuth();
  const [addingFor, setAddingFor] = useState<string | null>(null);
  const [newLabel, setNewLabel] = useState('');

  const stagger = {
    container: { show: { transition: { staggerChildren: 0.06 } } },
    item: { hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0 } },
  };

  const handleNodeClick = (role: string, nodeId: string, currentStatus: LearningNodeStatus) => {
    dispatch({
      type: 'UPDATE_LEARNING_NODE',
      role: role as any,
      nodeId,
      status: nextStatus[currentStatus],
      actor: user?.name ?? 'Unknown',
    });
  };

  const handleAddNode = (role: string) => {
    if (!newLabel.trim()) return;
    dispatch({
      type: 'ADD_LEARNING_NODE',
      role: role as any,
      label: newLabel.trim(),
      actor: user?.name ?? 'Unknown',
    });
    setNewLabel('');
    setAddingFor(null);
  };

  const handleRemoveNode = (role: string, nodeId: string) => {
    dispatch({
      type: 'REMOVE_LEARNING_NODE',
      role: role as any,
      nodeId,
      actor: user?.name ?? 'Unknown',
    });
  };

  return (
    <div className="paths-page">
      {/* Legend */}
      <div className="paths-legend">
        <span className="paths-legend__item">
          <span className="paths-legend__dot" style={{ background: statusColors['not-started'] }} />
          Not Started
        </span>
        <span className="paths-legend__item">
          <span className="paths-legend__dot" style={{ background: statusColors['in-progress'] }} />
          In Progress
        </span>
        <span className="paths-legend__item">
          <span className="paths-legend__dot" style={{ background: statusColors['completed'] }} />
          Completed
        </span>
        <span className="paths-legend__hint">Click a node to cycle its status</span>
      </div>

      {state.learningPaths.map((path) => {
        const member = state.team.find(m => m.role === path.role);
        if (!member) return null;

        const completed = path.nodes.filter(n => n.status === 'completed').length;
        const pct = path.nodes.length > 0 ? Math.round((completed / path.nodes.length) * 100) : 0;

        return (
          <div key={path.role} className="path-section">
            <div className="path-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
                <span className="path-role" style={{ color: `var(--accent-${member.color})` }}>
                  {member.role}
                </span>
                <span className="text-secondary">— {member.name}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
                <span className="path-progress">{pct}%</span>
                <div className="progress-bar" style={{ width: 80, height: 4 }}>
                  <div className="progress-bar__fill" style={{ width: `${pct}%` }} />
                </div>
              </div>
            </div>

            <div className="path-interactive-area">
              <TransformWrapper
                initialScale={1}
                minScale={0.5}
                maxScale={3}
                centerOnInit={false}
                wheel={{ step: 0.1 }}
                panning={{ velocityDisabled: true }}
              >
                {({ zoomIn, zoomOut, resetTransform }) => (
                  <div className="path-zoom-container">
                    <div className="path-zoom-controls">
                      <button className="path-zoom-btn" onClick={() => zoomIn()} title="Zoom In">
                        <ZoomIn size={14} />
                      </button>
                      <button className="path-zoom-btn" onClick={() => zoomOut()} title="Zoom Out">
                        <ZoomOut size={14} />
                      </button>
                      <button className="path-zoom-btn" onClick={() => resetTransform()} title="Reset Zoom/Pan">
                        <Maximize size={14} />
                      </button>
                      <span className="text-meta text-tertiary" style={{ marginLeft: 'var(--sp-2)' }}>
                        <Hand size={12} style={{ display: 'inline-block', marginRight: 4, verticalAlign: 'text-top' }}/> 
                        Click & drag to pan
                      </span>
                    </div>

                    <TransformComponent wrapperClass="path-transform-wrapper" contentClass="path-transform-content">
                      <motion.div
                        className="path-track"
                        variants={stagger.container}
                        initial="hidden"
                        animate="show"
                      >
                        {path.nodes.map((node, i) => (
                          <motion.div key={node.id} className="path-node" variants={stagger.item}>
                            <div
                              className={`path-node__card path-node__card--${node.status}`}
                              onClick={() => handleNodeClick(path.role, node.id, node.status)}
                              style={{ borderColor: statusColors[node.status] }}
                              title={`Status: ${node.status}. Click to change.`}
                            >
                              {node.label}
                              {isLead() && (
                                <button
                                  className="path-node__remove"
                                  onClick={(e) => { e.stopPropagation(); handleRemoveNode(path.role, node.id); }}
                                  title="Remove node"
                                >
                                  <X size={10} />
                                </button>
                              )}
                            </div>
                            {i < path.nodes.length - 1 && (
                              <div
                                className="path-node__connector"
                                style={{ background: node.status === 'completed' ? 'var(--accent-green)' : 'var(--border-strong)' }}
                              />
                            )}
                          </motion.div>
                        ))}

                        {/* Add node button (Lead only) */}
                        {isLead() && (
                          <>
                            {addingFor === path.role ? (
                              <div className="path-node__add-form">
                                <input
                                  className="path-node__add-input"
                                  value={newLabel}
                                  onChange={(e) => setNewLabel(e.target.value)}
                                  placeholder="Node name..."
                                  autoFocus
                                  onKeyDown={(e) => { if (e.key === 'Enter') handleAddNode(path.role); if (e.key === 'Escape') setAddingFor(null); }}
                                />
                                <button className="btn btn--primary" style={{ padding: '4px 8px', fontSize: 12 }} onClick={() => handleAddNode(path.role)}>Add</button>
                                <button className="btn btn--ghost" style={{ padding: '4px 8px', fontSize: 12 }} onClick={() => setAddingFor(null)}>Cancel</button>
                              </div>
                            ) : (
                              <button
                                className="path-node__add-btn"
                                onClick={() => setAddingFor(path.role)}
                                title="Add learning node"
                              >
                                <Plus size={14} />
                              </button>
                            )}
                          </>
                        )}
                      </motion.div>
                    </TransformComponent>
                  </div>
                )}
              </TransformWrapper>
            </div>
          </div>
        );
      })}
    </div>
  );
}
