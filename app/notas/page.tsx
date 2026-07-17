import fs from 'fs'
import path from 'path'
import NotasApp from './NotasApp'

export const metadata = {
  title: 'Notas — Yani Trend',
  description: 'Base de conocimiento estilo Obsidian de Yani Trend',
}

export const dynamic = 'force-static'

export default function NotasPage() {
  const dir = path.join(process.cwd(), 'notas-vault')
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md'))
  const notes = files
    .map((f) => ({
      title: f.replace(/\.md$/, ''),
      content: fs.readFileSync(path.join(dir, f), 'utf8'),
    }))
    .sort((a, b) => (a.title === 'Inicio' ? -1 : b.title === 'Inicio' ? 1 : a.title.localeCompare(b.title, 'es')))

  return <NotasApp baseNotes={notes} />
}
