import React from 'react';
import { ICX } from './icons';
import { useApp, LiveBrain, MatchMeter, StackBadge, DistancePill, Tooltip, SeverityDot, Card, CardHead, TBtn } from './shell';
// view-hunt.jsx — The Hunt main dashboard

export function HuntView() {
  const { jobs, openDeploy, brainState } = useApp();
  const [filter, setFilter] = React.useState('new');
  const [sort, setSort] = React.useState('score');

  const filtered = React.useMemo(() => {
    let list = jobs;
    if (filter === 'new') list = list.filter(j => j.new);
    else if (filter === 'fit') list = list.filter(j => j.score >= 90);
    else if (filter === 'remote') list = list.filter(j => j.distance_km === 0);
    if (sort === 'score') list = [...list].sort((a, b) => b.score - a.score);
    else if (sort === 'recent') list = [...list].sort((a, b) => a.posted.localeCompare(b.posted));
    return list;
  }, [jobs, filter, sort]);

  const stats = React.useMemo(() => ({
    scanned: 1284,
    today: jobs.filter(j => j.new).length,
    above90: jobs.filter(j => j.score >= 90).length,
    queued: 3,
  }), [jobs]);

  return (
    <div style={{ padding: '20px 24px 32px', minHeight: '100%' }}>
      {/* Header strip */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 18 }}>
        <div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em', color: 'var(--accent-1)', marginBottom: 4 }}>
            01 · THE HUNT
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-0.01em', margin: 0, color: 'var(--fg-1)' }}>
            Top matches <span style={{ color: 'var(--fg-3)', fontWeight: 400 }}>· last 24h</span>
          </h1>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <TBtn size="sm"><ICX.refresh size={13}/> Rescan</TBtn>
          <TBtn size="sm"><ICX.filter size={13}/> Boards · 6</TBtn>
        </div>
      </div>

      {/* Stat strip */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 18,
      }}>
        <StatCard kicker="Scanned today" value={stats.scanned.toLocaleString()} sub="↑ 12% vs yesterday" tone="neutral"/>
        <StatCard kicker="New (<24h)" value={stats.today} sub={`across ${jobs.length} listings`} tone="accent"/>
        <StatCard kicker="≥ 90% fit" value={stats.above90} sub="auto-queueable" tone="match"/>
        <StatCard kicker="In deploy queue" value={stats.queued} sub="awaiting approval" tone="warn"/>
      </div>

      {/* Filter row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14, padding: '6px 0' }}>
        {[
          { id: 'all',    label: `All · ${jobs.length}` },
          { id: 'new',    label: `New · ${jobs.filter(j => j.new).length}` },
          { id: 'fit',    label: '≥ 90% fit' },
          { id: 'remote', label: 'Remote only' },
        ].map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)} style={{
            height: 26, padding: '0 11px', borderRadius: 6,
            border: '0.5px solid ' + (filter === f.id ? 'oklch(0.55 0.16 240 / 0.5)' : 'transparent'),
            background: filter === f.id ? 'oklch(0.45 0.14 240 / 0.18)' : 'transparent',
            color: filter === f.id ? 'oklch(0.85 0.12 240)' : 'var(--fg-2)',
            fontFamily: 'var(--ui)', fontSize: 11.5, fontWeight: 500, cursor: 'pointer',
          }}>{f.label}</button>
        ))}
        <div style={{ flex: 1 }}/>
        <span style={{ fontSize: 10.5, color: 'var(--fg-3)', fontFamily: 'var(--mono)', letterSpacing: '0.08em' }}>SORT BY</span>
        <select value={sort} onChange={e => setSort(e.target.value)} style={{
          height: 26, padding: '0 8px', borderRadius: 6,
          background: 'rgba(255,255,255,0.04)',
          border: '0.5px solid var(--border-1)',
          color: 'var(--fg-1)', fontFamily: 'var(--ui)', fontSize: 11.5,
        }}>
          <option value="score">Match score</option>
          <option value="recent">Most recent</option>
        </select>
      </div>

      {/* Job rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map((job, i) => (
          <JobRow key={job.id} job={job} delay={i * 60} onDeploy={() => openDeploy(job)} />
        ))}
      </div>
    </div>
  );
}

export function StatCard({ kicker, value, sub, tone = 'neutral' }) {
  const accents = {
    neutral: 'var(--fg-1)',
    accent: 'oklch(0.78 0.16 240)',
    match: 'oklch(0.78 0.16 152)',
    warn: 'oklch(0.78 0.16 75)',
  };
  return (
    <div style={{
      padding: '14px 16px',
      background: 'var(--surf-1)',
      border: '0.5px solid var(--border-1)',
      borderRadius: 10,
    }}>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 9.5, letterSpacing: '0.14em', color: 'var(--fg-3)', textTransform: 'uppercase', marginBottom: 8 }}>
        {kicker}
      </div>
      <div style={{ fontSize: 26, fontWeight: 600, color: accents[tone], lineHeight: 1, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}>
        {value}
      </div>
      <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 6 }}>{sub}</div>
    </div>
  );
}

export function JobRow({ job, delay = 0, onDeploy }) {
  return (
    <div className="job-row" style={{
      display: 'grid',
      gridTemplateColumns: '76px 1fr auto',
      gap: 18, alignItems: 'center',
      padding: '16px 18px',
      background: 'var(--surf-1)',
      border: '0.5px solid var(--border-1)',
      borderRadius: 10,
      animation: `slideIn .5s ${delay}ms cubic-bezier(.2,.8,.2,1) backwards`,
      position: 'relative',
    }}>
      {job.new && (
        <span className="new-pill" style={{
          position: 'absolute', top: 10, right: 10,
          fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.14em',
          padding: '2px 6px', borderRadius: 3,
          background: 'oklch(0.55 0.18 240 / 0.2)', color: 'oklch(0.85 0.16 240)',
          border: '0.5px solid oklch(0.55 0.18 240 / 0.5)',
        }}>NEW</span>
      )}

      <MatchMeter score={job.score}/>

      <div style={{ minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--fg-3)', letterSpacing: '0.04em' }}>
            {job.company}
          </span>
          <span style={{ color: 'var(--fg-3)' }}>·</span>
          <span style={{ fontSize: 11, color: 'var(--fg-3)' }}>{job.posted}</span>
        </div>
        <div style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--fg-1)', marginBottom: 8, letterSpacing: '-0.005em' }}>
          {job.role}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <DistancePill km={job.distance_km}/>
          <StackBadge stack={job.primary_stack}/>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5, height: 22, padding: '0 8px', borderRadius: 5,
            fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--fg-2)',
            background: 'rgba(255,255,255,0.025)', border: '0.5px solid rgba(255,255,255,0.07)',
          }}>
            <ICX.euro size={11}/> {job.salary}
          </span>
          <Tooltip text={
            <div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.12em', color: 'var(--accent-1)', marginBottom: 6 }}>
                LOGIC · WHY THIS RESUME
              </div>
              <div style={{ marginBottom: 8 }}>{job.logic}</div>
              <div style={{ display: 'flex', gap: 6, fontFamily: 'var(--mono)', fontSize: 10 }}>
                <span style={{ color: 'oklch(0.78 0.16 152)' }}>✓ {job.resume}</span>
                <span style={{ color: 'var(--fg-3)' }}>· skipped {job.resume_alt}</span>
              </div>
            </div>
          }>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 5, height: 22, padding: '0 8px', borderRadius: 5,
              fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--fg-2)', cursor: 'help',
              background: 'oklch(0.45 0.14 240 / 0.1)', border: '0.5px solid oklch(0.55 0.16 240 / 0.3)',
            }}>
              <ICX.info size={11}/> {job.resume.replace('.pdf', '')}
            </span>
          </Tooltip>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <TBtn size="sm">View</TBtn>
        <TBtn size="sm" primary onClick={onDeploy}>
          <ICX.send size={12}/> Deploy
        </TBtn>
      </div>
    </div>
  );
}

