// view-agent.jsx — Agentic Loop Console (tool-call cycle + diff approval)

function AgentView() {
  const [timeline, setTimeline] = React.useState(MOCK_TOOL_TIMELINE);
  const [selected, setSelected] = React.useState(4);
  const [approving, setApproving] = React.useState(null);

  const current = timeline[selected];

  const approve = () => {
    setApproving('done');
    setTimeout(() => {
      setTimeline(t => t.map((s, i) => i === selected ? { ...s, status: 'done', approved: 'manual', dur: 18, result: 'patch applied (3 hunks)' } : s));
      setApproving(null);
    }, 900);
  };
  const reject = () => {
    setTimeline(t => t.map((s, i) => i === selected ? { ...s, status: 'rejected', approved: 'rejected' } : s));
  };

  return (
    <div style={{ padding: '20px 24px 32px', minHeight: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 18 }}>
        <div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em', color: 'var(--accent-1)', marginBottom: 4 }}>
            02 · AGENT CONSOLE
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-0.01em', margin: 0 }}>
            Tool-call loop <span style={{ color: 'var(--fg-3)', fontWeight: 400 }}>· session 7f3a2c</span>
          </h1>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10.5, letterSpacing: '0.1em', color: 'var(--fg-3)' }}>
            ITER {timeline.filter(t => t.status === 'done').length} / 20
          </span>
          <TBtn size="sm"><ICX.pause size={12}/> Pause</TBtn>
          <TBtn size="sm"><ICX.x size={12}/> Halt</TBtn>
        </div>
      </div>

      {/* iteration progress */}
      <div style={{
        height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.05)',
        overflow: 'hidden', marginBottom: 22,
      }}>
        <div style={{
          width: `${(timeline.filter(t => t.status === 'done').length / 20) * 100}%`,
          height: '100%', background: 'linear-gradient(90deg, oklch(0.55 0.18 240), oklch(0.78 0.18 240))',
          boxShadow: '0 0 12px oklch(0.55 0.18 240)',
        }}/>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: 16 }}>
        {/* Left — tool-call cycle visualizer */}
        <div style={{
          background: 'var(--surf-1)', border: '0.5px solid var(--border-1)',
          borderRadius: 12, padding: 16, alignSelf: 'start',
        }}>
          <CardHead kicker="Tool-call cycle" title="Iteration timeline"/>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {timeline.map((step, i) => (
              <ToolStep key={i} step={step} active={i === selected} last={i === timeline.length - 1}
                        onClick={() => setSelected(i)}/>
            ))}
            {/* upcoming hint */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '12px 0 0 4px', color: 'var(--fg-3)',
              fontFamily: 'var(--mono)', fontSize: 10.5,
            }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', border: '1px dashed var(--fg-3)' }}/>
              await llm — predicting next tool call…
            </div>
          </div>
        </div>

        {/* Right — current step detail + diff viewer */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Detail */}
          <div style={{
            background: 'var(--surf-1)', border: `0.5px solid ${current.status === 'pending' ? 'oklch(0.55 0.16 75 / 0.35)' : 'var(--border-1)'}`,
            borderRadius: 12, padding: 16,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <SeverityDot level={current.danger}/>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--fg-3)' }}>iter {current.iter}</span>
              <span style={{ color: 'var(--border-1)' }}>·</span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--fg-1)', fontWeight: 600 }}>{current.tool}</span>
              <span style={{
                marginLeft: 'auto', fontFamily: 'var(--mono)', fontSize: 9.5,
                letterSpacing: '0.14em', textTransform: 'uppercase',
                color: dangerColor(current.danger),
                padding: '3px 7px', borderRadius: 4,
                background: `${dangerColor(current.danger)} / 0.12`,
                border: `0.5px solid ${dangerColor(current.danger)}`,
                opacity: 0.9,
              }}>{current.danger}</span>
            </div>
            <div style={{
              padding: '10px 12px', borderRadius: 6,
              background: 'rgba(0,0,0,0.3)', border: '0.5px solid var(--border-1)',
              fontFamily: 'var(--mono)', fontSize: 11.5, color: 'var(--fg-2)',
              marginBottom: 10,
            }}>{current.args}</div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              <Meta label="Status" value={
                current.status === 'done' ? <span style={{ color: 'oklch(0.78 0.16 152)' }}>✓ done</span>
                : current.status === 'pending' ? <span style={{ color: 'oklch(0.78 0.16 75)' }}>● awaiting approval</span>
                : <span style={{ color: 'oklch(0.70 0.20 28)' }}>✗ rejected</span>
              }/>
              <Meta label="Approval" value={current.approved || '—'}/>
              <Meta label="Duration" value={current.dur != null ? `${current.dur}ms` : '—'}/>
            </div>
          </div>

          {/* Diff viewer (only when write_file pending) */}
          {current.tool === 'write_file' && (
            <div style={{
              background: 'var(--surf-1)', border: '0.5px solid var(--border-1)',
              borderRadius: 12, overflow: 'hidden',
            }}>
              <div style={{
                padding: '11px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                borderBottom: '0.5px solid var(--border-1)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <ICX.doc size={13}/>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 11.5, color: 'var(--fg-1)' }}>
                    app/llm/openrouter.py
                  </span>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--fg-3)' }}>
                    +5 −2
                  </span>
                </div>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 9.5, letterSpacing: '0.14em', color: 'oklch(0.78 0.16 75)' }}>
                  PENDING APPROVAL
                </span>
              </div>
              <div style={{
                padding: '8px 0', maxHeight: 280, overflowY: 'auto',
                fontFamily: 'var(--mono)', fontSize: 11.5, lineHeight: 1.6,
                background: 'rgba(0,0,0,0.25)',
              }}>
                {MOCK_DIFF.map((line, i) => (
                  <div key={i} style={{
                    display: 'grid', gridTemplateColumns: '32px 16px 1fr',
                    background: line.kind === 'add' ? 'oklch(0.45 0.14 152 / 0.12)'
                              : line.kind === 'del' ? 'oklch(0.45 0.16 28 / 0.12)'
                              : 'transparent',
                    borderLeft: `2px solid ${line.kind === 'add' ? 'oklch(0.78 0.16 152)' : line.kind === 'del' ? 'oklch(0.78 0.18 28)' : 'transparent'}`,
                    paddingLeft: 0,
                  }}>
                    <span style={{ textAlign: 'right', paddingRight: 10, color: 'var(--fg-3)', fontSize: 10 }}>
                      {line.kind === 'meta' ? '' : i}
                    </span>
                    <span style={{ textAlign: 'center', color: line.kind === 'add' ? 'oklch(0.78 0.16 152)' : line.kind === 'del' ? 'oklch(0.78 0.18 28)' : 'var(--fg-3)' }}>
                      {line.kind === 'add' ? '+' : line.kind === 'del' ? '−' : line.kind === 'meta' ? '@' : ' '}
                    </span>
                    <span style={{
                      color: line.kind === 'meta' ? 'oklch(0.65 0.10 240)'
                          : line.kind === 'ctx' ? 'var(--fg-2)' : 'var(--fg-1)',
                      paddingRight: 12,
                      fontStyle: line.kind === 'meta' ? 'italic' : 'normal',
                    }}>{line.text}</span>
                  </div>
                ))}
              </div>
              <div style={{
                padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10,
                borderTop: '0.5px solid var(--border-1)',
              }}>
                <ICX.shield size={13}/>
                <span style={{ fontSize: 11.5, color: 'var(--fg-2)' }}>
                  Sandbox check passed · path within project root · no secrets in diff
                </span>
                <div style={{ flex: 1 }}/>
                <TBtn size="sm" onClick={reject}><ICX.x size={12}/> Reject</TBtn>
                <TBtn size="sm" primary onClick={approve} disabled={approving === 'done' || current.status === 'done'}>
                  {current.status === 'done' ? <><ICX.check size={12}/> Approved</> : approving ? <><span className="spin">◐</span> Applying…</> : <><ICX.check size={12}/> Approve & apply</>}
                </TBtn>
              </div>
            </div>
          )}

          {/* Live thinking trace */}
          <div style={{
            background: 'var(--surf-1)', border: '0.5px solid var(--border-1)',
            borderRadius: 12, padding: 16,
          }}>
            <CardHead kicker="LLM trace" title="Reasoning · turn 5"/>
            <div style={{
              fontSize: 12, lineHeight: 1.7, color: 'var(--fg-2)',
              padding: 12, borderRadius: 6,
              background: 'rgba(0,0,0,0.2)',
              border: '0.5px solid var(--border-1)',
              fontFamily: 'var(--ui)',
            }}>
              <div style={{ color: 'var(--fg-3)', fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.1em', marginBottom: 8 }}>
                ASSISTANT — gemma-3-12b:free
              </div>
              I read <code style={{ fontFamily: 'var(--mono)', color: 'oklch(0.85 0.10 240)' }}>app/llm/openrouter.py</code>. The current implementation streams tokens but doesn't include the OpenRouter <code style={{ fontFamily: 'var(--mono)', color: 'oklch(0.85 0.10 240)' }}>HTTP-Referer</code> and <code style={{ fontFamily: 'var(--mono)', color: 'oklch(0.85 0.10 240)' }}>X-Title</code> headers — these are recommended for app analytics. I'll also enable <code style={{ fontFamily: 'var(--mono)', color: 'oklch(0.85 0.10 240)' }}>usage.include</code> in the payload to capture token counts for the Brain dashboard.
              <div style={{ marginTop: 10, color: 'var(--fg-3)', fontStyle: 'italic' }}>
                → calling <code style={{ fontFamily: 'var(--mono)', color: 'oklch(0.78 0.16 75)' }}>write_file</code> · awaiting approval (moderate risk)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ToolStep({ step, active, last, onClick }) {
  return (
    <div onClick={onClick} style={{
      display: 'grid', gridTemplateColumns: '24px 1fr auto', gap: 10,
      padding: '8px 6px', cursor: 'pointer', borderRadius: 6,
      background: active ? 'rgba(255,255,255,0.04)' : 'transparent',
      position: 'relative', alignItems: 'center',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
        <SeverityDot level={step.danger} size={10}/>
        {!last && <div style={{ flex: 1, width: 1, background: 'var(--border-1)', minHeight: 20, marginTop: 4 }}/>}
      </div>
      <div style={{ minWidth: 0, paddingBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--fg-1)', fontWeight: 500 }}>{step.tool}</span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--fg-3)' }}>· {step.iter}</span>
        </div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10.5, color: 'var(--fg-3)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {step.args}
        </div>
      </div>
      <div style={{ paddingBottom: 12, fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--fg-3)', textAlign: 'right' }}>
        {step.status === 'done' ? <span style={{ color: 'oklch(0.78 0.16 152)' }}>✓ {step.dur}ms</span>
        : step.status === 'pending' ? <span style={{ color: 'oklch(0.78 0.16 75)' }}>● wait</span>
        : <span style={{ color: 'oklch(0.70 0.20 28)' }}>✗</span>}
      </div>
    </div>
  );
}

function Meta({ label, value }) {
  return (
    <div>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 9.5, letterSpacing: '0.14em', color: 'var(--fg-3)', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 12.5, color: 'var(--fg-1)', fontFamily: 'var(--mono)' }}>{value}</div>
    </div>
  );
}

function dangerColor(d) {
  return d === 'safe' ? 'oklch(0.75 0.16 152)'
       : d === 'moderate' ? 'oklch(0.78 0.16 75)'
       : d === 'dangerous' ? 'oklch(0.70 0.20 28)'
       : 'var(--fg-3)';
}

window.AgentView = AgentView;
