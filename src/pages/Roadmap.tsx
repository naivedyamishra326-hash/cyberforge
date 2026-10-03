import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Target, ChevronRight } from 'lucide-react';
import { roadmap, currentDay } from '../data/store';
import type { MemberRole } from '../types';
import './Roadmap.css';

const roleColors: Record<MemberRole, string> = {
  lead: 'var(--accent-cyan)',
  researcher: 'var(--accent-green)',
  designer: 'var(--accent-blue)',
  presenter: 'var(--color-warning)',
};

export default function Roadmap() {
  const [selectedDayId, setSelectedDayId] = useState(currentDay);

  const selectedDay = roadmap.find(d => d.day === selectedDayId) || roadmap[0];

  return (
    <div className="roadmap">
      {/* TIMELINE */}
      <div className="rm-timeline">
        {roadmap.map((day) => {
          const isPast = day.day < currentDay;
          const isActive = day.day === selectedDayId;

          let cardClass = 'rm-day-card';
          if (isActive) cardClass += ' rm-day-card--active';
          if (isPast && !isActive) cardClass += ' rm-day-card--past';

          return (
            <div
              key={day.day}
              className={cardClass}
              onClick={() => setSelectedDayId(day.day)}
            >
              <div className="rm-day-card__header">
                <span className="rm-day-card__number">Day {String(day.day).padStart(2, '0')}</span>
                <span className="rm-day-card__indicator" />
              </div>
              <span className="rm-day-card__title">{day.title}</span>
            </div>
          );
        })}
      </div>

      {/* DETAIL PANEL */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedDay.day}
          className="rm-detail"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <div className="rm-detail__header">
            <span className="rm-detail__day">Day {String(selectedDay.day).padStart(2, '0')}</span>
            <h1 className="rm-detail__title">{selectedDay.title}</h1>
            <p className="rm-detail__subtitle">{selectedDay.subtitle}</p>
            
            <div className="rm-detail__meta">
              <div className="rm-detail__meta-item">
                <Clock size={16} />
                <span>{selectedDay.estimatedHours} hours</span>
              </div>
              <div className="rm-detail__meta-item">
                <Target size={16} />
                <span className="text-primary">{selectedDay.deliverable}</span>
              </div>
            </div>
          </div>

          <div className="rm-detail__grid">
            {/* Left Col */}
            <div className="rm-section">
              <h3 className="rm-section__title">Objectives</h3>
              <div className="rm-list">
                {selectedDay.objectives.map((obj, i) => (
                  <div key={i} className="rm-list-item">
                    <ChevronRight size={16} className="rm-list-item__icon" />
                    <span>{obj}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Col */}
            <div className="rm-section">
              <h3 className="rm-section__title">Team Assignments</h3>
              <div className="rm-assignments">
                {(Object.keys(selectedDay.teamAssignments) as MemberRole[]).map((role) => (
                  <div key={role} className="rm-assign">
                    <span className="rm-assign__role" style={{ color: roleColors[role] }}>
                      {role}
                    </span>
                    <span className="rm-assign__task">
                      {selectedDay.teamAssignments[role]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="rm-section">
             <h3 className="rm-section__title">Hands-on Exercise</h3>
             <div className="glass-card" style={{ padding: 'var(--sp-4)' }}>
                {selectedDay.exercise}
             </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
