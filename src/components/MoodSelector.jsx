import React from 'react';

export default function MoodSelector({ moods, selected, onSelect }) {
  return (
    <div className="mood-grid">
      {moods.map((mood) => (
        <button
          key={mood.label}
          className={`mood-btn mood-btn-${mood.category}${selected && selected.label === mood.label ? ' selected' : ''}`}
          onClick={() => onSelect(mood)}
          aria-label={mood.label}
        >
          <div className="mood-emoji">{mood.emoji}</div>
          <span className="mood-label">{mood.label}</span>
        </button>
      ))}
    </div>
  );
}
