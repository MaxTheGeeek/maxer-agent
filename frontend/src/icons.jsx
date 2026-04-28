import React from 'react';
// icons.jsx — inline SVG icon set. Stroke 1.5, currentColor.

const Icon = ({ d, size = 16, fill = false, sw = 1.5, children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
       style={{ flexShrink: 0 }}>
    {d ? <path d={d} fill={fill ? 'currentColor' : 'none'} /> : children}
  </svg>
);

export const ICX = {
  hunt:    (p) => <Icon {...p}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/><circle cx="11" cy="11" r="2.5" fill="currentColor"/></Icon>,
  agent:   (p) => <Icon {...p}><path d="M4 4h16v12H4z"/><path d="M9 20h6"/><path d="M12 16v4"/><path d="m8 9 2 2-2 2"/><path d="M13 13h3"/></Icon>,
  brain:   (p) => <Icon {...p}><path d="M12 4a4 4 0 0 0-4 4 3 3 0 0 0-2 5.5A3 3 0 0 0 8 18a4 4 0 0 0 8 0 3 3 0 0 0 2-4.5A3 3 0 0 0 16 8a4 4 0 0 0-4-4Z"/><path d="M12 8v12"/><path d="M9 11h6"/></Icon>,
  vault:   (p) => <Icon {...p}><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18"/><path d="M9 14h2"/></Icon>,
  multi:   (p) => <Icon {...p}><circle cx="12" cy="12" r="3"/><path d="M12 4v2"/><path d="M12 18v2"/><path d="m4.9 4.9 1.4 1.4"/><path d="m17.7 17.7 1.4 1.4"/><path d="M4 12h2"/><path d="M18 12h2"/><path d="m4.9 19.1 1.4-1.4"/><path d="m17.7 6.3 1.4-1.4"/></Icon>,
  settings:(p) => <Icon {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></Icon>,
  pin:     (p) => <Icon {...p}><path d="m12 2 3 6 6 1-4.5 4 1 6-5.5-3-5.5 3 1-6L3 9l6-1z"/></Icon>,
  loc:     (p) => <Icon {...p}><path d="M12 21s7-7.5 7-12a7 7 0 0 0-14 0c0 4.5 7 12 7 12Z"/><circle cx="12" cy="9" r="2.5"/></Icon>,
  euro:    (p) => <Icon {...p}><path d="M18 6a8 8 0 1 0 0 12"/><path d="M3 10h10"/><path d="M3 14h10"/></Icon>,
  clock:   (p) => <Icon {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></Icon>,
  info:    (p) => <Icon {...p}><circle cx="12" cy="12" r="9"/><path d="M12 8h.01"/><path d="M11 12h1v4h1"/></Icon>,
  doc:     (p) => <Icon {...p}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6"/><path d="M9 17h6"/></Icon>,
  shield:  (p) => <Icon {...p}><path d="M12 3 5 6v6c0 4.5 3 8.5 7 9 4-.5 7-4.5 7-9V6z"/><path d="m9 12 2 2 4-4"/></Icon>,
  cert:    (p) => <Icon {...p}><circle cx="12" cy="9" r="5"/><path d="m9 13-2 7 5-3 5 3-2-7"/></Icon>,
  send:    (p) => <Icon {...p}><path d="m22 2-9 19-2.5-7L3 11z"/><path d="m22 2-12 12"/></Icon>,
  play:    (p) => <Icon {...p} fill><path d="m6 4 14 8L6 20z" fill="currentColor"/></Icon>,
  pause:   (p) => <Icon {...p}><rect x="6" y="5" width="4" height="14" fill="currentColor"/><rect x="14" y="5" width="4" height="14" fill="currentColor"/></Icon>,
  check:   (p) => <Icon {...p}><path d="m4 12 5 5L20 6"/></Icon>,
  x:       (p) => <Icon {...p}><path d="M5 5l14 14M19 5l-14 14"/></Icon>,
  warn:    (p) => <Icon {...p}><path d="M12 3 2 21h20z"/><path d="M12 10v4"/><path d="M12 17h.01"/></Icon>,
  flow:    (p) => <Icon {...p}><circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M6 8.5v7"/><path d="M8.5 6h7"/><path d="m8.5 18 7-7"/></Icon>,
  mic:     (p) => <Icon {...p}><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0"/><path d="M12 18v3"/></Icon>,
  eye:     (p) => <Icon {...p}><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></Icon>,
  upload:  (p) => <Icon {...p}><path d="M12 16V4"/><path d="m6 10 6-6 6 6"/><path d="M4 20h16"/></Icon>,
  download:(p) => <Icon {...p}><path d="M12 4v12"/><path d="m6 10 6 6 6-6"/><path d="M4 20h16"/></Icon>,
  cpu:     (p) => <Icon {...p}><rect x="6" y="6" width="12" height="12" rx="1"/><rect x="9" y="9" width="6" height="6"/><path d="M3 9h2M3 15h2M19 9h2M19 15h2M9 3v2M15 3v2M9 19v2M15 19v2"/></Icon>,
  cloud:   (p) => <Icon {...p}><path d="M7 18a5 5 0 0 1 .9-9.9 6 6 0 0 1 11.6 2A4.5 4.5 0 0 1 19 18z"/></Icon>,
  zap:     (p) => <Icon {...p}><path d="M13 2 4 14h7l-1 8 9-12h-7z" fill="currentColor"/></Icon>,
  filter:  (p) => <Icon {...p}><path d="M3 5h18l-7 9v6l-4-2v-4z"/></Icon>,
  more:    (p) => <Icon {...p}><circle cx="5" cy="12" r="1.2" fill="currentColor"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/><circle cx="19" cy="12" r="1.2" fill="currentColor"/></Icon>,
  refresh: (p) => <Icon {...p}><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 4v4h-4"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 20v-4h4"/></Icon>,
  arrowR:  (p) => <Icon {...p}><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></Icon>,
  chev:    (p) => <Icon {...p}><path d="m6 9 6 6 6-6"/></Icon>,
  link:    (p) => <Icon {...p}><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 1 0 5.7 5.7l1-1"/></Icon>,
  plug:    (p) => <Icon {...p}><path d="M9 4v6"/><path d="M15 4v6"/><path d="M7 10h10v4a5 5 0 0 1-5 5 5 5 0 0 1-5-5z"/><path d="M12 19v3"/></Icon>,
  bolt:    (p) => <Icon {...p}><path d="M13 2 4 14h7l-1 8 9-12h-7z"/></Icon>,
  edit:    (p) => <Icon {...p}><path d="M4 20h4l11-11-4-4L4 16z"/><path d="m14 5 4 4"/></Icon>,
  copy:    (p) => <Icon {...p}><rect x="8" y="8" width="13" height="13" rx="2"/><path d="M4 16V5a2 2 0 0 1 2-2h11"/></Icon>,
  trash:   (p) => <Icon {...p}><path d="M3 6h18"/><path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2"/><path d="M5 6v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6"/><path d="M10 11v6M14 11v6"/></Icon>,
};

window.ICX = ICX;
