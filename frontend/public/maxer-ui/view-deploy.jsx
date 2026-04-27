// view-deploy.jsx — Deployment Modal (split-screen)

function DeployModal({ job, onClose }) {
  const { resumes } = useApp();
  const [resume, setResume] = React.useState(job.resume);
  const [letter, setLetter] = React.useState(() => COVER_LETTER_TEMPLATE(job));
  const [method, setMethod] = React.useState('SMTP');
  const [executing, setExecuting] = React.useState(false);
  const [done, setDone] = React.useState(false);

  React.useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const execute = () => {
    setExecuting(true);
    setTimeout(() => { setExecuting(false); setDone(true); }, 2400);
    setTimeout(() => onClose(), 4200);
  };

  const resumeOpts = resumes.filter(r => r.kind === 'resume');

  return (
    <div className="modal-backdrop" style={{
      position: 'absolute', inset: 0, zIndex: 100,
      background: 'rgba(8,9,12,0.7)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 32,
    }}>
      <div className="modal-shell" style={{
        width: '100%', maxWidth: 1180, height: '100%', maxHeight: 720,
        background: 'oklch(0.16 0.01 240 / 0.85)',
        backdropFilter: 'blur(40px) saturate(140%)',
        border: '0.5px solid rgba(255,255,255,0.1)',
        borderRadius: 14,
        display: 'flex', flexDirection: 'column',
        boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14,
          borderBottom: '0.5px solid var(--border-1)', flexShrink: 0,
        }}>
          <MatchMeter score={job.score} size={42}/>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 9.5, letterSpacing: '0.16em', color: 'var(--accent-1)' }}>
              REVIEW & DEPLOY
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg-1)' }}>
              {job.role} <span style={{ color: 'var(--fg-3)', fontWeight: 400 }}>· {job.company}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <DistancePill km={job.distance_km}/>
            <StackBadge stack={job.primary_stack}/>
            <button onClick={onClose} style={{
              width: 28, height: 28, borderRadius: 6,
              background: 'rgba(255,255,255,0.04)', border: '0.5px solid var(--border-1)',
              color: 'var(--fg-2)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}><ICX.x size={13}/></button>
          </div>
        </div>

        {/* Body — split screen */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', overflow: 'hidden' }}>
          {/* LEFT — original job ad */}
          <div style={{ borderRight: '0.5px solid var(--border-1)', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <PaneHead title="Original Listing" sub={`source: linkedin.com · scraped ${job.posted}`}/>
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 22px 22px', fontSize: 12.5, lineHeight: 1.65, color: 'var(--fg-2)' }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--fg-1)', marginBottom: 4 }}>{job.role}</div>
              <div style={{ fontSize: 12, color: 'var(--fg-3)', marginBottom: 14 }}>
                {job.company} · {job.location} · Full-time · {job.salary}
              </div>
              <p style={{ margin: '0 0 18px' }}>{job.description}</p>

              <SectionHead label="Required"/>
              <ul style={{ paddingLeft: 16, margin: '0 0 18px' }}>
                {job.must_have.map((m, i) => <li key={i} style={{ marginBottom: 4 }}>{m}</li>)}
              </ul>

              <SectionHead label="Nice to have"/>
              <ul style={{ paddingLeft: 16, margin: '0 0 18px' }}>
                {job.nice_to_have.map((m, i) => <li key={i} style={{ marginBottom: 4 }}>{m}</li>)}
              </ul>

              <SectionHead label="Stack"/>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {job.stack.map(s => (
                  <span key={s} style={{
                    fontFamily: 'var(--mono)', fontSize: 10, padding: '3px 8px',
                    background: 'rgba(255,255,255,0.04)', border: '0.5px solid var(--border-1)',
                    borderRadius: 4, color: 'var(--fg-2)',
                  }}>{s}</span>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT — generated cover letter + resume picker */}
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <PaneHead title="Generated package" sub={
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'oklch(0.78 0.18 152)' }}/>
                editable · last gen 12s ago · gemma-3-12b
              </span>
            } right={
              <TBtn size="sm" onClick={() => setLetter(COVER_LETTER_TEMPLATE(job))}>
                <ICX.refresh size={12}/> Regenerate
              </TBtn>
            }/>

            {/* Resume picker */}
            <div style={{ padding: '12px 22px', borderBottom: '0.5px solid var(--border-1)' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 9.5, letterSpacing: '0.14em', color: 'var(--fg-3)', marginBottom: 8 }}>
                ATTACHED RESUME
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {resumeOpts.map(r => (
                  <button key={r.name} onClick={() => setResume(r.name)} style={{
                    display: 'flex', alignItems: 'center', gap: 7, padding: '7px 10px',
                    background: resume === r.name ? 'oklch(0.45 0.14 240 / 0.18)' : 'rgba(255,255,255,0.025)',
                    border: '0.5px solid ' + (resume === r.name ? 'oklch(0.55 0.16 240 / 0.5)' : 'var(--border-1)'),
                    borderRadius: 6, cursor: 'pointer', color: resume === r.name ? 'oklch(0.92 0.06 240)' : 'var(--fg-2)',
                    fontFamily: 'var(--ui)', fontSize: 11.5,
                  }}>
                    <ICX.doc size={12}/>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 10.5 }}>{r.name}</span>
                    {resume === r.name && <ICX.check size={12}/>}
                  </button>
                ))}
              </div>
            </div>

            {/* Cover letter editor */}
            <div style={{ flex: 1, padding: '16px 22px', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 9.5, letterSpacing: '0.14em', color: 'var(--fg-3)', marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
                <span>COVER LETTER · EDITABLE</span>
                <span>{letter.length} chars</span>
              </div>
              <textarea value={letter} onChange={e => setLetter(e.target.value)} style={{
                flex: 1, resize: 'none', width: '100%',
                background: 'rgba(0,0,0,0.25)',
                border: '0.5px solid var(--border-1)',
                borderRadius: 8, padding: '12px 14px',
                color: 'var(--fg-1)', fontFamily: 'var(--ui)', fontSize: 12.5, lineHeight: 1.6,
                outline: 'none',
              }}/>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 12,
          borderTop: '0.5px solid var(--border-1)', flexShrink: 0,
        }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10.5, letterSpacing: '0.1em', color: 'var(--fg-3)' }}>METHOD</span>
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', border: '0.5px solid var(--border-1)', borderRadius: 6, padding: 2 }}>
            {['SMTP', 'Playwright'].map(m => (
              <button key={m} onClick={() => setMethod(m)} style={{
                padding: '5px 12px', borderRadius: 4, fontSize: 11, fontWeight: 500,
                background: method === m ? 'oklch(0.45 0.14 240 / 0.4)' : 'transparent',
                color: method === m ? 'oklch(0.92 0.06 240)' : 'var(--fg-2)',
                border: 0, cursor: 'pointer', fontFamily: 'var(--ui)',
              }}>{m === 'SMTP' ? '✉ Email (SMTP)' : '🤖 Auto-fill (Playwright)'}</button>
            ))}
          </div>
          <div style={{ flex: 1 }}/>
          <span style={{ fontSize: 11, color: 'var(--fg-3)' }}>
            Will log to <code style={{ fontFamily: 'var(--mono)', color: 'var(--fg-2)' }}>applications.{job.id}</code>
          </span>
          <TBtn onClick={onClose}>Cancel</TBtn>
          <TBtn primary onClick={execute} disabled={executing || done}>
            {done ? <><ICX.check size={13}/> Sent · #1285</> : executing ? <><span className="spin">◐</span> {method === 'SMTP' ? 'Sending email…' : 'Filling form…'}</> : <><ICX.send size={13}/> Execute application</>}
          </TBtn>
        </div>
      </div>
    </div>
  );
}

function PaneHead({ title, sub, right }) {
  return (
    <div style={{
      padding: '12px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      borderBottom: '0.5px solid var(--border-1)', flexShrink: 0,
    }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-1)' }}>{title}</div>
        <div style={{ fontSize: 10.5, color: 'var(--fg-3)', fontFamily: 'var(--mono)', marginTop: 2 }}>{sub}</div>
      </div>
      {right}
    </div>
  );
}

function SectionHead({ label }) {
  return (
    <div style={{
      fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em',
      color: 'var(--fg-3)', textTransform: 'uppercase', marginBottom: 8,
    }}>{label}</div>
  );
}

window.DeployModal = DeployModal;
