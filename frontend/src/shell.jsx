import React from 'react';
// shell.jsx — Live Brain orb, shared chrome bits, AppContext

export const AppContext = React.createContext(null);
export const useApp = () => React.useContext(AppContext);

// ─── Live Brain orb ─────────────────────────────────────────────
// states: 'idle' | 'scan' | 'match' | 'error' | 'thinking'
export function LiveBrain({ state = 'scan', size = 56, label = true }) {
  const palette = {
    idle:     { hue: 220, label: 'IDLE',         saturation: 0.04 },
    scan:     { hue: 232, label: 'SCANNING',     saturation: 0.18 },
    thinking: { hue: 260, label: 'THINKING',     saturation: 0.20 },
    match:    { hue: 152, label: 'MATCH FOUND',  saturation: 0.18 },
    error:    { hue: 38,  label: 'NEEDS REVIEW', saturation: 0.20 },
  }[state] || { hue: 232, label: 'SCAN', saturation: 0.18 };

  const c1 = `oklch(0.78 ${palette.saturation} ${palette.hue})`;
  const c2 = `oklch(0.52 ${palette.saturation * 0.9} ${palette.hue})`;
  const cGlow = `oklch(0.65 ${palette.saturation} ${palette.hue} / 0.55)`;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
        {/* outer pulse ring */}
        <div className="brain-pulse" style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          border: `1px solid ${cGlow}`,
        }} />
        <div className="brain-pulse brain-pulse-2" style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          border: `1px solid ${cGlow}`,
        }} />
        {/* glow */}
        <div style={{
          position: 'absolute', inset: -8, borderRadius: '50%',
          background: `radial-gradient(circle, ${cGlow} 0%, transparent 65%)`,
          filter: 'blur(6px)', opacity: state === 'idle' ? 0.3 : 0.85,
        }} />
        {/* core */}
        <div className="brain-core" style={{
          position: 'absolute', inset: '18%', borderRadius: '50%',
          background: `radial-gradient(circle at 35% 30%, ${c1} 0%, ${c2} 60%, oklch(0.25 0.05 ${palette.hue}) 100%)`,
          boxShadow: `inset 0 0 12px ${c1}, inset 0 -6px 14px oklch(0.18 0.04 ${palette.hue})`,
        }} />
        {/* highlight */}
        <div style={{
          position: 'absolute', top: '24%', left: '28%', width: '22%', height: '18%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.55) 0%, transparent 70%)',
          filter: 'blur(2px)',
        }} />
      </div>
      {label && (
        <div style={{ fontFamily: 'var(--mono)', fontSize: 9.5, letterSpacing: '0.14em', lineHeight: 1.2 }}>
          <div style={{ color: c1, fontWeight: 600 }}>{palette.label}</div>
          <div style={{ color: 'var(--fg-3)', fontSize: 9 }}>BRAIN · ACTIVE</div>
        </div>
      )}
    </div>
  );
}

// ─── Match-O-Meter (circular) ───────────────────────────────────
export function MatchMeter({ score, size = 64, breakdown }) {
  const r = size / 2 - 4;
  const c = 2 * Math.PI * r;
  const off = c * (1 - score / 100);
  const hue = score >= 90 ? 152 : score >= 80 ? 200 : score >= 70 ? 60 : 28;
  const ring = `oklch(0.72 0.18 ${hue})`;
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none"
          stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
        <circle cx={size/2} cy={size/2} r={r} fill="none"
          stroke={ring} strokeWidth="3" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={off}
          style={{ filter: `drop-shadow(0 0 6px ${ring})`, transition: 'stroke-dashoffset .6s ease' }} />
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex',
        alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
        fontFamily: 'var(--mono)',
      }}>
        <div style={{ fontSize: size * 0.32, fontWeight: 600, color: ring, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{score}</div>
        <div style={{ fontSize: 8, color: 'var(--fg-3)', marginTop: 1, letterSpacing: '0.1em' }}>FIT</div>
      </div>
    </div>
  );
}

// ─── Stack badge ───────────────────────────────────────────────
export function StackBadge({ stack }) {
  const colors = {
    'TS':    { bg: 'oklch(0.30 0.08 240 / 0.5)', fg: 'oklch(0.78 0.14 240)', label: 'TS' },
    '.NET':  { bg: 'oklch(0.30 0.08 290 / 0.5)', fg: 'oklch(0.78 0.14 290)', label: '.NET' },
    'C++':   { bg: 'oklch(0.30 0.08 30 / 0.5)',  fg: 'oklch(0.78 0.14 30)',  label: 'C++' },
    'Py':    { bg: 'oklch(0.30 0.08 80 / 0.5)',  fg: 'oklch(0.78 0.14 80)',  label: 'PY' },
  };
  const c = colors[stack] || colors['TS'];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', height: 20, padding: '0 7px',
      borderRadius: 5, background: c.bg, color: c.fg,
      fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 600, letterSpacing: '0.04em',
      border: `0.5px solid ${c.fg}`, opacity: 0.95,
    }}>{c.label}</span>
  );
}

// ─── Distance pill ─────────────────────────────────────────────
export function DistancePill({ km, max = 70 }) {
  const pct = Math.min(1, km / max);
  const ok = km <= max;
  const color = km === 0 ? 'oklch(0.78 0.18 152)'
              : ok ? 'oklch(0.78 0.14 200)'
              : 'oklch(0.78 0.18 38)';
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6, height: 22,
      padding: '0 8px', borderRadius: 5, fontFamily: 'var(--mono)',
      fontSize: 10, color: 'var(--fg-2)',
      background: 'rgba(255,255,255,0.025)',
      border: '0.5px solid rgba(255,255,255,0.07)',
    }}>
      <ICX.loc size={11} />
      <span style={{ color }}>{km === 0 ? 'REMOTE' : `${km}km`}</span>
      <div style={{ width: 24, height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
        <div style={{ width: `${pct * 100}%`, height: '100%', background: color, transition: 'width .4s' }} />
      </div>
    </div>
  );
}

// ─── Tooltip ──────────────────────────────────────────────────
export function Tooltip({ children, text, width = 280 }) {
  const [show, setShow] = React.useState(false);
  return (
    <span style={{ position: 'relative', display: 'inline-flex' }}
          onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <div style={{
          position: 'absolute', bottom: 'calc(100% + 8px)', left: '50%',
          transform: 'translateX(-50%)', width, zIndex: 50,
          background: 'rgba(20,22,28,0.95)',
          border: '0.5px solid rgba(255,255,255,0.12)',
          borderRadius: 8, padding: '10px 12px',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
          fontSize: 11, lineHeight: 1.5, color: 'var(--fg-1)',
          fontFamily: 'var(--ui)', textAlign: 'left',
          pointerEvents: 'none',
        }}>
          {text}
          <div style={{
            position: 'absolute', bottom: -4, left: '50%', transform: 'translateX(-50%) rotate(45deg)',
            width: 8, height: 8, background: 'rgba(20,22,28,0.95)',
            borderRight: '0.5px solid rgba(255,255,255,0.12)',
            borderBottom: '0.5px solid rgba(255,255,255,0.12)',
          }} />
        </div>
      )}
    </span>
  );
}

// ─── Severity dot ──────────────────────────────────────────────
export function SeverityDot({ level, size = 8 }) {
  const c = level === 'safe' ? 'oklch(0.75 0.16 152)'
         : level === 'moderate' ? 'oklch(0.78 0.16 75)'
         : level === 'dangerous' ? 'oklch(0.70 0.20 28)'
         : 'oklch(0.65 0.04 240)';
  return (
    <span style={{
      width: size, height: size, borderRadius: '50%',
      background: c, boxShadow: `0 0 6px ${c}`, display: 'inline-block', flexShrink: 0,
    }} />
  );
}

// ─── Section/card chrome ──────────────────────────────────────
export function Card({ children, style, padding = 18, span, accent = false }) {
  return (
    <div style={{
      gridColumn: span ? `span ${span}` : undefined,
      background: 'var(--surf-1)',
      border: `0.5px solid ${accent ? 'oklch(0.55 0.12 240 / 0.4)' : 'var(--border-1)'}`,
      borderRadius: 12,
      padding,
      position: 'relative',
      ...style,
    }}>{children}</div>
  );
}

export function CardHead({ kicker, title, right }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
      <div>
        {kicker && <div style={{ fontFamily: 'var(--mono)', fontSize: 9.5, letterSpacing: '0.16em', color: 'var(--fg-3)', textTransform: 'uppercase' }}>{kicker}</div>}
        {title && <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-1)', marginTop: 2 }}>{title}</div>}
      </div>
      {right}
    </div>
  );
}

// ─── Toolbar buttons ──────────────────────────────────────────
export function TBtn({ children, onClick, primary, danger, disabled, size = 'md', style }) {
  const h = size === 'sm' ? 26 : size === 'lg' ? 36 : 30;
  const bg = disabled ? 'rgba(255,255,255,0.03)'
        : primary ? 'oklch(0.55 0.18 240)'
        : danger ? 'oklch(0.50 0.20 28)'
        : 'rgba(255,255,255,0.04)';
  const fg = disabled ? 'var(--fg-3)'
        : primary || danger ? 'white' : 'var(--fg-1)';
  return (
    <button onClick={onClick} disabled={disabled} className="tbtn" style={{
      height: h, padding: size === 'sm' ? '0 10px' : '0 14px',
      background: bg, color: fg,
      border: `0.5px solid ${primary ? 'oklch(0.65 0.18 240)' : danger ? 'oklch(0.60 0.20 28)' : 'var(--border-1)'}`,
      borderRadius: 7,
      fontFamily: 'var(--ui)', fontSize: size === 'sm' ? 11.5 : 12.5, fontWeight: 500,
      cursor: disabled ? 'not-allowed' : 'pointer', display: 'inline-flex', alignItems: 'center', gap: 7,
      transition: 'background .12s, border-color .12s',
      ...style,
    }}>{children}</button>
  );
}
