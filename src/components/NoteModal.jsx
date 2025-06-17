import React from 'react';

export default function NoteModal({ open, value, onChange, onSave, onCancel, title }) {
  if (!open) return null;
  return (
    <div className="note-modal" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(30,34,50,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
      <div style={{ background: '#232b4d', borderRadius: '16px', padding: '32px 24px', minWidth: '320px', boxShadow: '0 4px 24px #0005', color: '#ffe0a3', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: 4 }}>{title || 'Write a Note'}</div>
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Write your thoughts..."
          style={{ borderRadius: '8px', border: 'none', padding: '12px', minHeight: '80px', fontSize: '1rem', resize: 'vertical', background: '#2e3d5c', color: '#ffe0a3' }}
          autoFocus
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button onClick={onCancel} style={{ background: 'none', color: '#ffe0a3', border: 'none', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer' }}>Cancel</button>
          <button onClick={onSave} style={{ background: '#ffe0a3', color: '#232b4d', border: 'none', borderRadius: '8px', padding: '6px 18px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer' }}>Save</button>
        </div>
      </div>
    </div>
  );
}
