// view-vault.jsx — Resource Vault + DB console

function VaultView() {
  const { resumes, dbLog } = useApp();
  const [tab, setTab] = React.useState('resources');

  return (
    <div style={{ padding: '20px 24px 32px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 18 }}>
        <div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em', color: 'var(--accent-1)', marginBottom: 4 }}>
            04 · INTELLIGENCE LAB
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-0.01em', margin: 0 }}>Resource vault</h1>
        </div>
        <div style={{ display: 'flex', gap: 6, padding: 3, borderRadius: 7, background: 'rgba(255,255,255,0.04)', border: '0.5px solid var(--border-1)' }}>
          {['resources', 'database'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '6px 14px', borderRadius: 5,
              background: tab === t ? 'oklch(0.45 0.14 240 / 0.4)' : 'transparent',
              color: tab === t ? 'oklch(0.92 0.06 240)' : 'var(--fg-2)',
              border: 0, cursor: 'pointer', fontSize: 11.5, fontFamily: 'var(--ui)', fontWeight: 500,
              textTransform: 'capitalize',
            }}>{t === 'database' ? 'DB Console' : 'Resumes & Certs'}</button>
          ))}
        </div>
      </div>

      {tab === 'resources' ? (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 22 }}>
            {resumes.filter(r => r.kind === 'resume').map(r => <ResumeCard key={r.name} r={r}/>)}
          </div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.16em', color: 'var(--fg-3)', marginBottom: 10 }}>
            CERTIFICATES
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {resumes.filter(r => r.kind === 'cert').map(r => <ResumeCard key={r.name} r={r}/>)}
            <div style={{
              border: '1px dashed var(--border-2)', borderRadius: 10, padding: 18,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: 8, color: 'var(--fg-3)', cursor: 'pointer', minHeight: 120,
            }}>
              <ICX.upload size={22}/>
              <div style={{ fontSize: 11.5 }}>Drop a PDF or click to add</div>
            </div>
          </div>
        </>
      ) : (
        <DBConsole rows={dbLog}/>
      )}
    </div>
  );
}

function ResumeCard({ r }) {
  const isCert = r.kind === 'cert';
  return (
    <div style={{
      padding: 16, background: 'var(--surf-1)', border: '0.5px solid var(--border-1)',
      borderRadius: 10, position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, height: 2, width: '100%',
        background: isCert ? 'oklch(0.65 0.18 75)' : `oklch(0.65 0.16 ${r.tag.includes('TS') ? 240 : r.tag.includes('.NET') ? 290 : 200})`,
      }}/>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
        <div style={{
          width: 36, height: 44, borderRadius: 4,
          background: 'rgba(255,255,255,0.04)', border: '0.5px solid var(--border-1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--fg-2)', flexShrink: 0,
        }}>{isCert ? <ICX.cert size={18}/> : <ICX.doc size={18}/>}</div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 11.5, fontWeight: 600, color: 'var(--fg-1)', lineHeight: 1.3 }}>
            {r.name}
          </div>
          <div style={{ fontSize: 10.5, color: 'var(--fg-3)', marginTop: 3 }}>{r.tag}</div>
        </div>
      </div>
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8,
        paddingTop: 10, borderTop: '0.5px solid var(--border-1)',
      }}>
        <Mini label="Size" value={r.size}/>
        <Mini label="Updated" value={r.updated}/>
        <Mini label={isCert ? 'Cited' : 'Used'} value={`${r.uses}×`}/>
      </div>
    </div>
  );
}

function Mini({ label, value }) {
  return (
    <div>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.12em', color: 'var(--fg-3)', textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--fg-2)', marginTop: 2 }}>{value}</div>
    </div>
  );
}

function DBConsole({ rows }) {
  return (
    <div style={{
      background: 'var(--surf-1)', border: '0.5px solid var(--border-1)',
      borderRadius: 12, overflow: 'hidden',
    }}>
      <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '0.5px solid var(--border-1)' }}>
        <ICX.cpu size={14}/>
        <code style={{ fontFamily: 'var(--mono)', fontSize: 11.5, color: 'var(--fg-1)' }}>
          maxer.applications · 9 of 1,284 rows
        </code>
        <div style={{ flex: 1 }}/>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 10.5, color: 'oklch(0.78 0.16 152)' }}>● connected · 127.0.0.1:5432</span>
      </div>
      <div style={{ overflowX: 'auto', fontFamily: 'var(--mono)', fontSize: 11.5 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
              <Th>id</Th><Th>company</Th><Th>role</Th><Th>resume</Th><Th>method</Th><Th>applied_at</Th><Th>status</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row.id} style={{ borderTop: '0.5px solid var(--border-1)' }}>
                <Td muted>#{row.id}</Td>
                <Td bold>{row.company}</Td>
                <Td>{row.role}</Td>
                <Td muted>{row.resume}</Td>
                <Td>
                  <span style={{
                    padding: '2px 6px', borderRadius: 3, fontSize: 10,
                    background: row.method === 'SMTP' ? 'oklch(0.45 0.14 200 / 0.2)' : 'oklch(0.45 0.14 290 / 0.2)',
                    color: row.method === 'SMTP' ? 'oklch(0.85 0.12 200)' : 'oklch(0.85 0.12 290)',
                    border: `0.5px solid ${row.method === 'SMTP' ? 'oklch(0.65 0.14 200)' : 'oklch(0.65 0.14 290)'}`,
                  }}>{row.method}</span>
                </Td>
                <Td muted>{row.at}</Td>
                <Td>
                  <span style={{
                    color: row.status === 'sent' ? 'oklch(0.78 0.16 152)'
                         : row.status === 'pending' ? 'oklch(0.78 0.16 75)'
                         : 'oklch(0.70 0.20 28)',
                  }}>● {row.status}</span>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const Th = ({ children }) => (
  <th style={{
    padding: '10px 12px', textAlign: 'left',
    fontSize: 9.5, letterSpacing: '0.14em', textTransform: 'uppercase',
    color: 'var(--fg-3)', fontWeight: 600,
  }}>{children}</th>
);
const Td = ({ children, muted, bold }) => (
  <td style={{
    padding: '9px 12px', color: muted ? 'var(--fg-3)' : 'var(--fg-1)',
    fontWeight: bold ? 600 : 400, whiteSpace: 'nowrap',
  }}>{children}</td>
);

window.VaultView = VaultView;
