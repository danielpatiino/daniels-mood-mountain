export function getToday() {
  return new Date().toISOString().slice(0, 10);
}

export function formatDate(date) {
  const d = new Date(date);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function getNotesForDate(date) {
  const entry = localStorage.getItem(`mood-${date}`);
  if (!entry) return [];
  try {
    const parsed = JSON.parse(entry);
    if (Array.isArray(parsed.notes)) return parsed.notes;
    if (parsed.note) return [parsed.note];
    return [];
  } catch {
    return [];
  }
}

export function getMoodInfoForDate(date) {
  const entry = localStorage.getItem(`mood-${date}`);
  if (!entry) return null;
  try {
    return JSON.parse(entry);
  } catch {
    return null;
  }
}

export function getMoodHistory() {
  return Object.entries(localStorage)
    .filter(([key]) => /^mood-\d{4}-\d{2}-\d{2}$/.test(key))
    .flatMap(([key, value]) => {
      try {
        const parsed = JSON.parse(value);
        const date = key.replace('mood-', '');
        const notes = Array.isArray(parsed.notes) ? parsed.notes : (parsed.note ? [parsed.note] : []);
        if (notes.length === 0) {
          return [{ date, score: parsed.score, moodLabel: parsed.moodLabel, emoji: parsed.emoji }];
        }
        return notes
          .filter(note => note && note.trim() !== '')
          .map(note => ({ date, score: parsed.score, moodLabel: parsed.moodLabel, emoji: parsed.emoji, note }));
      } catch {
        return [];
      }
    })
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function getMoodNotesHistory() {
  return Object.entries(localStorage)
    .filter(([key]) => /^mood-\d{4}-\d{2}-\d{2}$/.test(key))
    .flatMap(([key, value]) => {
      try {
        const parsed = JSON.parse(value);
        const date = key.replace('mood-', '');
        const notes = Array.isArray(parsed.notes) ? parsed.notes : (parsed.note ? [parsed.note] : []);
        return notes
          .filter(note => note && note.trim() !== '')
          .map(note => ({ date, score: parsed.score, moodLabel: parsed.moodLabel, emoji: parsed.emoji, note }));
      } catch {
        return [];
      }
    })
    .sort((a, b) => a.date.localeCompare(b.date));
}
