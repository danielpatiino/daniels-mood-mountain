import React from 'react';

export default function Journal({ history, onEdit, onDelete }) {
  if (!history || history.length === 0) {
    return <div style={{ color: '#888', textAlign: 'center', marginTop: '1rem' }}>No journal entries yet.</div>;
  }
  const grouped = Object.entries(history.reduce((acc, entry) => {
    if (!acc[entry.date]) acc[entry.date] = [];
    acc[entry.date].push(entry);
    return acc;
  }, {})).reverse();

  return (
    <div className="journal-list">
      {grouped.map(([date, entries]) => (
        <div key={date}>
          {entries.map(({ moodLabel, emoji, note }, idx) => (
            <div
              key={date + idx}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                marginBottom: 14,
                background: '#2e3d5c',
                borderRadius: '8px',
                padding: '8px 12px',
                maxWidth: '100%',
                wordBreak: 'break-word',
                position: 'relative',
                overflow: 'visible',
              }}
              className="journal-entry-hover"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: '1.2em', marginRight: 6 }}>📅</span>
                <span style={{ fontWeight: 'bold', color: '#ffe0a3', minWidth: 90 }}>{date}</span>
                <span style={{ fontWeight: 'bold', color: '#ffe0a3', minWidth: 70 }}>{moodLabel} {emoji}</span>
                <div className="journal-action-btns" style={{ marginLeft: 'auto', display: 'flex', gap: 8, opacity: 0.85 }}>
                  <button
                    onClick={() => onEdit(date, idx, note)}
                    style={{ background: 'none', border: 'none', color: '#ffe0a3', cursor: 'pointer', fontSize: '1.15em', padding: 0, transition: 'color 0.2s' }}
                    aria-label="Edit Note"
                    title="Edit Note"
                  >
                    <span role="img" aria-label="edit">✏️</span>
                  </button>
                  <button
                    onClick={() => onDelete(date, idx)}
                    style={{ background: 'none', border: 'none', color: '#ff7b7b', cursor: 'pointer', fontSize: '1.15em', padding: 0, transition: 'color 0.2s' }}
                    aria-label="Delete Note"
                    title="Delete Note"
                  >
                    <span role="img" aria-label="delete">🗑️</span>
                  </button>
                </div>
              </div>
              {note && <span style={{ color: '#ffe0a3', marginLeft: 32, fontStyle: 'italic', wordBreak: 'break-word', whiteSpace: 'pre-wrap', maxWidth: '100%' }}>{`"${note.replace(/&quot;/g, '"')}"`}</span>}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
