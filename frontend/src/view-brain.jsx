import React from 'react';
import { ICX } from './icons';
import { useApp, LiveBrain, MatchMeter, StackBadge, DistancePill, Tooltip, SeverityDot, Card, CardHead, TBtn } from './shell';
// view-brain.jsx — LLM Router dashboard

export function BrainView() {
  const { brainState } = useApp();
  return (
    <div style={{ padding: '20px 24px 32px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 22 }}>
        <div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em', color: 'var(--accent-1)', marginBottom: 4 }}>
            03 · THE BRAIN
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-0.01em', margin: 0 }}>
            LLM router <span style={{ color: 'var(--fg-3)', fontWeight: 400 }}>· fallback chain</span>
          </h1>
        </div>
        <LiveBrain state={brainState} size={48}/>
      </div>

      {/* Fallback chain visualizer */}
      <div style={{
        background: 'var(--surf-1)', border: '0.5px solid var(--border-1)',
        borderRadius: 12, padding: '20px 22px', marginBottom: 16,
      }}>
        <CardHead kicker="Fallback chain" title="Provider priority · click to swap"/>
        <div style={{ display: 'flex', alignItems: 'stretch', gap: 0, position: 'relative' }}>
          {MOCK_PROVIDERS.map((p, i) => (
            <React.Fragment key={p.id}>
              <ChainNode p={p}/>
              {i < MOCK_PROVIDERS.length - 1 && (
                <div style={{ display: 'flex', alignItems: 'center', padding: '0 4px', color: 'var(--fg-3)' }}>
                  <ICX.arrowR size={14}/>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Bento — token usage, latency, model swapper */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: 14, marginBottom: 16 }}>
        <Card padding={18}>
          <CardHead kicker="Token usage · 30d" title="By provider" right={
            <span style={{ fontFamily: 'var(--mono)', fontSize: 10.5, color: 'oklch(0.78 0.16 152)' }}>$4.81 spent</span>
          }/>
          <BarChart data={MOCK_PROVIDERS}/>
        </Card>

        <Card padding={18}>
          <CardHead kicker="Latency · p50 → p99" title="Streaming first token"/>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {MOCK_PROVIDERS.map(p => <LatencyBar key={p.id} p={p}/>)}
          </div>
        </Card>

        <Card padding={18}>
          <CardHead kicker="Model swapper" title="Force route to…"/>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { id: 'auto',    label: 'Auto · fallback chain', sub: 'follows priority order',     active: true },
              { id: 'gemma',   label: 'Gemma 3 12B',           sub: 'OpenRouter · free',          active: false },
              { id: 'llama',   label: 'Llama 3.2 (local)',     sub: 'Ollama · offline-capable',   active: false },
              { id: 'sonnet',  label: 'Claude Sonnet 4',       sub: 'paid · highest quality',     active: false },
            ].map((m, i) => (
              <ModelSwapItem key={m.id} {...m} disabled={i === 2}/>
            ))}
          </div>
        </Card>
      </div>

      {/* Cost & telemetry strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        <Telemetry kicker="Reqs / 24h" value="287" sub="+22 since boot"/>
        <Telemetry kicker="Mean tokens / call" value="1,420" sub="↑ from 1,180" tone="warn"/>
        <Telemetry kicker="Cache hit rate" value="38%" sub="prompt-prefix cache"/>
        <Telemetry kicker="Failover events" value="2" sub="OpenRouter rate-limit · 02:11 UTC"/>
      </div>
    </div>
  );
}

export function ChainNode({ p }) {
  const active = p.status === 'active';
  return (
    <div style={{
      flex: 1, padding: 14, borderRadius: 10,
      background: active ? 'oklch(0.45 0.14 240 / 0.18)' : 'rgba(255,255,255,0.025)',
      border: '0.5px solid ' + (active ? 'oklch(0.55 0.16 240 / 0.5)' : 'var(--border-1)'),
      position: 'relative',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span style={{
          fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.14em',
          color: 'var(--fg-3)', padding: '2px 6px', borderRadius: 3,
          background: 'rgba(255,255,255,0.05)',
        }}>#{p.priority}</span>
        {active && <span style={{
          fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.14em',
          color: 'oklch(0.85 0.16 240)', padding: '2px 6px', borderRadius: 3,
          background: 'oklch(0.45 0.14 240 / 0.3)',
        }}>● ACTIVE</span>}
      </div>
      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--fg-1)', marginBottom: 4, lineHeight: 1.3 }}>
        {p.family}
      </div>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 10.5, color: 'var(--fg-3)', marginBottom: 10 }}>
        {p.name.split('·').slice(1).join('·').trim()}
      </div>
      <div style={{ display: 'flex', gap: 10, fontFamily: 'var(--mono)', fontSize: 10 }}>
        <span style={{ color: 'var(--fg-2)' }}>{p.latency}ms</span>
        <span style={{ color: p.tier === 'free' ? 'oklch(0.78 0.16 152)' : p.tier === 'local' ? 'oklch(0.78 0.14 200)' : 'oklch(0.78 0.16 75)' }}>
          {p.tier}
        </span>
      </div>
    </div>
  );
}

export function BarChart({ data }) {
  const max = Math.max(...data.map(d => d.tokens_in + d.tokens_out));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
      {data.map(p => {
        const total = p.tokens_in + p.tokens_out;
        return (
          <div key={p.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: 11 }}>
              <span style={{ color: 'var(--fg-2)' }}>{p.family} · {p.name.split('·')[1]?.trim().split(' ')[0]}</span>
              <span style={{ fontFamily: 'var(--mono)', color: 'var(--fg-3)' }}>{(total/1000).toFixed(1)}k</span>
            </div>
            <div style={{ height: 6, background: 'rgba(255,255,255,0.04)', borderRadius: 3, overflow: 'hidden', display: 'flex' }}>
              <div style={{ width: `${(p.tokens_in/max)*100}%`, background: 'oklch(0.55 0.18 240)' }}/>
              <div style={{ width: `${(p.tokens_out/max)*100}%`, background: 'oklch(0.78 0.16 240)' }}/>
            </div>
          </div>
        );
      })}
      <div style={{ display: 'flex', gap: 14, marginTop: 4, fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--fg-3)' }}>
        <span><span style={{ display: 'inline-block', width: 8, height: 8, background: 'oklch(0.55 0.18 240)', borderRadius: 2, marginRight: 5 }}/>in</span>
        <span><span style={{ display: 'inline-block', width: 8, height: 8, background: 'oklch(0.78 0.16 240)', borderRadius: 2, marginRight: 5 }}/>out</span>
      </div>
    </div>
  );
}

export function LatencyBar({ p }) {
  const max = 1500;
  const p50 = p.latency * 0.7, p99 = p.latency * 1.4;
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 5 }}>
        <span style={{ color: 'var(--fg-2)' }}>{p.family}</span>
        <span style={{ fontFamily: 'var(--mono)', color: 'var(--fg-3)' }}>{p.latency}ms</span>
      </div>
      <div style={{ position: 'relative', height: 4, background: 'rgba(255,255,255,0.04)', borderRadius: 2 }}>
        <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${(p99/max)*100}%`, background: 'oklch(0.55 0.10 240 / 0.4)', borderRadius: 2 }}/>
        <div style={{ position: 'absolute', left: `${(p50/max)*100 - 0.5}%`, top: -2, width: 2, height: 8, background: 'oklch(0.85 0.14 240)', borderRadius: 1 }}/>
      </div>
    </div>
  );
}

export function ModelSwapItem({ label, sub, active, disabled }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px',
      borderRadius: 7, cursor: disabled ? 'not-allowed' : 'pointer',
      background: active ? 'oklch(0.45 0.14 240 / 0.15)' : 'transparent',
      border: '0.5px solid ' + (active ? 'oklch(0.55 0.16 240 / 0.4)' : 'transparent'),
      opacity: disabled ? 0.5 : 1,
    }}>
      <div style={{
        width: 14, height: 14, borderRadius: '50%',
        border: '1.5px solid ' + (active ? 'oklch(0.78 0.16 240)' : 'var(--border-2)'),
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        {active && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'oklch(0.78 0.16 240)', boxShadow: '0 0 6px oklch(0.78 0.16 240)' }}/>}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--fg-1)' }}>{label}</div>
        <div style={{ fontSize: 10.5, color: 'var(--fg-3)', fontFamily: 'var(--mono)' }}>{sub}</div>
      </div>
      {disabled && <span style={{ fontSize: 9, color: 'var(--fg-3)', fontFamily: 'var(--mono)', letterSpacing: '0.1em' }}>OFFLINE</span>}
    </div>
  );
}

export function Telemetry({ kicker, value, sub, tone }) {
  return (
    <div style={{ padding: '14px 16px', background: 'var(--surf-1)', border: '0.5px solid var(--border-1)', borderRadius: 10 }}>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 9.5, letterSpacing: '0.14em', color: 'var(--fg-3)', textTransform: 'uppercase', marginBottom: 8 }}>{kicker}</div>
      <div style={{ fontSize: 22, fontWeight: 600, color: tone === 'warn' ? 'oklch(0.78 0.16 75)' : 'var(--fg-1)', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
      <div style={{ fontSize: 10.5, color: 'var(--fg-3)', marginTop: 6 }}>{sub}</div>
    </div>
  );
}

