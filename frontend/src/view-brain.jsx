import React from 'react';
import { ICX } from './icons';
import { useApp, LiveBrain, Card, CardHead, TBtn } from './shell';
import { MOCK_PROVIDERS } from './data';

// view-brain.jsx — LLM Router dashboard

// Recent call feed — local mock data for this view
const RECENT_CALLS = [
  { id: 1, at: '09:42', model: 'gemma-3-12b',  provider: 'OR', task: 'resume_score', tin: 1420, tout: 380,  ms: 412, status: 'ok'       },
  { id: 2, at: '09:38', model: 'gemma-3-12b',  provider: 'OR', task: 'cover_letter', tin: 2180, tout: 740,  ms: 448, status: 'ok'       },
  { id: 3, at: '09:11', model: 'llama-3.2-3b', provider: 'OR', task: 'job_parse',    tin: 880,  tout: 210,  ms: 380, status: 'ok'       },
  { id: 4, at: '09:02', model: 'gemma-3-12b',  provider: 'OR', task: 'resume_score', tin: 1390, tout: 360,  ms: 891, status: 'retry'    },
  { id: 5, at: '02:11', model: 'sonnet-4',      provider: 'AC', task: 'form_fill',    tin: 3200, tout: 1100, ms: 720, status: 'failover' },
];

export function BrainView() {
  const { brainState } = useApp();
  const [activeModel, setActiveModel] = React.useState('auto');

  const models = [
    { id: 'auto',   label: 'Auto · fallback chain', sub: 'follows priority order',  hue: 240 },
    { id: 'gemma',  label: 'Gemma 3 12B',           sub: 'OpenRouter · free',        hue: 152 },
    { id: 'llama',  label: 'Llama 3.2 (local)',     sub: 'Ollama · offline-capable', hue: 200, disabled: true },
    { id: 'sonnet', label: 'Claude Sonnet 4',        sub: 'paid · highest quality',  hue: 75,  disabled: true },
  ];

  return (
    <div style={{ padding: '20px 24px 32px', display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* ─── Header ───────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <div style={{
            fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em',
            color: 'var(--accent-1)', marginBottom: 4,
          }}>
            03 · THE BRAIN
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-0.01em', margin: 0 }}>
            LLM router{' '}
            <span style={{ color: 'var(--fg-3)', fontWeight: 400 }}>· fallback chain</span>
          </h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <TBtn size="sm">
            <ICX.refresh size={12} />
            Probe providers
          </TBtn>
          <LiveBrain state={brainState} size={48} />
        </div>
      </div>

      {/* ─── Fallback chain ───────────────────────────────── */}
      <div style={{
        background: 'var(--surf-1)', border: '0.5px solid var(--border-1)',
        borderRadius: 12, padding: '18px 20px',
      }}>
        <CardHead
          kicker="Fallback chain"
          title="Provider priority · click to promote"
          right={
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{
                fontFamily: 'var(--mono)', fontSize: 9.5, letterSpacing: '0.1em',
                color: 'var(--fg-3)',
              }}>auto-failover ON</span>
              <span style={{
                fontFamily: 'var(--mono)', fontSize: 9.5, letterSpacing: '0.12em',
                color: 'oklch(0.78 0.16 152)', padding: '3px 8px', borderRadius: 4,
                background: 'oklch(0.28 0.10 152 / 0.18)',
                border: '0.5px solid oklch(0.55 0.14 152 / 0.5)',
              }}>● LIVE</span>
            </div>
          }
        />
        <div style={{ display: 'flex', alignItems: 'stretch', gap: 0 }}>
          {MOCK_PROVIDERS.map((p, i) => (
            <React.Fragment key={p.id}>
              <ChainNode p={p} />
              {i < MOCK_PROVIDERS.length - 1 && (
                <div style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  justifyContent: 'center', padding: '0 5px', gap: 3,
                  color: 'var(--fg-3)', flexShrink: 0,
                }}>
                  <svg width="22" height="10" viewBox="0 0 22 10">
                    <line x1="0" y1="5" x2="15" y2="5"
                      stroke="currentColor" strokeWidth="1" strokeDasharray="3 2" />
                    <polyline points="11,1.5 17,5 11,8.5"
                      fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                  </svg>
                  <span style={{
                    fontFamily: 'var(--mono)', fontSize: 7.5, letterSpacing: '0.1em',
                    color: 'rgba(255,255,255,0.18)', textTransform: 'uppercase',
                  }}>fail</span>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ─── Bento grid ───────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: 14 }}>

        {/* Token usage */}
        <Card padding={18}>
          <CardHead
            kicker="Token usage · 30d"
            title="By provider"
            right={
              <span style={{ fontFamily: 'var(--mono)', fontSize: 10.5, color: 'oklch(0.78 0.16 152)' }}>
                $4.81 spent
              </span>
            }
          />
          <BarChart data={MOCK_PROVIDERS} />
        </Card>

        {/* Latency */}
        <Card padding={18}>
          <CardHead kicker="Latency · p50 → p99" title="Streaming first token" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {MOCK_PROVIDERS.map(p => <LatencyBar key={p.id} p={p} />)}
          </div>
        </Card>

        {/* Model swapper */}
        <Card padding={18}>
          <CardHead kicker="Model swapper" title="Force route to…" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {models.map(m => (
              <ModelSwapItem
                key={m.id}
                {...m}
                active={activeModel === m.id}
                onSelect={() => !m.disabled && setActiveModel(m.id)}
              />
            ))}
          </div>
        </Card>
      </div>

      {/* ─── Telemetry strip ──────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        <Telemetry kicker="Reqs / 24h"          value="287"   sub="+22 since boot"               />
        <Telemetry kicker="Mean tokens / call"   value="1,420" sub="↑ from 1,180" tone="warn"    />
        <Telemetry kicker="Cache hit rate"       value="38%"   sub="prompt-prefix cache"          />
        <Telemetry kicker="Failover events"      value="2"     sub="OpenRouter RL · 02:11 UTC"    />
      </div>

      {/* ─── Recent calls + cost breakdown ───────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 14 }}>

        {/* Recent calls */}
        <Card padding={18}>
          <CardHead kicker="Recent calls" title="Last model requests" />
          <CallsTable />
        </Card>

        {/* Cost breakdown */}
        <Card padding={18}>
          <CardHead kicker="Cost breakdown" title="By provider · 30d" />
          <CostBreakdown data={MOCK_PROVIDERS} />
        </Card>
      </div>
    </div>
  );
}

// ─── Chain node ───────────────────────────────────────────────────
function ChainNode({ p }) {
  const active = p.status === 'active';
  const tierHue   = p.tier === 'free' ? 152 : p.tier === 'local' ? 200 : 75;
  const tierFg    = `oklch(0.78 0.14 ${tierHue})`;
  const tierBg    = `oklch(0.28 0.10 ${tierHue} / 0.2)`;
  const tierBord  = `oklch(0.55 0.10 ${tierHue} / 0.4)`;
  const totalK    = ((p.tokens_in + p.tokens_out) / 1000).toFixed(0) + 'k';

  return (
    <div style={{
      flex: 1, padding: '14px 14px', borderRadius: 10, cursor: 'pointer',
      background: active ? 'oklch(0.45 0.14 240 / 0.12)' : 'rgba(255,255,255,0.02)',
      border: '0.5px solid ' + (active ? 'oklch(0.55 0.16 240 / 0.5)' : 'var(--border-1)'),
      boxShadow: active ? '0 0 24px oklch(0.55 0.18 240 / 0.10) inset' : 'none',
      transition: 'box-shadow .2s',
    }}>
      {/* Status badges */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
        <span style={{
          fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.14em',
          color: 'var(--fg-3)', padding: '2px 5px', borderRadius: 3,
          background: 'rgba(255,255,255,0.05)',
        }}>#{p.priority}</span>
        {active ? (
          <span style={{
            fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.12em',
            color: 'oklch(0.85 0.16 240)', padding: '2px 6px', borderRadius: 3,
            background: 'oklch(0.38 0.14 240 / 0.28)',
            border: '0.5px solid oklch(0.55 0.16 240 / 0.5)',
          }}>● ACTIVE</span>
        ) : (
          <span style={{
            fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.12em',
            color: 'var(--fg-3)', padding: '2px 6px', borderRadius: 3,
            background: 'rgba(255,255,255,0.04)',
          }}>STANDBY</span>
        )}
      </div>

      {/* Family + model name */}
      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-1)', marginBottom: 3, lineHeight: 1.2 }}>
        {p.family}
      </div>
      <div style={{
        fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--fg-3)',
        marginBottom: 12, lineHeight: 1.4,
      }}>
        {p.name.split('·').slice(1).join('·').trim()}
      </div>

      {/* Metrics pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, alignItems: 'center' }}>
        <span style={{
          fontFamily: 'var(--mono)', fontSize: 9.5, color: 'var(--fg-2)',
          padding: '2px 6px', borderRadius: 4,
          background: 'rgba(255,255,255,0.04)', border: '0.5px solid var(--border-1)',
        }}>{p.latency}ms</span>
        <span style={{
          fontFamily: 'var(--mono)', fontSize: 9.5, padding: '2px 6px', borderRadius: 4,
          color: tierFg, background: tierBg, border: `0.5px solid ${tierBord}`,
        }}>{p.tier}</span>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 9.5, color: 'var(--fg-3)' }}>
          {totalK} tok
        </span>
      </div>
    </div>
  );
}

// ─── Token usage bar chart ────────────────────────────────────────
function BarChart({ data }) {
  const max = Math.max(...data.map(d => d.tokens_in + d.tokens_out));
  const grandTotal = data.reduce((s, d) => s + d.tokens_in + d.tokens_out, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
      {data.map(p => {
        const total = p.tokens_in + p.tokens_out;
        const pct = Math.round((total / grandTotal) * 100);
        return (
          <div key={p.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 5 }}>
              <span style={{ fontSize: 11, color: 'var(--fg-2)' }}>
                {p.family}
                <span style={{
                  color: 'var(--fg-3)', fontFamily: 'var(--mono)',
                  fontSize: 9.5, marginLeft: 5,
                }}>
                  {p.name.split('·')[1]?.trim().split(' ')[0]}
                </span>
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 9.5, color: 'var(--fg-3)' }}>{pct}%</span>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 10.5, color: 'var(--fg-2)' }}>
                  {(total / 1000).toFixed(1)}k
                </span>
              </div>
            </div>
            <div style={{ height: 5, background: 'rgba(255,255,255,0.04)', borderRadius: 3, overflow: 'hidden', display: 'flex' }}>
              <div style={{ width: `${(p.tokens_in / max) * 100}%`, background: 'oklch(0.52 0.18 var(--accent-hue, 240))' }} />
              <div style={{ width: `${(p.tokens_out / max) * 100}%`, background: 'oklch(0.76 0.16 var(--accent-hue, 240))' }} />
            </div>
          </div>
        );
      })}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 2, fontFamily: 'var(--mono)', fontSize: 9.5, color: 'var(--fg-3)' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, background: 'oklch(0.52 0.18 var(--accent-hue, 240))', flexShrink: 0 }} />
          in
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, background: 'oklch(0.76 0.16 var(--accent-hue, 240))', flexShrink: 0 }} />
          out
        </span>
        <span style={{ marginLeft: 'auto' }}>
          {(grandTotal / 1000).toFixed(0)}k total
        </span>
      </div>
    </div>
  );
}

// ─── Latency p50 → p99 bar ────────────────────────────────────────
function LatencyBar({ p }) {
  const max = 1800;
  const p50 = Math.round(p.latency * 0.68);
  const p99 = Math.min(Math.round(p.latency * 1.6), max);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6, fontSize: 11 }}>
        <span style={{ color: 'var(--fg-2)', fontWeight: 500 }}>{p.family}</span>
        <div style={{ display: 'flex', gap: 8, fontFamily: 'var(--mono)', fontSize: 10 }}>
          <span style={{ color: 'var(--fg-3)' }}>p50 {p50}ms</span>
          <span style={{ color: 'var(--fg-2)' }}>p99 {p99}ms</span>
        </div>
      </div>
      <div style={{ position: 'relative', height: 6, background: 'rgba(255,255,255,0.04)', borderRadius: 3 }}>
        {/* p99 range fill */}
        <div style={{
          position: 'absolute', left: 0, top: 0, height: '100%',
          width: `${(p99 / max) * 100}%`,
          background: 'oklch(0.52 0.10 var(--accent-hue, 240) / 0.3)',
          borderRadius: 3,
        }} />
        {/* p50 tick */}
        <div style={{
          position: 'absolute', top: -2, height: 10, width: 2,
          left: `${(p50 / max) * 100}%`,
          transform: 'translateX(-50%)',
          background: 'oklch(0.85 0.14 var(--accent-hue, 240))',
          borderRadius: 1,
        }} />
      </div>
    </div>
  );
}

// ─── Model swapper item ───────────────────────────────────────────
function ModelSwapItem({ id, label, sub, active, disabled, hue, onSelect }) {
  const [hovered, setHovered] = React.useState(false);
  const accentFg   = `oklch(0.78 0.16 ${hue})`;
  const accentBg   = `oklch(0.42 0.14 ${hue} / 0.15)`;
  const accentBord = `oklch(0.55 0.16 ${hue} / 0.4)`;

  return (
    <div
      onClick={onSelect}
      onMouseEnter={() => !disabled && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px',
        borderRadius: 7, cursor: disabled ? 'not-allowed' : 'pointer',
        background: active ? accentBg : hovered ? 'rgba(255,255,255,0.03)' : 'transparent',
        border: '0.5px solid ' + (active ? accentBord : 'transparent'),
        opacity: disabled ? 0.45 : 1,
        transition: 'background .12s, border-color .12s',
        userSelect: 'none',
      }}
    >
      {/* Radio dot */}
      <div style={{
        width: 14, height: 14, borderRadius: '50%', flexShrink: 0,
        border: '1.5px solid ' + (active ? accentFg : 'var(--border-2)'),
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'border-color .12s',
      }}>
        {active && (
          <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: accentFg,
            boxShadow: `0 0 5px ${accentFg}`,
          }} />
        )}
      </div>

      {/* Labels */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: active ? 'var(--fg-1)' : 'var(--fg-2)' }}>
          {label}
        </div>
        <div style={{ fontSize: 10.5, color: 'var(--fg-3)', fontFamily: 'var(--mono)', marginTop: 1 }}>
          {sub}
        </div>
      </div>

      {disabled && (
        <span style={{
          fontSize: 9, color: 'var(--fg-3)', fontFamily: 'var(--mono)',
          letterSpacing: '0.1em', padding: '2px 5px', borderRadius: 3,
          background: 'rgba(255,255,255,0.04)',
        }}>OFFLINE</span>
      )}
    </div>
  );
}

// ─── Telemetry card ───────────────────────────────────────────────
function Telemetry({ kicker, value, sub, tone }) {
  const valColor = tone === 'warn' ? 'oklch(0.78 0.16 75)' : 'var(--fg-1)';
  return (
    <div style={{
      padding: '14px 16px',
      background: 'var(--surf-1)', border: '0.5px solid var(--border-1)', borderRadius: 10,
    }}>
      <div style={{
        fontFamily: 'var(--mono)', fontSize: 9.5, letterSpacing: '0.14em',
        color: 'var(--fg-3)', textTransform: 'uppercase', marginBottom: 8,
      }}>{kicker}</div>
      <div style={{
        fontSize: 22, fontWeight: 600, lineHeight: 1,
        fontVariantNumeric: 'tabular-nums', color: valColor,
      }}>{value}</div>
      <div style={{ fontSize: 10.5, color: 'var(--fg-3)', marginTop: 6 }}>{sub}</div>
    </div>
  );
}

// ─── Recent calls table ───────────────────────────────────────────
const COL = '48px 1fr 110px 96px 58px 34px';

function CallsTable() {
  return (
    <div>
      {/* Header */}
      <div style={{
        display: 'grid', gridTemplateColumns: COL, gap: 10,
        paddingBottom: 8, borderBottom: '0.5px solid var(--border-1)',
      }}>
        {['Time', 'Task', 'Model', 'Tokens', 'Lat.', ''].map((h, i) => (
          <span key={i} style={{
            fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.12em',
            color: 'var(--fg-3)', textTransform: 'uppercase',
          }}>{h}</span>
        ))}
      </div>
      {/* Rows */}
      {RECENT_CALLS.map((call, i) => <CallRow key={call.id} call={call} i={i} />)}
    </div>
  );
}

function CallRow({ call, i }) {
  const statusColor = call.status === 'ok'       ? 'oklch(0.78 0.16 152)'
                    : call.status === 'retry'    ? 'oklch(0.78 0.16 75)'
                    : /* failover */               'oklch(0.70 0.18 28)';
  const statusGlyph = call.status === 'ok'       ? '✓'
                    : call.status === 'retry'    ? '↺'
                    : /* failover */               '⤴';

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: COL, gap: 10, alignItems: 'center',
      padding: '7px 0',
      borderBottom: '0.5px solid rgba(255,255,255,0.04)',
      animation: `slideIn .4s ${i * 0.05}s backwards`,
    }}>
      <span style={{ fontFamily: 'var(--mono)', fontSize: 10.5, color: 'var(--fg-3)' }}>
        {call.at}
      </span>
      <span style={{ fontSize: 11.5, fontWeight: 500, color: 'var(--fg-2)' }}>
        {call.task}
      </span>
      <span style={{
        fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--fg-3)',
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>
        {call.model}
      </span>
      <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--fg-3)' }}>
        {call.tin}→{call.tout}
      </span>
      <span style={{ fontFamily: 'var(--mono)', fontSize: 10.5, color: 'var(--fg-2)' }}>
        {call.ms}ms
      </span>
      <span style={{
        fontFamily: 'var(--mono)', fontSize: 12, color: statusColor,
        textAlign: 'center', lineHeight: 1,
      }}>
        {statusGlyph}
      </span>
    </div>
  );
}

// ─── Cost breakdown ───────────────────────────────────────────────
function CostBreakdown({ data }) {
  const totalTokens = data.reduce((s, d) => s + d.tokens_in + d.tokens_out, 0);
  const totalCost   = data.reduce((s, d) => s + d.cost, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {data.map(p => {
        const tokens = p.tokens_in + p.tokens_out;
        const pct    = (tokens / totalTokens) * 100;
        const tHue   = p.tier === 'free' ? 152 : p.tier === 'local' ? 200 : 75;
        const tFg    = `oklch(0.78 0.14 ${tHue})`;
        const tTrack = `oklch(0.38 0.10 ${tHue} / 0.28)`;

        return (
          <div key={p.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 5 }}>
              <span style={{ fontSize: 11.5, fontWeight: 500, color: 'var(--fg-2)' }}>{p.family}</span>
              <span style={{
                fontFamily: 'var(--mono)', fontSize: 11,
                color: p.cost > 0 ? 'oklch(0.78 0.16 75)' : 'var(--fg-3)',
              }}>
                {p.cost > 0 ? `$${p.cost.toFixed(2)}` : 'free'}
              </span>
            </div>
            <div style={{ height: 4, background: 'rgba(255,255,255,0.04)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{
                width: `${pct}%`, height: '100%',
                background: tTrack,
                borderRight: `1.5px solid ${tFg}`,
              }} />
            </div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--fg-3)', marginTop: 4 }}>
              {(tokens / 1000).toFixed(0)}k tokens · {Math.round(pct)}%
            </div>
          </div>
        );
      })}

      {/* Total row */}
      <div style={{
        marginTop: 4, paddingTop: 12,
        borderTop: '0.5px solid var(--border-1)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div>
          <div style={{ fontSize: 11, color: 'var(--fg-3)' }}>30-day total</div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 9.5, color: 'var(--fg-3)', marginTop: 3 }}>
            {(totalTokens / 1000).toFixed(0)}k tokens
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{
            fontFamily: 'var(--mono)', fontSize: 18, fontWeight: 700,
            color: 'oklch(0.78 0.16 152)', lineHeight: 1,
          }}>
            ${totalCost.toFixed(2)}
          </div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 9.5, color: 'oklch(0.65 0.14 152)', marginTop: 3 }}>
            {(((totalTokens - data.find(d => d.tier === 'paid')?.tokens_in ?? 0) / totalTokens) * 100).toFixed(0)}% free
          </div>
        </div>
      </div>
    </div>
  );
}
