import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save } from 'lucide-react';
import './Notes.css';

const sections = [
  'Research Notes',
  'Architecture Decisions',
  'Security Findings',
  'Ideas',
  'Questions',
  'Blockers'
];

export default function Notes() {
  const [activeSection, setActiveSection] = useState(sections[0]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(true);

  // Load from local storage
  useEffect(() => {
    const stored = localStorage.getItem('cyberforge_notes');
    if (stored) {
      setNotes(JSON.parse(stored));
    } else {
      // Default content
      setNotes({
        'Research Notes': '## Web Security Research\n\n- Need to check OWASP API Security Top 10.\n- Look into JWT token exfiltration vectors.',
        'Architecture Decisions': '- We will use Express for the mock API.\n- Auth: HTTP-only cookies instead of localStorage for tokens.',
      });
    }
  }, []);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(prev => ({ ...prev, [activeSection]: e.target.value }));
    setSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem('cyberforge_notes', JSON.stringify(notes));
    setSaved(true);
  };

  return (
    <div className="notes-page">
      <div className="notes-sidebar">
        {sections.map(sec => (
          <button
            key={sec}
            className={`notes-section-btn ${activeSection === sec ? 'notes-section-btn--active' : ''}`}
            onClick={() => setActiveSection(sec)}
          >
            <span>{sec}</span>
          </button>
        ))}
      </div>

      <div className="notes-editor">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="cc-section__title">{activeSection}</h2>
          <button 
            className="btn btn--secondary" 
            onClick={handleSave}
            disabled={saved}
            style={{ opacity: saved ? 0.5 : 1 }}
          >
            <Save size={14} /> {saved ? 'Saved' : 'Save Notes'}
          </button>
        </div>

        <div className="glass-card" style={{ flex: 1, display: 'flex', padding: 0, overflow: 'hidden' }}>
          <AnimatePresence mode="wait">
            <motion.textarea
              key={activeSection}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="notes-textarea"
              value={notes[activeSection] || ''}
              onChange={handleTextChange}
              placeholder={`Start typing your ${activeSection.toLowerCase()}... (Markdown supported)`}
              spellCheck="false"
            />
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
