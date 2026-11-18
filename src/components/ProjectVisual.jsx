// Portföy kartlarındaki illüstrasyonlar. Gerçek ekran görüntüsü yerine, projenin ne yaptığını
// anlatan sade arayüz çizimleri. Renkler tamamen token sınıflarından gelir (fill-*, stroke-*).

const Frame = ({ children }) => (
  <>
    <rect x="0" y="0" width="400" height="300" className="fill-surface-raised" />
    <rect x="16" y="16" width="368" height="268" rx="10" className="fill-page stroke-line" strokeWidth="1" />
    <circle cx="32" cy="32" r="3" className="fill-line-strong" />
    <circle cx="43" cy="32" r="3" className="fill-line-strong" />
    <circle cx="54" cy="32" r="3" className="fill-line-strong" />
    <line x1="16" y1="46" x2="384" y2="46" className="stroke-line" strokeWidth="1" />
    {children}
  </>
);

const Store = () => (
  <Frame>
    {[0, 1, 2].map((col) =>
      [0, 1].map((row) => (
        <g key={`${col}-${row}`}>
          <rect x={36 + col * 112} y={62 + row * 108} width="96" height="70" rx="6" className={col === 1 && row === 0 ? 'fill-band' : 'fill-surface-raised'} />
          <rect x={36 + col * 112} y={138 + row * 108} width="60" height="6" rx="3" className="fill-line-strong" />
          <rect x={36 + col * 112} y={150 + row * 108} width="32" height="6" rx="3" className="fill-accent" />
        </g>
      ))
    )}
    <ellipse cx="196" cy="97" rx="30" ry="11" className="stroke-accent" fill="none" strokeWidth="2" strokeDasharray="4 4" />
    <path d="M186 104 L196 80 L206 104 Z" className="fill-accent" />
  </Frame>
);

const Booking = () => (
  <Frame>
    {Array.from({ length: 28 }).map((_, i) => {
      const col = i % 7;
      const row = Math.floor(i / 7);
      const busy = [2, 4, 8, 11, 15, 17, 22, 24].includes(i);
      return <rect key={i} x={32 + col * 34} y={64 + row * 52} width="28" height="44" rx="5" className={busy ? 'fill-accent' : 'fill-surface-raised'} opacity={busy ? 0.85 : 1} />;
    })}
    <rect x="280" y="64" width="88" height="200" rx="8" className="fill-surface-raised" />
    {[0, 1, 2, 3].map((i) => (
      <g key={i}>
        <circle cx="296" cy={90 + i * 44} r="7" className={i === 0 ? 'fill-accent' : 'fill-line-strong'} />
        <rect x="310" y={86 + i * 44} width="46" height="7" rx="3" className="fill-line-strong" />
      </g>
    ))}
  </Frame>
);

const Catalog = () => (
  <Frame>
    {Array.from({ length: 9 }).map((_, row) =>
      Array.from({ length: 6 }).map((__, col) => (
        <rect
          key={`${row}-${col}`}
          x={36 + col * 40 + (row % 2 ? 20 : 0)}
          y={62 + row * 22}
          width="36"
          height="18"
          rx="2"
          className={(row + col) % 5 === 0 ? 'fill-band-strong' : 'fill-surface-raised'}
        />
      ))
    )}
    <rect x="296" y="62" width="72" height="22" rx="11" className="fill-accent" />
    <rect x="296" y="94" width="72" height="22" rx="11" className="fill-surface-raised" />
    <rect x="296" y="126" width="72" height="22" rx="11" className="fill-surface-raised" />
  </Frame>
);

const Dashboard = () => (
  <Frame>
    {[0, 1, 2].map((i) => (
      <g key={i}>
        <rect x={32 + i * 116} y="60" width="104" height="52" rx="8" className="fill-surface-raised" />
        <rect x={44 + i * 116} y="72" width="40" height="6" rx="3" className="fill-line-strong" />
        <rect x={44 + i * 116} y="86" width="62" height="14" rx="4" className={i === 0 ? 'fill-accent' : 'fill-fg-subtle'} />
      </g>
    ))}
    {[44, 70, 58, 96, 82, 120, 104, 138].map((h, i) => (
      <rect key={i} x={40 + i * 26} y={264 - h} width="16" height={h} rx="3" className={i === 7 ? 'fill-accent' : 'fill-band-strong'} />
    ))}
    <polyline points="250,236 280,214 310,222 340,184 368,170" fill="none" className="stroke-accent" strokeWidth="2.5" />
  </Frame>
);

const Database = () => (
  <Frame>
    {[
      [40, 70],
      [220, 70],
      [130, 176],
    ].map(([x, y], i) => (
      <g key={i}>
        <rect x={x} y={y} width="132" height="86" rx="8" className="fill-surface-raised" />
        <rect x={x} y={y} width="132" height="20" rx="8" className={i === 2 ? 'fill-accent' : 'fill-band-strong'} />
        {[0, 1, 2].map((r) => (
          <rect key={r} x={x + 12} y={y + 32 + r * 16} width={r === 1 ? 70 : 96} height="6" rx="3" className="fill-line-strong" />
        ))}
      </g>
    ))}
    <path d="M106 156 C106 176, 150 170, 170 176" fill="none" className="stroke-fg-subtle" strokeWidth="1.5" />
    <path d="M286 156 C286 176, 240 170, 262 176" fill="none" className="stroke-fg-subtle" strokeWidth="1.5" />
  </Frame>
);

const Scraper = () => (
  <Frame>
    {[0, 1, 2, 3, 4].map((i) => (
      <g key={i}>
        <rect x="32" y={60 + i * 42} width="336" height="32" rx="6" className="fill-surface-raised" />
        <rect x="44" y={72 + i * 42} width="110" height="8" rx="4" className="fill-line-strong" />
        <rect x="236" y={70 + i * 42} width="44" height="12" rx="6" className={i % 2 ? 'fill-band-strong' : 'fill-accent'} />
        <polyline
          points={`296,${84 + i * 42} 312,${76 + i * 42 + (i % 3)} 328,${80 + i * 42} 344,${70 + i * 42} 356,${74 + i * 42}`}
          fill="none"
          className="stroke-accent"
          strokeWidth="1.5"
        />
      </g>
    ))}
  </Frame>
);

const Social = () => (
  <Frame>
    <rect x="140" y="58" width="120" height="216" rx="16" className="fill-surface-raised" />
    {Array.from({ length: 9 }).map((_, i) => (
      <rect key={i} x={150 + (i % 3) * 34} y={96 + Math.floor(i / 3) * 34} width="30" height="30" rx="3" className={[1, 5, 6].includes(i) ? 'fill-accent' : 'fill-band-strong'} />
    ))}
    <circle cx="164" cy="78" r="8" className="fill-accent" />
    <rect x="178" y="74" width="50" height="7" rx="3" className="fill-line-strong" />
    <rect x="44" y="110" width="80" height="26" rx="13" className="fill-surface-raised" />
    <rect x="276" y="180" width="86" height="26" rx="13" className="fill-accent" />
  </Frame>
);

const Workflow = () => (
  <Frame>
    {[
      [52, 140],
      [152, 90],
      [152, 190],
      [252, 140],
    ].map(([x, y], i) => (
      <rect key={i} x={x} y={y} width="72" height="40" rx="8" className={i === 3 ? 'fill-accent' : 'fill-surface-raised'} />
    ))}
    <path d="M124 160 C138 160, 138 110, 152 110 M124 160 C138 160, 138 210, 152 210 M224 110 C238 110, 238 160, 252 160 M224 210 C238 210, 238 160, 252 160" fill="none" className="stroke-fg-subtle" strokeWidth="1.5" />
    <circle cx="340" cy="160" r="10" className="fill-band-strong" />
    <line x1="324" y1="160" x2="330" y2="160" className="stroke-fg-subtle" strokeWidth="1.5" />
  </Frame>
);

const TryOn = () => (
  <Frame>
    {[96, 304].map((cx, i) => (
      <g key={cx}>
        <circle cx={cx} cy="98" r="22" className="fill-surface-raised" />
        <path d={`M${cx - 46} 260 L${cx - 40} 150 Q${cx} 126 ${cx + 40} 150 L${cx + 46} 260 Z`} className={i === 0 ? 'fill-band-strong' : 'fill-accent'} />
      </g>
    ))}
    <path d="M168 170 L224 170 M212 158 L226 170 L212 182" fill="none" className="stroke-fg-muted" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </Frame>
);

const VISUALS = { store: Store, booking: Booking, catalog: Catalog, dashboard: Dashboard, database: Database, scraper: Scraper, social: Social, workflow: Workflow, tryon: TryOn };

export default function ProjectVisual({ kind, className = '' }) {
  const Visual = VISUALS[kind] || Dashboard;
  return (
    <svg viewBox="0 0 400 300" role="presentation" aria-hidden="true" className={className} preserveAspectRatio="xMidYMid slice">
      <Visual />
    </svg>
  );
}
