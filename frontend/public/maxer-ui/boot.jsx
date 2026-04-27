// boot.jsx — Terminal-style boot log shown on launch

const BOOT_LINES = [
  { t: 0,    c: 'ok',   text: '[maxer] init v0.7.2-dev — pid 41208 — pyloid 0.18' },
  { t: 80,   c: 'dim',  text: '[maxer] loading config from ~/.maxer/config.toml' },
  { t: 140,  c: 'dim',  text: '[maxer] keychain unlocked (4 entries)' },
  { t: 220,  c: 'ok',   text: '[asyncpg] connection established → 127.0.0.1:5432/maxer' },
  { t: 320,  c: 'dim',  text: '[alembic] head: 0007_token_usage_columns — up to date' },
  { t: 400,  c: 'ok',   text: '[fastapi] internal IPC bound on unix:///tmp/maxer.sock' },
  { t: 500,  c: 'dim',  text: '[router] probing providers…' },
  { t: 600,  c: 'ok',   text: '[router] OpenRouter · gemma-3-12b:free → 412ms ✓' },
  { t: 700,  c: 'ok',   text: '[router] OpenRouter · llama-3.2-3b:free → 380ms ✓' },
  { t: 800,  c: 'warn', text: '[router] Ollama · llama3.2 → cold (model pull deferred)' },
  { t: 900,  c: 'ok',   text: '[router] Anthropic · sonnet-4 → 720ms ✓ (paid, last-resort)' },
  { t: 1000, c: 'dim',  text: '[playwright] browser pool warm (chromium × 2)' },
  { t: 1080, c: 'dim',  text: '[smtp] outbound relay reachable (smtp.fastmail.com:587)' },
  { t: 1180, c: 'dim',  text: '[hunt] resuming watchdog · 6 boards · poll every 12m' },
  { t: 1300, c: 'ok',   text: '[maxer] ready · entering Watchdog mode' },
  { t: 1450, c: 'cmd',  text: '> _' },
];

function BootSequence({ onDone }) {
  const [shown, setShown] = React.useState(0);
  const [fadeOut, setFadeOut] = React.useState(false);

  React.useEffect(() => {
    const timers = BOOT_LINES.map((l, i) =>
      setTimeout(() => setShown(i + 1), l.t));
    const t1 = setTimeout(() => setFadeOut(true), 2000);
    const t2 = setTimeout(() => onDone && onDone(), 2500);
    return () => { timers.forEach(clearTimeout); clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const colorMap = {
    ok:   'oklch(0.78 0.14 152)',
    warn: 'oklch(0.78 0.16 75)',
    dim:  'var(--fg-3)',
    cmd:  'oklch(0.78 0.16 240)',
  };

  return (
    <div style={{
      position: 'absolute', inset: 0, background: '#08090C',
      fontFamily: 'var(--mono)', fontSize: 12, lineHeight: 1.65,
      padding: '60px 80px', color: 'var(--fg-2)',
      opacity: fadeOut ? 0 : 1, transition: 'opacity .5s ease',
      overflow: 'hidden',
    }}>
      <div style={{ marginBottom: 28, display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 6,
          background: 'oklch(0.55 0.18 240)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, fontWeight: 700, color: 'white',
          boxShadow: '0 0 24px oklch(0.55 0.18 240 / 0.5)',
        }}>M</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg-1)', fontFamily: 'var(--ui)' }}>Maxer Agent</div>
          <div style={{ fontSize: 10, color: 'var(--fg-3)' }}>v0.7.2 · macOS 15.4 · Apple Silicon</div>
        </div>
      </div>
      {BOOT_LINES.slice(0, shown).map((l, i) => (
        <div key={i} style={{ color: colorMap[l.c], whiteSpace: 'pre' }}>
          <span style={{ color: 'var(--fg-3)', marginRight: 12, fontVariantNumeric: 'tabular-nums' }}>
            {String(l.t).padStart(4, '0')}ms
          </span>
          {l.text}
          {i === shown - 1 && l.c !== 'cmd' && <span className="caret">▍</span>}
        </div>
      ))}
    </div>
  );
}

window.BootSequence = BootSequence;
