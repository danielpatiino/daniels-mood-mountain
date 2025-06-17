import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const MOOD_EMOJIS = {
  10: '😊',
  8: '🚀',
  6: '😌',
  2: '😴',
  0: '😐',
  '-2': '😬',
  '-6': '😔',
  '-8': '😠',
  '-10': '🫥',
};

function formatDate(date) {
  const d = new Date(date);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const score = payload[0].value;
    return (
      <div style={{
        background: 'rgba(255,255,255,0.95)',
        borderRadius: '1rem',
        padding: '0.7rem 1.1rem',
        color: '#3a5d4d',
        fontWeight: 600,
        fontFamily: 'inherit',
        boxShadow: '0 2px 8px #b7eaff33',
      }}>
        <div style={{fontSize: '1.5rem', textAlign: 'center'}}>{MOOD_EMOJIS[score]}</div>
        <div>{formatDate(label)}</div>
        <div>Score: {score}</div>
      </div>
    );
  }
  return null;
};

const CustomDot = (props) => {
  const { cx, cy, value } = props;
  return (
    <text x={cx} y={cy - 10} textAnchor="middle" fontSize="1.3rem">
      {MOOD_EMOJIS[value]}
    </text>
  );
};

export default function MoodChart({ data }) {
  if (!data || data.length === 0) {
    return <div style={{textAlign:'center', color:'#888', fontSize:'1.1rem'}}>No mood data yet. Your mountain will appear here!</div>;
  }
  const deduped = Object.values(
    data.filter(entry => entry.date && typeof entry.score === 'number')
        .reduce((acc, entry) => {
          acc[entry.date] = entry;
          return acc;
        }, {})
  ).sort((a, b) => a.date.localeCompare(b.date));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={deduped} margin={{ top: 32, right: 24, left: 8, bottom: 0 }}>
        <defs>
          <linearGradient id="mountainLine" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#b7eaff"/>
            <stop offset="100%" stopColor="#ffe0c3"/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="6 6" stroke="#b7eaff55" />
        <XAxis dataKey="date" tickFormatter={formatDate} fontSize={15} tickLine={false} axisLine={false} height={38} />
        <YAxis domain={[1, 10]} ticks={[1, 2, 3, 4, 5, 6, 8, 9, 10]} fontSize={15} tickLine={false} axisLine={false} width={38} />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="score"
          stroke="url(#mountainLine)"
          strokeWidth={6}
          dot={<CustomDot />}
          activeDot={{ r: 13 }}
          isAnimationActive={true}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
