import { useState, useEffect } from 'react';
import './App.css';
import MoodChart from './components/MoodChart';
import MoodSelector from './components/MoodSelector';
import NoteModal from './components/NoteModal';
import Journal from './components/Journal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getToday, getNotesForDate, getMoodInfoForDate, getMoodHistory, getMoodNotesHistory } from './utils';
import { format, isYesterday, isToday, parseISO } from 'date-fns';

const MOODS = [
	{ emoji: '😊', label: 'Happy', score: 10, category: 'positive' },
	{ emoji: '🚀', label: 'Excited', score: 8, category: 'positive' },
	{ emoji: '😌', label: 'Content', score: 6, category: 'positive' },
	{ emoji: '😴', label: 'Tired', score: 2, category: 'neutral' },
	{ emoji: '😐', label: 'Bored', score: 0, category: 'neutral' },
	{ emoji: '😬', label: 'Anxious', score: -2, category: 'neutral' },
	{ emoji: '😔', label: 'Sad', score: -6, category: 'negative' },
	{ emoji: '😠', label: 'Angry', score: -8, category: 'negative' },
	{ emoji: '🫥', label: 'Lonely', score: -10, category: 'negative' },
];

function App() {
	const [selected, setSelected] = useState(null);
	const [history, setHistory] = useState(getMoodHistory());
	const [selectedDate, setSelectedDate] = useState(new Date());
	const [noteModalOpen, setNoteModalOpen] = useState(false);
	const [noteText, setNoteText] = useState('');
	const [notes, setNotes] = useState(getMoodNotesHistory());
	const [journalOpen, setJournalOpen] = useState(false);
	const [editModalOpen, setEditModalOpen] = useState(false);
	const [editNoteText, setEditNoteText] = useState('');
	const [editDate, setEditDate] = useState(null);
	const [editIdx, setEditIdx] = useState(null);
	const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
	const [deleteDate, setDeleteDate] = useState(null);
	const [deleteIdx, setDeleteIdx] = useState(null);

	useEffect(() => {
		setHistory(getMoodHistory());
		setNotes(getMoodNotesHistory());
	}, [selected]);

	useEffect(() => {
		const dateStr = format(selectedDate, 'yyyy-MM-dd');
		const entry = localStorage.getItem(`mood-${dateStr}`);
		if (entry) {
			const parsed = JSON.parse(entry);
			setSelected(parsed.score);
			setNoteText('');
		} else {
			setSelected(null);
			setNoteText('');
		}
	}, [selectedDate]);

	const handleMoodSelect = (mood) => {
		const date = format(selectedDate, 'yyyy-MM-dd');
		const entry = localStorage.getItem(`mood-${date}`);
		let notes = [];
		if (entry) {
			const parsed = JSON.parse(entry);
			notes = Array.isArray(parsed.notes) ? parsed.notes : (parsed.note ? [parsed.note] : []);
		}
		localStorage.setItem(
			`mood-${date}`,
			JSON.stringify({
				score: mood.score,
				moodLabel: mood.label,
				emoji: mood.emoji,
				notes,
			})
		);
		setSelected(mood.score);
		setNotes(getMoodNotesHistory());
		setHistory(getMoodHistory());
	};

	const handleSaveNote = () => {
		const date = format(selectedDate, 'yyyy-MM-dd');
		let moodData = getMoodInfoForDate(date) || { score: selected, moodLabel: '', emoji: '' };
		let notes = getNotesForDate(date);
		if (noteText.trim()) {
			notes = [...notes, noteText.trim()];
		}
		localStorage.setItem(
			`mood-${date}`,
			JSON.stringify({ ...moodData, notes })
		);
		setNoteModalOpen(false);
		setNoteText('');
		setNotes(getMoodNotesHistory());
		setHistory(getMoodHistory());
		setSelected(moodData.score); // ensure mood stays selected
	};

	const handleEditNote = (date, idx, note) => {
		setEditDate(date);
		setEditIdx(idx);
		setEditNoteText(note);
		setEditModalOpen(true);
	};

	const handleEditNoteSave = () => {
		if (editDate == null || editIdx == null) return;
		const entry = localStorage.getItem(`mood-${editDate}`);
		if (!entry) return;
		const parsed = JSON.parse(entry);
		let notes = Array.isArray(parsed.notes) ? [...parsed.notes] : (parsed.note ? [parsed.note] : []);
		notes[editIdx] = editNoteText;
		localStorage.setItem(`mood-${editDate}`, JSON.stringify({ ...parsed, notes }));
		setEditModalOpen(false);
		setEditNoteText('');
		setEditDate(null);
		setEditIdx(null);
		setNotes(getMoodNotesHistory());
		setHistory(getMoodHistory());
	};

	const handleEditNoteCancel = () => {
		setEditModalOpen(false);
		setEditNoteText('');
		setEditDate(null);
		setEditIdx(null);
	};

	const handleDeleteNote = (date, idx) => {
		setDeleteDate(date);
		setDeleteIdx(idx);
		setDeleteConfirmOpen(true);
	};

	const handleDeleteNoteConfirm = () => {
		if (deleteDate == null || deleteIdx == null) return;
		const entry = localStorage.getItem(`mood-${deleteDate}`);
		if (!entry) return;
		const parsed = JSON.parse(entry);
		let notes = Array.isArray(parsed.notes) ? [...parsed.notes] : (parsed.note ? [parsed.note] : []);
		notes.splice(deleteIdx, 1);
		localStorage.setItem(`mood-${deleteDate}`, JSON.stringify({ ...parsed, notes }));
		setDeleteConfirmOpen(false);
		setDeleteDate(null);
		setDeleteIdx(null);
		setNotes(getMoodNotesHistory());
		setHistory(getMoodHistory());
	};

	const handleDeleteNoteCancel = () => {
		setDeleteConfirmOpen(false);
		setDeleteDate(null);
		setDeleteIdx(null);
	};

	const todayStr = getToday();
	const selectedStr = format(selectedDate, 'yyyy-MM-dd');
	let displayDate;
	if (selectedStr === todayStr) {
		displayDate = <span className="calendar-today-label">Today</span>;
	} else if (isYesterday(selectedDate, new Date(todayStr))) {
		displayDate = <span className="calendar-yesterday-label">Yesterday</span>;
	} else {
		displayDate = <span className="calendar-custom-date">{format(selectedDate, 'MMM d')}</span>;
	}

	return (
		<div className="mountain-bg">
			<svg
				className="mountain-illustration"
				viewBox="0 0 500 220"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				aria-hidden="true"
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					width: '100%',
					height: '60%',
					zIndex: 0,
					pointerEvents: 'none',
				}}
			>
				<circle cx="420" cy="70" r="48" fill="url(#midnightSunGradient)" />
				<defs>
					<radialGradient
						id="midnightSunGradient"
						cx="0.5"
						cy="0.5"
						r="0.5"
						fx="0.5"
						fy="0.5"
					>
						<stop offset="0%" stopColor="#fffbe6" />
						<stop
							offset="100%"
							stopColor="#ffe0a3"
							stopOpacity="0.7"
						/>
					</radialGradient>
				</defs>
				<path
					d="M0 180 L80 120 L140 170 L200 100 L260 180 L320 140 L400 200 L500 160 L500 220 L0 220 Z"
					fill="#3a4666"
					fillOpacity="0.85"
				/>
				<path
					d="M0 200 L60 160 L120 200 L180 140 L240 200 L300 180 L360 210 L500 180 L500 220 L0 220 Z"
					fill="#232b4d"
					fillOpacity="0.85"
				/>
				<g>
					<rect
						x="70"
						y="160"
						width="6"
						height="18"
						rx="2"
						fill="#22304a"
					/>
					<polygon
						points="73,150 65,165 81,165"
						fill="#2e3d5c"
					/>
				</g>
				<g>
					<rect
						x="110"
						y="170"
						width="5"
						height="13"
						rx="2"
						fill="#22304a"
					/>
					<polygon
						points="112.5,162 106,175 119,175"
						fill="#2e3d5c"
					/>
				</g>
				<g>
					<rect
						x="320"
						y="170"
						width="5"
						height="13"
						rx="2"
						fill="#22304a"
					/>
					<polygon
						points="322.5,162 316,175 329,175"
						fill="#2e3d5c"
					/>
				</g>
			</svg>
			<div className="mood-mountain-container" style={{ position: 'relative', zIndex: 1 }}>
				<h1 className="mountain-title">Daniel's Mood Mountain</h1>
				<p className="mountain-subtitle">
					Up here under the midnight sun, the world slows down. Breathe in the
					stillness. However you're feeling, light or heavy, it’s okay. This is
					your space to just be.
				</p>
				<div className="calendar-custom-wrapper">
					<DatePicker
						selected={selectedDate}
						onChange={setSelectedDate}
						maxDate={new Date()}
						customInput={
							<button
								className="calendar-custom-btn calendar-custom-btn-relative"
								type="button"
								style={{ position: 'relative', overflow: 'visible' }}
							>
								{displayDate}
								<span className="calendar-custom-icon">📅</span>
							</button>
						}
						calendarClassName="calendar-popup-theme"
						popperPlacement="bottom"
						dateFormat="yyyy/MM/dd"
					/>
				</div>
				<MoodSelector
					moods={MOODS}
					selected={MOODS.find((m) => m.score === selected)}
					onSelect={handleMoodSelect}
				/>
				<div
					style={{
						display: 'flex',
						justifyContent: 'center',
						gap: 12,
						marginTop: 16,
					}}
				>
					<button
						className="note-btn"
						style={{
							background: '#232b4d',
							color: '#ffe0a3',
							borderRadius: '8px',
							padding: '8px 20px',
							fontWeight: 'bold',
							fontSize: '1rem',
							boxShadow: '0 2px 8px #0002',
							border: 'none',
							cursor: 'pointer',
						}}
						onClick={() => setNoteModalOpen(true)}
					>
						📝 Write a Note
					</button>
					<button
						className="journal-btn"
						style={{
							background: '#232b4d',
							color: '#ffe0a3',
							borderRadius: '8px',
							padding: '8px 20px',
							fontWeight: 'bold',
							fontSize: '1rem',
							boxShadow: '0 2px 8px #0002',
							border: 'none',
							cursor: 'pointer',
						}}
						onClick={() => setJournalOpen((journalOpen) => !journalOpen)}
					>
						📖 View Journal
					</button>
				</div>
				<NoteModal
					open={noteModalOpen}
					value={noteText}
					onChange={setNoteText}
					onSave={handleSaveNote}
					onCancel={() => setNoteModalOpen(false)}
				/>
				<div className="chart-section">
					<MoodChart data={history} />
				</div>
				{journalOpen && (
					<div
						className="journal-side-panel"
						style={{
							position: 'fixed',
							top: 0,
							right: 0,
							height: '100vh',
							width: '340px',
							background: '#232b4d',
							boxShadow: '-4px 0 24px #0005',
							zIndex: 200,
							display: 'flex',
							flexDirection: 'column',
							padding: 0,
							animation: 'slideInRight 0.3s',
							borderTopLeftRadius: '18px',
							borderBottomLeftRadius: '18px',
						}}
					>
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'space-between',
								padding: '24px 24px 12px 24px',
								borderBottom: '1px solid #2e3d5c',
							}}
						>
							<span
								style={{
									fontWeight: 'bold',
									color: '#ffe0a3',
									fontSize: '1.2rem',
								}}
							>
								Journal
							</span>
							<button
								onClick={() => setJournalOpen(false)}
								style={{
									background: 'none',
									color: '#ffe0a3',
									border: 'none',
									fontWeight: 'bold',
									fontSize: '1.5rem',
									cursor: 'pointer',
								}}
								aria-label="Close Journal"
							>
								×
							</button>
						</div>
						<div
							style={{
								flex: 1,
								overflowY: 'auto',
								padding: '16px 24px',
							}}
						>
							<Journal
								history={notes}
								onEdit={handleEditNote}
								onDelete={handleDeleteNote}
							/>
						</div>
					</div>
				)}
				<NoteModal
					open={editModalOpen}
					value={editNoteText}
					onChange={setEditNoteText}
					onSave={handleEditNoteSave}
					onCancel={handleEditNoteCancel}
				/>
				{deleteConfirmOpen && (
					<div
						className="note-modal"
						style={{
							position: 'fixed',
							top: 0,
							left: 0,
							width: '100vw',
							height: '100vh',
							background: 'rgba(30,34,50,0.7)',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							zIndex: 100,
						}}
					>
						<div
							style={{
								background: '#232b4d',
								borderRadius: '16px',
								padding: '32px 24px',
								minWidth: '320px',
								boxShadow: '0 4px 24px #0005',
								color: '#ffe0a3',
								display: 'flex',
								flexDirection: 'column',
								gap: '16px',
								alignItems: 'center',
							}}
						>
							<div
								style={{
									fontWeight: 'bold',
									fontSize: '1.1rem',
									marginBottom: 4,
									textAlign: 'center',
								}}
							>
								Are you sure you want to delete this note?
							</div>
							<div
								style={{
									color: '#ff7b7b',
									fontStyle: 'italic',
									marginBottom: 8,
									textAlign: 'center',
								}}
							>
								This action cannot be undone.
							</div>
							<div
								style={{
									display: 'flex',
									justifyContent: 'center',
									gap: '18px',
								}}
							>
								<button
									onClick={handleDeleteNoteCancel}
									style={{
										background: 'none',
										color: '#ffe0a3',
										border: 'none',
										fontWeight: 'bold',
										fontSize: '1rem',
										cursor: 'pointer',
									}}
								>
									Cancel
								</button>
								<button
									onClick={handleDeleteNoteConfirm}
									style={{
										background: '#ff7b7b',
										color: '#232b4d',
										border: 'none',
										borderRadius: '8px',
										padding: '6px 18px',
										fontWeight: 'bold',
										fontSize: '1rem',
										cursor: 'pointer',
									}}
								>
									Delete
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

export default App;
