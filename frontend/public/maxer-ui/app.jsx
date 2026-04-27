// app.jsx — main shell: window chrome, sidebar, view switching, boot, tweaks

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accentHue": 240,
  "density": "regular",
  "simSpeed": "normal",
  "showOrb": true,
  "skipBoot": false,
  "modeWatchdog": false
}/*EDITMODE-END*/;

const NAV = [
  { id: 'hunt',   label: 'The Hunt',       sub: 'Top matches',     icon: 'hunt',  badge: '3' },
  { id: 'agent',  label: 'Agent Console',  sub: 'Tool-call loop',  icon: 'agent', live: true },
  { id: 'brain',  label: 'The Brain',      sub: 'LLM router',      icon: 'brain' },
  { id: 'vault',  label: 'Vault',          sub: 'Resumes · DB',    icon: 'vault' },
  { id: 'multi',  label: 'Multimodal',     sub: 'Voice · vision',  icon: 'multi' },
];

function App() {
  const [t, setT] = useTweaks(TWEAK_DEFAULTS);
  const [booting, setBooting] = React.useState(!t.skipBoot);
  const [view, setView] = React.useState('hunt');
  const [deployJob, setDeployJob] = React.useState(null);
  const [jobs, setJobs] = React.useState(MOCK_JOBS);
  const [brainState, setBrainState] = React.useState('scan');

  // simulate brain state ticks
  React.useEffect(() => {
    if (booting) return;
    const tick = () => {
      const r = Math.random();
      setBrainState(deployJob ? 'thinking' : r < 0.55 ? 'scan' : r < 0.85 ? 'match' : 'thinking');
    };
    const ms = t.simSpeed === 'slow' ? 3500 : t.simSpeed === 'fast' ? 900 : 2000;
    const id = setInterval(tick, ms);
    return () => clearInterval(id);
  }, [booting, t.simSpeed, deployJob]);

  // simulate a new job sliding in after 8s
  React.useEffect(() => {
    if (booting) return;
    const id = setTimeout(() => {
      setBrainState('match');
      setJobs(j => {
        const exists = j.find(x => x.id === 'job-new-007');
        if (exists) return j;
        return [{
          id: 'job-new-007', company: 'Sequence Health', role: 'Senior TS Engineer — Patient API',
          location: 'Remote — DE', distance_km: 0, posted: 'just now', salary: '€95–110k',
          stack: ['TypeScript', 'NestJS', 'Postgres', 'AWS'], primary_stack: 'TS',
          score: 92, breakdown: { skills: 94, location: 100, salary: 84, culture: 90 },
          resume: 'DE-TS-Resume.pdf', resume_alt: 'DE-Backend-Resume.pdf',
          logic: 'Resume A (TS). Patient-API role uses NestJS — Resume A lists 2yr NestJS production work.',
          new: true,
          description: 'Healthcare data platform, fully remote, async-first.',
          must_have: ['TypeScript', 'NestJS', 'Postgres', 'Async work'],
          nice_to_have: ['Healthcare bg', 'AWS RDS', 'GraphQL'],
        }, ...j];
      });
    }, 8500);
    return () => clearTimeout(id);
  }, [booting]);

  const ctx = {
    jobs, resumes: MOCK_RESUMES, dbLog: MOCK_DB_LOG, brainState,
    openDeploy: (j) => setDeployJob(j),
  };

  return (
    <AppContext.Provider value={ctx}>
      <div style={{ '--accent-hue': t.accentHue }} className="root-shell">
        <WindowChrome>
          {booting && <BootSequence onDone={() => setBooting(false)}/>}
          {!booting && (
            <>
              <Sidebar view={view} setView={setView} brainState={brainState} showOrb={t.showOrb}
                       watchdog={t.modeWatchdog}/>
              <main style={{ flex: 1, overflowY: 'auto', position: 'relative', minWidth: 0 }}>
                {view === 'hunt'  && <HuntView/>}
                {view === 'agent' && <AgentView/>}
                {view === 'brain' && <BrainView/>}
                {view === 'vault' && <VaultView/>}
                {view === 'multi' && <MultiView/>}
              </main>
            </>
          )}
          {deployJob && <DeployModal job={deployJob} onClose={() => setDeployJob(null)}/>}
        </WindowChrome>

        <TweaksPanel>
          <TweakSection label="Mode"/>
          <TweakToggle label="Watchdog (minimal)" value={t.modeWatchdog}
                       onChange={(v) => setT('modeWatchdog', v)}/>
          <TweakToggle label="Show Brain orb" value={t.showOrb}
                       onChange={(v) => setT('showOrb', v)}/>
          <TweakSection label="AI activity"/>
          <TweakRadio label="Sim speed" value={t.simSpeed}
                      options={['slow', 'normal', 'fast']}
                      onChange={(v) => setT('simSpeed', v)}/>
          <TweakSection label="Aesthetic"/>
          <TweakSlider label="Accent hue" value={t.accentHue} min={180} max={310} step={2}
                       onChange={(v) => setT('accentHue', v)}/>
          <TweakRadio label="Density" value={t.density}
                      options={['compact', 'regular', 'comfy']}
                      onChange={(v) => setT('density', v)}/>
          <TweakSection label="Boot"/>
          <TweakToggle label="Skip boot sequence" value={t.skipBoot}
                       onChange={(v) => setT('skipBoot', v)}/>
          <TweakButton label="Replay boot" secondary onClick={() => setBooting(true)}/>
        </TweaksPanel>
      </div>
    </AppContext.Provider>
  );
}

// ─── macOS-ish dark window chrome ────────────────────────────
function WindowChrome({ children }) {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'radial-gradient(ellipse at top, oklch(0.18 0.02 240) 0%, #08090C 50%)',
      padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxSizing: 'border-box',
    }}>
      <div style={{
        width: '100%', height: '100%', maxWidth: 1480, maxHeight: 940,
        background: 'var(--bg)',
        borderRadius: 14,
        border: '0.5px solid rgba(255,255,255,0.07)',
        boxShadow: '0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,0,0,0.4)',
        overflow: 'hidden', position: 'relative',
        display: 'flex', flexDirection: 'column',
      }}>
        <Titlebar/>
        <div style={{ flex: 1, display: 'flex', minHeight: 0, position: 'relative' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

function Titlebar() {
  return (
    <div style={{
      height: 38, flexShrink: 0,
      display: 'flex', alignItems: 'center',
      padding: '0 14px', gap: 14,
      borderBottom: '0.5px solid rgba(255,255,255,0.05)',
      background: 'linear-gradient(180deg, oklch(0.13 0.01 240), oklch(0.10 0.01 240))',
      position: 'relative',
    }}>
      <div style={{ display: 'flex', gap: 8 }}>
        {['#ff5f57', '#febc2e', '#28c840'].map((c, i) => (
          <div key={i} style={{ width: 12, height: 12, borderRadius: '50%', background: c, border: '0.5px solid rgba(0,0,0,0.3)' }}/>
        ))}
      </div>
      <div style={{
        position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
        display: 'flex', alignItems: 'center', gap: 7, fontFamily: 'var(--ui)', fontSize: 11.5, color: 'var(--fg-2)', fontWeight: 500,
      }}>
        <div style={{
          width: 14, height: 14, borderRadius: 3, background: 'oklch(0.55 0.18 240)',
          color: 'white', fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>M</div>
        Maxer Agent
        <span style={{ color: 'var(--fg-3)', fontFamily: 'var(--mono)', fontSize: 10 }}>· v0.7.2</span>
      </div>
      <div style={{ flex: 1 }}/>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--fg-3)' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'oklch(0.78 0.16 152)' }}/>
          DB · 5432
        </span>
        <span>FastAPI · UDS</span>
        <span>OR · gemma-12b</span>
      </div>
    </div>
  );
}

function Sidebar({ view, setView, brainState, showOrb, watchdog }) {
  return (
    <aside style={{
      width: 232, flexShrink: 0,
      borderRight: '0.5px solid rgba(255,255,255,0.05)',
      background: 'oklch(0.10 0.005 240 / 0.6)',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{
        padding: '14px 14px 10px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 9.5, letterSpacing: '0.18em', color: 'var(--fg-3)' }}>
          MISSION CONTROL
        </span>
        <span style={{
          fontFamily: 'var(--mono)', fontSize: 9, padding: '2px 6px', borderRadius: 3,
          color: watchdog ? 'oklch(0.78 0.10 200)' : 'oklch(0.85 0.16 240)',
          background: watchdog ? 'oklch(0.30 0.04 200 / 0.4)' : 'oklch(0.40 0.14 240 / 0.3)',
          border: '0.5px solid ' + (watchdog ? 'oklch(0.55 0.08 200)' : 'oklch(0.55 0.14 240)'),
          letterSpacing: '0.1em',
        }}>{watchdog ? 'WATCHDOG' : 'AGENT MODE'}</span>
      </div>

      <nav style={{ flex: 1, padding: '4px 10px', display: 'flex', flexDirection: 'column', gap: 1 }}>
        {NAV.map(n => {
          const Icon = ICX[n.icon];
          const active = view === n.id;
          return (
            <button key={n.id} onClick={() => setView(n.id)} style={{
              display: 'grid', gridTemplateColumns: '20px 1fr auto', gap: 11, alignItems: 'center',
              height: 38, padding: '0 10px', borderRadius: 7,
              background: active ? 'oklch(0.45 0.14 240 / 0.18)' : 'transparent',
              border: '0.5px solid ' + (active ? 'oklch(0.55 0.14 240 / 0.35)' : 'transparent'),
              color: active ? 'var(--fg-1)' : 'var(--fg-2)',
              cursor: 'pointer', textAlign: 'left',
              fontFamily: 'var(--ui)',
              position: 'relative',
            }}
            onMouseEnter={e => !active && (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
            onMouseLeave={e => !active && (e.currentTarget.style.background = 'transparent')}
            >
              <Icon size={15}/>
              <span style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <span style={{ fontSize: 12.5, fontWeight: 500, lineHeight: 1.2 }}>{n.label}</span>
                <span style={{ fontSize: 10, color: 'var(--fg-3)', fontFamily: 'var(--mono)' }}>{n.sub}</span>
              </span>
              {n.badge && (
                <span style={{
                  fontFamily: 'var(--mono)', fontSize: 9.5,
                  padding: '2px 6px', borderRadius: 3,
                  background: 'oklch(0.55 0.18 240)', color: 'white',
                }}>{n.badge}</span>
              )}
              {n.live && (
                <span style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: 'oklch(0.78 0.16 75)',
                  boxShadow: '0 0 6px oklch(0.78 0.16 75)',
                }}/>
              )}
            </button>
          );
        })}
      </nav>

      {/* Brain orb pinned to bottom */}
      {showOrb && (
        <div style={{
          padding: 14, borderTop: '0.5px solid rgba(255,255,255,0.05)',
        }}>
          <LiveBrain state={brainState}/>
        </div>
      )}
    </aside>
  );
}

window.App = App;
