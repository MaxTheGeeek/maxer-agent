import React from 'react';
import { ICX } from './icons';
import { useApp, LiveBrain, MatchMeter, StackBadge, DistancePill, Tooltip, SeverityDot, Card, CardHead, TBtn } from './shell';
// view-multi.jsx — Voice Orb + Vision drop-zone

export function MultiView() {
  const [recording, setRecording] = React.useState(false);
  const [dragging, setDragging] = React.useState(false);

  return (
    <div style={{ padding: '20px 24px 32px' }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em', color: 'var(--accent-1)', marginBottom: 4 }}>
          05 · MULTIMODAL
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-0.01em', margin: 0 }}>Voice & vision</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {/* Voice Orb */}
        <Card padding={28} style={{ minHeight: 360 }}>
          <CardHead kicker="Voice · faster-whisper" title="Hold to dictate"
                    right={<span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--fg-3)' }}>STT · large-v3</span>}/>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px 0' }}>
            <div onMouseDown={() => setRecording(true)} onMouseUp={() => setRecording(false)} onMouseLeave={() => setRecording(false)}
                 style={{ position: 'relative', width: 130, height: 130, cursor: 'pointer' }}>
              {recording && (
                <>
                  <div className="brain-pulse" style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1px solid oklch(0.65 0.18 28 / 0.5)' }}/>
                  <div className="brain-pulse brain-pulse-2" style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1px solid oklch(0.65 0.18 28 / 0.5)' }}/>
                </>
              )}
              <div style={{
                position: 'absolute', inset: -10, borderRadius: '50%',
                background: `radial-gradient(circle, ${recording ? 'oklch(0.65 0.20 28 / 0.5)' : 'oklch(0.65 0.18 240 / 0.4)'} 0%, transparent 65%)`,
                filter: 'blur(8px)',
              }}/>
              <div style={{
                position: 'absolute', inset: '14%', borderRadius: '50%',
                background: recording
                  ? 'radial-gradient(circle at 35% 30%, oklch(0.78 0.20 28), oklch(0.40 0.18 28))'
                  : 'radial-gradient(circle at 35% 30%, oklch(0.78 0.18 240), oklch(0.40 0.16 240))',
                boxShadow: recording ? '0 0 40px oklch(0.65 0.20 28 / 0.6)' : '0 0 30px oklch(0.55 0.16 240 / 0.5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white',
              }}>
                <ICX.mic size={36}/>
              </div>
            </div>
            <div style={{ marginTop: 18, textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 10.5, letterSpacing: '0.14em', color: recording ? 'oklch(0.78 0.20 28)' : 'var(--fg-3)' }}>
                {recording ? '● RECORDING · 1.4s' : 'PRESS & HOLD · OR ⌘⇧V'}
              </div>
              <div style={{ marginTop: 8, fontSize: 11, color: 'var(--fg-3)', fontFamily: 'var(--mono)' }}>
                local · 0 bytes leave the device
              </div>
            </div>

            {/* Waveform */}
            <div style={{ marginTop: 22, display: 'flex', gap: 3, alignItems: 'center', height: 28 }}>
              {Array.from({ length: 40 }).map((_, i) => {
                const h = recording ? 6 + Math.sin((Date.now() / 100) + i * 0.4) * 8 + Math.random() * 16 : 4;
                return <div key={i} style={{
                  width: 3, height: Math.max(2, h), borderRadius: 1,
                  background: recording ? 'oklch(0.78 0.20 28)' : 'rgba(255,255,255,0.1)',
                  transition: 'height .08s',
                }}/>;
              })}
            </div>
          </div>
        </Card>

        {/* Vision drop-zone */}
        <Card padding={0} style={{ minHeight: 360, overflow: 'hidden' }}>
          <div style={{ padding: 18 }}>
            <CardHead kicker="Vision · multimodal" title="Drop PDF, image, or DOCX"
                      right={<span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--fg-3)' }}>routed to · sonnet-4</span>}/>
          </div>
          <div onDragEnter={() => setDragging(true)} onDragLeave={() => setDragging(false)}
               onDragOver={(e) => e.preventDefault()}
               style={{
                 margin: '0 18px 18px', flex: 1, minHeight: 240,
                 border: `1.5px dashed ${dragging ? 'oklch(0.65 0.18 240)' : 'var(--border-2)'}`,
                 background: dragging ? 'oklch(0.45 0.14 240 / 0.08)' : 'rgba(255,255,255,0.015)',
                 borderRadius: 10,
                 display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                 padding: 32, transition: 'all .15s',
               }}>
            <div style={{
              width: 56, height: 56, borderRadius: 14,
              background: 'rgba(255,255,255,0.04)', border: '0.5px solid var(--border-1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: dragging ? 'oklch(0.78 0.16 240)' : 'var(--fg-2)',
              marginBottom: 14,
            }}>
              <ICX.eye size={26}/>
            </div>
            <div style={{ fontSize: 13, color: 'var(--fg-1)', fontWeight: 500, marginBottom: 4 }}>
              {dragging ? 'Release to scan' : 'Drop a job ad PDF or screenshot'}
            </div>
            <div style={{ fontSize: 11, color: 'var(--fg-3)', textAlign: 'center', maxWidth: 280, lineHeight: 1.5 }}>
              The brain extracts company, role, requirements, and stack — and runs them through the match engine.
            </div>
            <div style={{ marginTop: 16, display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
              {['.pdf', '.png', '.jpg', '.docx', '.txt'].map(ext => (
                <span key={ext} style={{
                  fontFamily: 'var(--mono)', fontSize: 10, padding: '3px 7px', borderRadius: 4,
                  background: 'rgba(255,255,255,0.04)', color: 'var(--fg-3)',
                }}>{ext}</span>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        <RecentItem icon={<ICX.eye size={14}/>} title="vector-labs-jd.pdf" sub="extracted 4m ago · score 94" tag="MATCH"/>
        <RecentItem icon={<ICX.mic size={14}/>} title="Voice memo · 12s" sub="“follow up with meridian”" tag="NOTE"/>
        <RecentItem icon={<ICX.eye size={14}/>} title="screenshot.png" sub="recruiter linkedin DM" tag="PARSED"/>
      </div>
    </div>
  );
}

export function RecentItem({ icon, title, sub, tag }) {
  return (
    <div style={{
      padding: '12px 14px', background: 'var(--surf-1)', border: '0.5px solid var(--border-1)',
      borderRadius: 10, display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--fg-2)' }}>{icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, color: 'var(--fg-1)', fontFamily: 'var(--mono)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</div>
        <div style={{ fontSize: 10.5, color: 'var(--fg-3)', marginTop: 2 }}>{sub}</div>
      </div>
      <span style={{
        fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.14em',
        padding: '3px 7px', borderRadius: 3,
        background: 'oklch(0.45 0.14 240 / 0.18)', color: 'oklch(0.85 0.12 240)',
        border: '0.5px solid oklch(0.55 0.14 240 / 0.4)',
      }}>{tag}</span>
    </div>
  );
}

