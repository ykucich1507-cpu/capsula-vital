'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

type Note = { title: string; content: string }
type NoteMap = Record<string, string>

const LS_EDITS = 'yanitrend-vault-edits'
const LS_CUSTOM = 'yanitrend-vault-custom'

/* ---------- Markdown ---------- */

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function wikilink(target: string, alias: string, titles: Set<string>): string {
  const dead = !titles.has(target)
  return `<a class="wl${dead ? ' dead' : ''}" data-wl="${escapeHtml(target)}">${escapeHtml(alias)}</a>`
}

function inlineMd(raw: string, titles: Set<string>): string {
  let out = escapeHtml(raw)
  out = out.replace(/`([^`]+)`/g, '<code>$1</code>')
  out = out.replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, (_m, t, a) => wikilink(t.trim(), a.trim(), titles))
  out = out.replace(/\[\[([^\]]+)\]\]/g, (_m, t) => wikilink(t.trim(), t.trim(), titles))
  out = out.replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)|(https?:\/\/[^\s<]+)/g, (_m, txt, url, bare) =>
    bare
      ? `<a class="ext" href="${bare}" target="_blank" rel="noopener">${bare}</a>`
      : `<a class="ext" href="${url}" target="_blank" rel="noopener">${txt}</a>`
  )
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  out = out.replace(/\*([^*]+)\*/g, '<em>$1</em>')
  out = out.replace(/~~([^~]+)~~/g, '<del>$1</del>')
  out = out.replace(/==([^=]+)==/g, '<mark>$1</mark>')
  return out
}

function mdToHtml(md: string, titles: Set<string>): string {
  const lines = md.split('\n')
  const html: string[] = []
  let i = 0
  const listItem = (txt: string): string => {
    const cb = txt.match(/^\[( |x)\]\s+(.*)/)
    if (cb) return `<li class="task"><span class="cb">${cb[1] === 'x' ? '☑' : '☐'}</span> ${inlineMd(cb[2], titles)}</li>`
    return `<li>${inlineMd(txt, titles)}</li>`
  }
  while (i < lines.length) {
    const line = lines[i]
    if (line.startsWith('```')) {
      const buf: string[] = []
      i++
      while (i < lines.length && !lines[i].startsWith('```')) { buf.push(lines[i]); i++ }
      i++
      html.push(`<pre><code>${escapeHtml(buf.join('\n'))}</code></pre>`)
      continue
    }
    const h = line.match(/^(#{1,6})\s+(.*)/)
    if (h) {
      const lvl = h[1].length
      html.push(`<h${lvl}>${inlineMd(h[2], titles)}</h${lvl}>`)
      i++
      continue
    }
    if (/^(-{3,}|\*{3,})\s*$/.test(line.trim())) { html.push('<hr/>'); i++; continue }
    if (line.trim().startsWith('|')) {
      const rows: string[] = []
      while (i < lines.length && lines[i].trim().startsWith('|')) { rows.push(lines[i].trim()); i++ }
      const cells = (r: string) => r.replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim())
      const header = cells(rows[0])
      const body = rows.slice(1).filter((r) => !/^[\s:|-]+$/.test(r)).map(cells)
      html.push(
        '<div class="tbl"><table><thead><tr>' +
          header.map((c) => `<th>${inlineMd(c, titles)}</th>`).join('') +
          '</tr></thead><tbody>' +
          body.map((r) => '<tr>' + r.map((c) => `<td>${inlineMd(c, titles)}</td>`).join('') + '</tr>').join('') +
          '</tbody></table></div>'
      )
      continue
    }
    if (line.startsWith('>')) {
      const buf: string[] = []
      while (i < lines.length && lines[i].startsWith('>')) { buf.push(lines[i].replace(/^>\s?/, '')); i++ }
      const co = buf[0].match(/^\[!(\w+)\]\s*(.*)/)
      if (co) {
        const type = co[1].toLowerCase()
        const icon = type === 'warning' ? '⚠️' : type === 'tip' ? '💡' : type === 'note' ? '📝' : '📌'
        const body = buf.slice(1).filter((l) => l.trim() !== '').map((l) => inlineMd(l, titles)).join('<br/>')
        html.push(
          `<div class="callout callout-${type}"><div class="callout-title">${icon} ${inlineMd(co[2] || type, titles)}</div>` +
            (body ? `<div class="callout-body">${body}</div>` : '') +
            '</div>'
        )
      } else {
        html.push(`<blockquote>${buf.map((l) => inlineMd(l, titles)).join('<br/>')}</blockquote>`)
      }
      continue
    }
    const lm = line.match(/^\s*([-*]|\d+\.)\s+(.*)/)
    if (lm) {
      const ordered = /^\d/.test(lm[1])
      const items: string[] = []
      while (i < lines.length) {
        const m = lines[i].match(/^\s*([-*]|\d+\.)\s+(.*)/)
        if (!m) break
        items.push(listItem(m[2]))
        i++
      }
      html.push(`<${ordered ? 'ol' : 'ul'}>${items.join('')}</${ordered ? 'ol' : 'ul'}>`)
      continue
    }
    if (line.trim() === '') { i++; continue }
    const buf: string[] = [line]
    i++
    while (i < lines.length && lines[i].trim() !== '' && !/^(#{1,6}\s|>|\||```|\s*([-*]|\d+\.)\s)/.test(lines[i])) {
      buf.push(lines[i])
      i++
    }
    html.push(`<p>${buf.map((l) => inlineMd(l, titles)).join('<br/>')}</p>`)
  }
  return html.join('\n')
}

/* ---------- Wikilink extraction / graph ---------- */

function extractLinks(content: string): string[] {
  const out: string[] = []
  const re = /\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g
  let m
  while ((m = re.exec(content))) out.push(m[1].trim())
  return out
}

function layoutGraph(n: number, edges: [number, number][], w: number, h: number) {
  let seed = 1234
  const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647 }
  const pos = Array.from({ length: n }, () => ({
    x: w / 2 + (rnd() - 0.5) * w * 0.7,
    y: h / 2 + (rnd() - 0.5) * h * 0.7,
  }))
  for (let it = 0; it < 300; it++) {
    const fx = new Array(n).fill(0)
    const fy = new Array(n).fill(0)
    for (let a = 0; a < n; a++) {
      for (let b = a + 1; b < n; b++) {
        const dx = pos[a].x - pos[b].x
        const dy = pos[a].y - pos[b].y
        const d2 = Math.max(dx * dx + dy * dy, 64)
        const f = 12000 / d2
        const d = Math.sqrt(d2)
        fx[a] += (dx / d) * f; fy[a] += (dy / d) * f
        fx[b] -= (dx / d) * f; fy[b] -= (dy / d) * f
      }
    }
    for (const [a, b] of edges) {
      const dx = pos[b].x - pos[a].x
      const dy = pos[b].y - pos[a].y
      const d = Math.max(Math.sqrt(dx * dx + dy * dy), 1)
      const f = 0.02 * (d - 140)
      fx[a] += (dx / d) * f; fy[a] += (dy / d) * f
      fx[b] -= (dx / d) * f; fy[b] -= (dy / d) * f
    }
    for (let a = 0; a < n; a++) {
      fx[a] += (w / 2 - pos[a].x) * 0.005
      fy[a] += (h / 2 - pos[a].y) * 0.005
      pos[a].x = Math.min(w - 60, Math.max(60, pos[a].x + fx[a] * 0.5))
      pos[a].y = Math.min(h - 40, Math.max(40, pos[a].y + fy[a] * 0.5))
    }
  }
  return pos
}

/* ---------- Component ---------- */

export default function NotasApp({ baseNotes }: { baseNotes: Note[] }) {
  const [edits, setEdits] = useState<NoteMap>({})
  const [custom, setCustom] = useState<NoteMap>({})
  const [loaded, setLoaded] = useState(false)
  const [active, setActive] = useState('Inicio')
  const [view, setView] = useState<'note' | 'graph'>('note')
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const articleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    try {
      setEdits(JSON.parse(localStorage.getItem(LS_EDITS) || '{}'))
      setCustom(JSON.parse(localStorage.getItem(LS_CUSTOM) || '{}'))
    } catch {}
    setLoaded(true)
    if (typeof window !== 'undefined' && window.innerWidth < 800) setSidebarOpen(false)
  }, [])

  useEffect(() => {
    if (loaded) localStorage.setItem(LS_EDITS, JSON.stringify(edits))
  }, [edits, loaded])
  useEffect(() => {
    if (loaded) localStorage.setItem(LS_CUSTOM, JSON.stringify(custom))
  }, [custom, loaded])

  const notes = useMemo<Note[]>(() => {
    const map = new Map<string, string>()
    for (const n of baseNotes) map.set(n.title, edits[n.title] ?? n.content)
    for (const [t, c] of Object.entries(custom)) if (!map.has(t)) map.set(t, c)
    return Array.from(map.entries()).map(([title, content]) => ({ title, content }))
  }, [baseNotes, edits, custom])

  const titles = useMemo(() => new Set(notes.map((n) => n.title)), [notes])
  const baseTitles = useMemo(() => new Set(baseNotes.map((n) => n.title)), [baseNotes])

  const activeNote = notes.find((n) => n.title === active) || notes[0]

  const backlinks = useMemo(
    () =>
      notes.filter(
        (n) =>
          n.title !== activeNote?.title &&
          (n.content.includes(`[[${activeNote?.title}]]`) || n.content.includes(`[[${activeNote?.title}|`))
      ),
    [notes, activeNote]
  )

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return notes
    return notes.filter((n) => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q))
  }, [notes, search])

  const graph = useMemo(() => {
    const idx = new Map(notes.map((n, i) => [n.title, i]))
    const edges: [number, number][] = []
    const seen = new Set<string>()
    for (const n of notes) {
      for (const t of extractLinks(n.content)) {
        const j = idx.get(t)
        const a = idx.get(n.title)!
        if (j !== undefined && j !== a) {
          const key = a < j ? `${a}-${j}` : `${j}-${a}`
          if (!seen.has(key)) { seen.add(key); edges.push([a, j]) }
        }
      }
    }
    const degree = new Array(notes.length).fill(0)
    for (const [a, b] of edges) { degree[a]++; degree[b]++ }
    const pos = layoutGraph(notes.length, edges, 900, 620)
    return { edges, degree, pos }
  }, [notes])

  const rendered = useMemo(
    () => (activeNote ? mdToHtml(activeNote.content, titles) : ''),
    [activeNote, titles]
  )

  function openNote(title: string) {
    setEditing(false)
    setView('note')
    setActive(title)
    if (typeof window !== 'undefined' && window.innerWidth < 800) setSidebarOpen(false)
  }

  function handleArticleClick(e: React.MouseEvent) {
    const el = (e.target as HTMLElement).closest('a[data-wl]') as HTMLElement | null
    if (!el) return
    e.preventDefault()
    const target = el.getAttribute('data-wl')!
    if (titles.has(target)) {
      openNote(target)
    } else if (confirm(`La nota "${target}" no existe. ¿La creo?`)) {
      setCustom((c) => ({ ...c, [target]: `# ${target}\n\n` }))
      openNote(target)
    }
  }

  function startEdit() {
    setDraft(activeNote?.content || '')
    setEditing(true)
  }

  function saveEdit() {
    if (!activeNote) return
    if (baseTitles.has(activeNote.title)) setEdits((m) => ({ ...m, [activeNote.title]: draft }))
    else setCustom((m) => ({ ...m, [activeNote.title]: draft }))
    setEditing(false)
  }

  function restoreOriginal() {
    if (!activeNote) return
    setEdits((m) => {
      const { [activeNote.title]: _drop, ...rest } = m
      return rest
    })
    setEditing(false)
  }

  function newNote() {
    const name = prompt('Nombre de la nueva nota:')
    if (!name) return
    const t = name.trim()
    if (!t) return
    if (titles.has(t)) { openNote(t); return }
    setCustom((c) => ({ ...c, [t]: `# ${t}\n\n` }))
    setActive(t)
    setView('note')
    setDraft(`# ${t}\n\n`)
    setEditing(true)
  }

  function deleteNote() {
    if (!activeNote || baseTitles.has(activeNote.title)) return
    if (!confirm(`¿Eliminar la nota "${activeNote.title}"?`)) return
    setCustom((m) => {
      const { [activeNote.title]: _drop, ...rest } = m
      return rest
    })
    setActive('Inicio')
  }

  const isEdited = activeNote && baseTitles.has(activeNote.title) && edits[activeNote.title] !== undefined
  const isCustom = activeNote && !baseTitles.has(activeNote.title)

  return (
    <div className="ob-root">
      <style>{CSS}</style>

      {sidebarOpen && (
        <aside className="ob-side">
          <div className="ob-side-head">
            <span className="ob-logo">🗂️ Vault Yani Trend</span>
          </div>
          <input
            className="ob-search"
            placeholder="Buscar notas…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="ob-actions">
            <button className={`ob-btn ${view === 'graph' ? 'on' : ''}`} onClick={() => setView(view === 'graph' ? 'note' : 'graph')}>
              🕸️ Grafo
            </button>
            <button className="ob-btn" onClick={newNote}>＋ Nueva nota</button>
          </div>
          <nav className="ob-list">
            {filtered.map((n) => (
              <button
                key={n.title}
                className={`ob-item ${view === 'note' && n.title === activeNote?.title ? 'active' : ''}`}
                onClick={() => openNote(n.title)}
              >
                <span className="ob-item-title">{n.title}</span>
                {!baseTitles.has(n.title) && <span className="ob-tag">local</span>}
                {baseTitles.has(n.title) && edits[n.title] !== undefined && <span className="ob-dot" title="Editada localmente" />}
              </button>
            ))}
            {filtered.length === 0 && <div className="ob-empty">Sin resultados</div>}
          </nav>
          <div className="ob-side-foot">{notes.length} notas · Markdown local</div>
        </aside>
      )}

      <main className="ob-main">
        <header className="ob-top">
          <button className="ob-btn ob-burger" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
          <span className="ob-crumb">{view === 'graph' ? 'Vista de grafo' : activeNote?.title}</span>
          <span className="ob-spacer" />
          {view === 'note' && !editing && (
            <>
              {isCustom && <button className="ob-btn danger" onClick={deleteNote}>🗑️</button>}
              <button className="ob-btn" onClick={startEdit}>✏️ Editar</button>
            </>
          )}
          {view === 'note' && editing && (
            <>
              {isEdited && <button className="ob-btn" onClick={restoreOriginal}>↩️ Original</button>}
              <button className="ob-btn" onClick={() => setEditing(false)}>Cancelar</button>
              <button className="ob-btn primary" onClick={saveEdit}>💾 Guardar</button>
            </>
          )}
        </header>

        {view === 'graph' ? (
          <div className="ob-graph">
            <svg viewBox="0 0 900 620" preserveAspectRatio="xMidYMid meet">
              {graph.edges.map(([a, b], k) => (
                <line
                  key={k}
                  x1={graph.pos[a].x} y1={graph.pos[a].y}
                  x2={graph.pos[b].x} y2={graph.pos[b].y}
                  className="ob-edge"
                />
              ))}
              {notes.map((n, k) => (
                <g key={n.title} className="ob-node" onClick={() => openNote(n.title)}>
                  <circle
                    cx={graph.pos[k].x} cy={graph.pos[k].y}
                    r={6 + Math.min(graph.degree[k] * 1.6, 14)}
                    className={n.title === activeNote?.title ? 'sel' : ''}
                  />
                  <text x={graph.pos[k].x} y={graph.pos[k].y + 6 + Math.min(graph.degree[k] * 1.6, 14) + 14} textAnchor="middle">
                    {n.title.length > 28 ? n.title.slice(0, 26) + '…' : n.title}
                  </text>
                </g>
              ))}
            </svg>
            <div className="ob-graph-hint">Hacé clic en un nodo para abrir la nota. El tamaño refleja cuántas conexiones tiene.</div>
          </div>
        ) : editing ? (
          <textarea className="ob-editor" value={draft} onChange={(e) => setDraft(e.target.value)} spellCheck={false} />
        ) : (
          <div className="ob-scroll">
            <article
              ref={articleRef}
              className="ob-article"
              onClick={handleArticleClick}
              dangerouslySetInnerHTML={{ __html: rendered }}
            />
            <section className="ob-backlinks">
              <h4>🔗 Backlinks — {backlinks.length} nota{backlinks.length === 1 ? '' : 's'} enlazan acá</h4>
              {backlinks.length === 0 && <p className="ob-empty">Ninguna nota enlaza a esta todavía.</p>}
              <div className="ob-bl-list">
                {backlinks.map((n) => (
                  <button key={n.title} className="ob-bl" onClick={() => openNote(n.title)}>
                    {n.title}
                  </button>
                ))}
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  )
}

/* ---------- Styles (tema oscuro estilo Obsidian) ---------- */

const CSS = `
.ob-root { display: flex; height: 100vh; background: #1e1e2e; color: #dcddde; font-family: -apple-system, 'Segoe UI', Roboto, sans-serif; overflow: hidden; }
.ob-root * { box-sizing: border-box; }

.ob-side { width: 280px; min-width: 280px; background: #16161e; border-right: 1px solid #2c2c3a; display: flex; flex-direction: column; }
.ob-side-head { padding: 16px 14px 10px; }
.ob-logo { font-weight: 700; font-size: 15px; color: #a78bfa; }
.ob-search { margin: 0 12px 10px; padding: 8px 12px; background: #1e1e2e; border: 1px solid #2c2c3a; border-radius: 8px; color: #dcddde; font-size: 13px; outline: none; }
.ob-search:focus { border-color: #a78bfa; }
.ob-actions { display: flex; gap: 8px; padding: 0 12px 10px; }
.ob-list { flex: 1; overflow-y: auto; padding: 4px 8px; }
.ob-item { display: flex; align-items: center; gap: 6px; width: 100%; text-align: left; padding: 7px 10px; border: none; background: transparent; color: #b8b8c8; font-size: 13.5px; border-radius: 6px; cursor: pointer; }
.ob-item:hover { background: #22222e; color: #fff; }
.ob-item.active { background: #2d2b45; color: #cbb8ff; }
.ob-item-title { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ob-tag { font-size: 10px; background: #3b2f5e; color: #cbb8ff; border-radius: 6px; padding: 1px 6px; }
.ob-dot { width: 7px; height: 7px; border-radius: 50%; background: #a78bfa; flex-shrink: 0; }
.ob-side-foot { padding: 10px 14px; font-size: 11.5px; color: #6c6c80; border-top: 1px solid #2c2c3a; }
.ob-empty { color: #6c6c80; font-size: 13px; padding: 8px 10px; }

.ob-main { flex: 1; display: flex; flex-direction: column; min-width: 0; }
.ob-top { display: flex; align-items: center; gap: 8px; padding: 10px 16px; border-bottom: 1px solid #2c2c3a; background: #1a1a26; }
.ob-crumb { font-size: 14px; font-weight: 600; color: #e8e8f0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ob-spacer { flex: 1; }

.ob-btn { background: #26263a; border: 1px solid #34344a; color: #c8c8d8; padding: 6px 12px; border-radius: 7px; font-size: 12.5px; cursor: pointer; white-space: nowrap; }
.ob-btn:hover { background: #30304a; color: #fff; }
.ob-btn.primary { background: #6d5bd0; border-color: #7d6be0; color: #fff; }
.ob-btn.on { background: #3b2f5e; border-color: #a78bfa; color: #cbb8ff; }
.ob-btn.danger:hover { background: #4a2030; border-color: #a04060; }

.ob-scroll { flex: 1; overflow-y: auto; }
.ob-article { max-width: 760px; margin: 0 auto; padding: 32px 36px 20px; line-height: 1.65; font-size: 15px; }
.ob-article h1 { font-size: 28px; color: #fff; margin: 8px 0 18px; }
.ob-article h2 { font-size: 20px; color: #e8e8f0; margin: 28px 0 10px; padding-bottom: 6px; border-bottom: 1px solid #2c2c3a; }
.ob-article h3 { font-size: 16.5px; color: #e0e0ea; margin: 20px 0 8px; }
.ob-article p { margin: 10px 0; }
.ob-article ul, .ob-article ol { margin: 10px 0; padding-left: 26px; }
.ob-article li { margin: 4px 0; }
.ob-article li.task { list-style: none; margin-left: -20px; }
.ob-article .cb { color: #a78bfa; margin-right: 4px; }
.ob-article a.wl { color: #a78bfa; text-decoration: none; border-bottom: 1px solid rgba(167,139,250,.35); cursor: pointer; }
.ob-article a.wl:hover { color: #cbb8ff; border-bottom-color: #cbb8ff; }
.ob-article a.wl.dead { color: #8a7aa8; border-bottom-style: dashed; }
.ob-article a.ext { color: #7dd3fc; text-decoration: none; word-break: break-all; }
.ob-article a.ext:hover { text-decoration: underline; }
.ob-article code { background: #2a2a3c; color: #f0a6c0; padding: 2px 6px; border-radius: 5px; font-size: 13px; font-family: 'SF Mono', Menlo, Consolas, monospace; }
.ob-article pre { background: #14141c; border: 1px solid #2c2c3a; border-radius: 10px; padding: 14px 16px; overflow-x: auto; margin: 12px 0; }
.ob-article pre code { background: none; color: #a6e3a1; padding: 0; }
.ob-article blockquote { border-left: 3px solid #a78bfa; margin: 12px 0; padding: 4px 16px; color: #b8b8c8; background: #22222e; border-radius: 0 8px 8px 0; }
.ob-article hr { border: none; border-top: 1px solid #2c2c3a; margin: 20px 0; }
.ob-article mark { background: #5b4a15; color: #ffe9a8; border-radius: 3px; padding: 0 3px; }
.ob-article .tbl { overflow-x: auto; margin: 12px 0; }
.ob-article table { border-collapse: collapse; width: 100%; font-size: 13.5px; }
.ob-article th { background: #26263a; color: #cbb8ff; text-align: left; padding: 8px 12px; border: 1px solid #34344a; }
.ob-article td { padding: 8px 12px; border: 1px solid #2c2c3a; }
.ob-article tr:nth-child(even) td { background: #22222e; }

.callout { border-radius: 10px; margin: 14px 0; overflow: hidden; border: 1px solid; }
.callout-title { font-weight: 700; font-size: 13.5px; padding: 9px 14px; }
.callout-body { padding: 10px 14px; font-size: 14px; background: rgba(0,0,0,.18); }
.callout-tip { border-color: #2d5a4a; } .callout-tip .callout-title { background: #1d3a30; color: #7ce0b8; }
.callout-warning { border-color: #6a4a20; } .callout-warning .callout-title { background: #453014; color: #ffc978; }
.callout-note, .callout-info { border-color: #2d4a6a; } .callout-note .callout-title, .callout-info .callout-title { background: #1a3048; color: #8cc8ff; }

.ob-backlinks { max-width: 760px; margin: 0 auto; padding: 8px 36px 48px; }
.ob-backlinks h4 { font-size: 13px; color: #8888a0; border-top: 1px solid #2c2c3a; padding-top: 16px; margin-bottom: 10px; }
.ob-bl-list { display: flex; flex-wrap: wrap; gap: 8px; }
.ob-bl { background: #22222e; border: 1px solid #34344a; color: #a78bfa; border-radius: 8px; padding: 6px 12px; font-size: 12.5px; cursor: pointer; }
.ob-bl:hover { background: #2d2b45; color: #cbb8ff; }

.ob-editor { flex: 1; margin: 0; padding: 28px 36px; background: #1a1a24; color: #dcddde; border: none; outline: none; resize: none; font-family: 'SF Mono', Menlo, Consolas, monospace; font-size: 13.5px; line-height: 1.7; }

.ob-graph { flex: 1; display: flex; flex-direction: column; padding: 12px; }
.ob-graph svg { flex: 1; width: 100%; height: 100%; background: radial-gradient(circle at 50% 40%, #23233200, #1a1a24 80%); border-radius: 12px; }
.ob-edge { stroke: #3c3c52; stroke-width: 1.2; }
.ob-node { cursor: pointer; }
.ob-node circle { fill: #7d6be0; stroke: #a78bfa; stroke-width: 1.5; transition: fill .15s; }
.ob-node:hover circle { fill: #a78bfa; }
.ob-node circle.sel { fill: #cbb8ff; stroke: #fff; }
.ob-node text { fill: #9a9ab0; font-size: 11px; pointer-events: none; }
.ob-node:hover text { fill: #e8e8f0; }
.ob-graph-hint { text-align: center; color: #6c6c80; font-size: 12px; padding: 8px; }

@media (max-width: 800px) {
  .ob-side { position: absolute; z-index: 20; height: 100%; box-shadow: 4px 0 24px rgba(0,0,0,.5); }
  .ob-article, .ob-backlinks { padding-left: 20px; padding-right: 20px; }
}
`
