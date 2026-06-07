interface RadarDataPoint { label: string; current: number; required: number; }
interface RadarChartProps { data: RadarDataPoint[]; size?: number; currentLang?: 'ar' | 'en'; }

export function RadarChart({ data, size = 280, currentLang = 'ar' }: RadarChartProps) {
  const cx = size / 2, cy = size / 2, radius = size * 0.35;
  const angleStep = (2 * Math.PI) / data.length;
  const getPoint = (index: number, value: number, max = 5) => {
    const angle = angleStep * index - Math.PI / 2;
    const r = (value / max) * radius;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  };
  const currentPoints = data.map((d, i) => getPoint(i, d.current));
  const requiredPoints = data.map((d, i) => getPoint(i, d.required));

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="overflow-visible">
        {[1,2,3,4,5].map(level => {
          const pts = data.map((_, i) => getPoint(i, level)).map(p => `${p.x},${p.y}`).join(' ');
          return <polygon key={level} points={pts} fill="none" stroke="#e5e7eb" strokeWidth={1} className="dark:stroke-gray-700" />;
        })}
        {data.map((_, i) => { const p = getPoint(i, 5); return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#e5e7eb" strokeWidth={1} className="dark:stroke-gray-700" />; })}
        <polygon points={requiredPoints.map(p => `${p.x},${p.y}`).join(' ')} fill="rgba(59,130,246,0.1)" stroke="#3b82f6" strokeWidth={2} strokeDasharray="4,2" />
        <polygon points={currentPoints.map(p => `${p.x},${p.y}`).join(' ')} fill="rgba(34,197,94,0.2)" stroke="#22c55e" strokeWidth={2} />
        {currentPoints.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={3} fill="#22c55e" />)}
        {data.map((d, i) => {
          const angle = angleStep * i - Math.PI / 2, lr = radius * 1.25;
          return <text key={i} x={cx + lr * Math.cos(angle)} y={cy + lr * Math.sin(angle)}
            textAnchor={angle === -Math.PI/2 ? 'middle' : angle > -Math.PI/2 && angle < Math.PI/2 ? 'start' : 'end'}
            dominantBaseline="middle" className="fill-gray-600 dark:fill-gray-400 text-[10px]">{d.label}</text>;
        })}
      </svg>
      <div className="flex items-center gap-4 mt-2 text-xs">
        <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 bg-green-500"></div><span className="text-gray-500">{currentLang === 'ar' ? 'الحالي' : 'Current'}</span></div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 bg-blue-500"></div><span className="text-gray-500">{currentLang === 'ar' ? 'المطلوب' : 'Required'}</span></div>
      </div>
    </div>
  );
}
