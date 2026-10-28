/**
 * Oyun sayfalarının konuya özel, soluk arka plan çizimleri.
 * Hepsi elle çizilmiş SVG: telifsiz, hafif, sitenin yeşil tonunda.
 * Sayfada çok düşük opaklıkla, içeriğin arkasında durur.
 */

export type ArkaPlanTuru = "harita" | "dunya" | "tarih" | "kureler" | "pusula";

const RENK = "#0b4f2e";

/** Eş yükselti eğrileri (izohips) gibi iç içe kapalı eğriler ve bir pusula. */
function Harita() {
  const tepeler: [number, number, number, number][] = [
    [260, 220, 1, 9],
    [980, 420, 1.25, 11],
    [620, 760, 0.9, 8],
  ];
  return (
    <svg viewBox="0 0 1400 1000" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
      <g fill="none" stroke={RENK} strokeWidth="1.6">
        {tepeler.map(([cx, cy, s, n], t) =>
          Array.from({ length: n }, (_, i) => {
            const r = (i + 1) * 26 * s;
            const w = r * (1.35 + 0.08 * Math.sin(i + t));
            const h = r * (0.85 + 0.06 * Math.cos(i * 1.7 + t));
            return (
              <path
                key={`${t}-${i}`}
                d={`M${cx - w},${cy} C${cx - w},${cy - h * 1.1} ${cx - w * 0.2},${cy - h * 1.25} ${cx + w * 0.35},${cy - h}
                   S${cx + w * 1.05},${cy - h * 0.2} ${cx + w},${cy + h * 0.15}
                   S${cx + w * 0.3},${cy + h * 1.15} ${cx - w * 0.25},${cy + h * 0.95}
                   S${cx - w},${cy + h * 0.45} ${cx - w},${cy}Z`}
                opacity={i % 5 === 4 ? 1 : 0.55}
                strokeWidth={i % 5 === 4 ? 2.4 : 1.4}
              />
            );
          }),
        )}
      </g>
      <Pusula x={1220} y={150} r={90} />
    </svg>
  );
}

/** Enlem-boylam ağı ile küre. */
function Dunya() {
  const cx = 1060;
  const cy = 520;
  const R = 420;
  return (
    <svg viewBox="0 0 1400 1000" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
      <g fill="none" stroke={RENK}>
        <circle cx={cx} cy={cy} r={R} strokeWidth="2.4" />
        {[-60, -40, -20, 0, 20, 40, 60].map((lat) => {
          const y = cy - R * Math.sin((lat * Math.PI) / 180);
          const rx = R * Math.cos((lat * Math.PI) / 180);
          return <ellipse key={`p${lat}`} cx={cx} cy={y} rx={rx} ry={rx * 0.08} strokeWidth={lat === 0 ? 2.2 : 1.2} />;
        })}
        {[0, 20, 40, 60, 80].map((lon) => {
          const rx = R * Math.sin((lon * Math.PI) / 180);
          return <ellipse key={`m${lon}`} cx={cx} cy={cy} rx={Math.max(rx, 0.5)} ry={R} strokeWidth={lon === 0 ? 2.2 : 1.2} />;
        })}
        {/* düz enlem-boylam ızgarası, solda */}
        {Array.from({ length: 9 }, (_, i) => (
          <line key={`h${i}`} x1="0" x2="560" y1={80 + i * 105} y2={80 + i * 105} strokeWidth="1" strokeDasharray="6 8" />
        ))}
        {Array.from({ length: 6 }, (_, i) => (
          <line key={`v${i}`} y1="0" y2="1000" x1={40 + i * 105} x2={40 + i * 105} strokeWidth="1" strokeDasharray="6 8" />
        ))}
      </g>
      <g fill={RENK} fontFamily="Georgia, serif" fontSize="22" opacity="0.9">
        {[60, 40, 20, 0, 20, 40].map((v, i) => (
          <text key={i} x="570" y={86 + i * 105 + 7}>
            {v}°{i < 3 ? "K" : i === 3 ? "" : "G"}
          </text>
        ))}
      </g>
    </svg>
  );
}

/** Eski deniz haritası havası: pusula gülü, rumb çizgileri, gemi, usturlap. */
function Tarih() {
  return (
    <svg viewBox="0 0 1400 1000" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
      <g stroke={RENK} fill="none">
        {/* rumb çizgileri */}
        {Array.from({ length: 16 }, (_, i) => {
          const a = (i * Math.PI) / 8;
          return (
            <line
              key={i}
              x1={1080}
              y1={300}
              x2={1080 + Math.cos(a) * 1400}
              y2={300 + Math.sin(a) * 1400}
              strokeWidth="0.9"
              opacity="0.6"
            />
          );
        })}
      </g>
      <Pusula x={1080} y={300} r={150} />
      {/* yelkenli */}
      <g stroke={RENK} strokeWidth="2.2" fill="none" transform="translate(250 640) scale(1.3)">
        <path d="M0,80 C40,105 200,105 240,80 L220,110 C170,125 70,125 20,110 Z" />
        <line x1="120" y1="80" x2="120" y2="-90" />
        <line x1="60" y1="70" x2="60" y2="-30" />
        <path d="M122,-80 C175,-50 182,20 124,60" />
        <path d="M122,-80 L124,60" opacity="0" />
        <path d="M62,-22 C100,-5 104,40 62,62" />
        <path d="M118,-86 L150,-96 L118,-104" />
        <path d="M-20,140 C20,128 50,152 90,140 S160,128 200,140 S260,152 300,140" opacity="0.7" />
      </g>
      {/* usturlap */}
      <g stroke={RENK} fill="none" transform="translate(300 220)">
        <circle r="110" strokeWidth="2.4" />
        <circle r="92" strokeWidth="1.2" />
        <circle r="40" strokeWidth="1.2" />
        <circle cy="-128" r="16" strokeWidth="2" />
        {Array.from({ length: 36 }, (_, i) => {
          const a = (i * Math.PI) / 18;
          return <line key={i} x1={Math.cos(a) * 92} y1={Math.sin(a) * 92} x2={Math.cos(a) * 110} y2={Math.sin(a) * 110} strokeWidth="1" />;
        })}
        <line x1="-100" y1="-30" x2="100" y2="30" strokeWidth="2.4" />
        <path d="M-70,40 C-20,-10 30,-10 80,40" strokeWidth="1.2" />
      </g>
    </svg>
  );
}

/** Beş küre: dağ (taş), bulut (hava), dalga (su), kar tanesi (buz), yaprak (yaşam). */
function Kureler() {
  return (
    <svg viewBox="0 0 1400 1000" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
      <g stroke={RENK} strokeWidth="2.4" fill="none" strokeLinejoin="round" strokeLinecap="round">
        {/* dağlar */}
        <path d="M720,980 L900,700 L980,800 L1100,620 L1260,860 L1330,780 L1400,880" />
        <path d="M1100,620 L1065,690 L1100,670 L1125,700" opacity="0.8" />
        {/* bulut */}
        <path d="M1000,200 C980,150 1050,120 1080,150 C1100,90 1200,90 1215,155 C1270,140 1300,200 1260,225 L1010,225 C980,225 975,205 1000,200Z" />
        <path d="M120,320 C105,285 155,262 178,285 C192,240 265,242 276,288 C316,276 338,320 308,338 L130,338 C108,338 104,324 120,320Z" opacity="0.8" />
        {/* dalgalar */}
        {[0, 1, 2].map((i) => (
          <path key={i} d={`M0,${780 + i * 45} C60,${755 + i * 45} 120,${805 + i * 45} 180,${780 + i * 45} S300,${755 + i * 45} 360,${780 + i * 45} S480,${805 + i * 45} 540,${780 + i * 45}`} />
        ))}
        {/* kar tanesi */}
        <g transform="translate(220 560)">
          {[0, 60, 120].map((a) => (
            <g key={a} transform={`rotate(${a})`}>
              <line x1="-70" y1="0" x2="70" y2="0" />
              <path d="M45,0 L60,-15 M45,0 L60,15 M-45,0 L-60,-15 M-45,0 L-60,15" />
            </g>
          ))}
        </g>
        {/* yaprak */}
        <g transform="translate(640 150) rotate(-25)">
          <path d="M0,0 C60,-70 170,-60 210,0 C170,60 60,70 0,0Z" />
          <path d="M0,0 L210,0 M60,0 L95,-28 M60,0 L95,28 M120,0 L150,-24 M120,0 L150,24" strokeWidth="1.4" />
        </g>
      </g>
    </svg>
  );
}

function Pusula({ x, y, r }: { x: number; y: number; r: number }) {
  return (
    <g transform={`translate(${x} ${y})`} stroke={RENK} fill="none">
      <circle r={r} strokeWidth="2.2" />
      <circle r={r * 0.82} strokeWidth="1" />
      {Array.from({ length: 32 }, (_, i) => {
        const a = (i * Math.PI) / 16;
        const ic = i % 4 === 0 ? 0.7 : 0.76;
        return <line key={i} x1={Math.cos(a) * r * ic} y1={Math.sin(a) * r * ic} x2={Math.cos(a) * r * 0.82} y2={Math.sin(a) * r * 0.82} strokeWidth="1" />;
      })}
      {[0, 90, 180, 270].map((a) => (
        <path key={a} transform={`rotate(${a})`} d={`M0,${-r * 1.05} L${r * 0.13},0 L0,${r * 0.13} L${-r * 0.13},0Z`} strokeWidth="1.8" />
      ))}
      {[45, 135, 225, 315].map((a) => (
        <path key={a} transform={`rotate(${a})`} d={`M0,${-r * 0.62} L${r * 0.08},0 L${-r * 0.08},0Z`} strokeWidth="1.2" />
      ))}
      <text y={-r * 1.12} textAnchor="middle" fill={RENK} stroke="none" fontFamily="Georgia, serif" fontSize={r * 0.28} fontWeight="bold">
        K
      </text>
    </g>
  );
}

const CIZIMLER: Record<ArkaPlanTuru, () => React.JSX.Element> = {
  harita: Harita,
  dunya: Dunya,
  tarih: Tarih,
  kureler: Kureler,
  pusula: () => (
    <svg viewBox="0 0 1400 1000" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
      <Pusula x={1150} y={260} r={170} />
      <Pusula x={180} y={820} r={90} />
    </svg>
  ),
};

/** Sayfanın arkasında, içeriğe dokunmayan soluk katman. */
export function ArkaPlan({ tur }: { tur: ArkaPlanTuru }) {
  const Cizim = CIZIMLER[tur];
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.16]">
      <Cizim />
    </div>
  );
}
