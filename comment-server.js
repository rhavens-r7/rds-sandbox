import express from 'express'
import cors from 'cors'
import { readFileSync, writeFileSync } from 'fs'
import { randomUUID } from 'crypto'

const app = express()
const PORT = 3001
const DB_PATH = './comments/comments.json'

app.use(cors())
app.use(express.json())

function readComments() {
  try {
    return JSON.parse(readFileSync(DB_PATH, 'utf-8'))
  } catch {
    return []
  }
}

function writeComments(comments) {
  writeFileSync(DB_PATH, JSON.stringify(comments, null, 2))
}

// GET /api/comments — list all comments, optional ?page= or ?elementId= filter
app.get('/api/comments', (req, res) => {
  let comments = readComments()
  const { page, elementId } = req.query
  if (page) comments = comments.filter((c) => c.page === page)
  if (elementId) comments = comments.filter((c) => c.elementId === elementId)
  res.json(comments)
})

// POST /api/comments — create a new comment
app.post('/api/comments', (req, res) => {
  const { page, elementId, author, text, x, y } = req.body
  if (!page || !author || !text) {
    return res.status(400).json({ error: 'page, author, and text are required' })
  }
  const comment = {
    id: randomUUID(),
    page,
    elementId: elementId ?? null,
    author,
    text,
    x: x ?? null,
    y: y ?? null,
    resolved: false,
    createdAt: new Date().toISOString(),
    replies: [],
  }
  const comments = readComments()
  comments.push(comment)
  writeComments(comments)
  res.status(201).json(comment)
})

// PATCH /api/comments/:id/resolve — mark a comment resolved
app.patch('/api/comments/:id/resolve', (req, res) => {
  const comments = readComments()
  const idx = comments.findIndex((c) => c.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Comment not found' })
  comments[idx].resolved = true
  comments[idx].resolvedAt = new Date().toISOString()
  writeComments(comments)
  res.json(comments[idx])
})

// POST /api/comments/:id/reply — add a reply to a comment thread
app.post('/api/comments/:id/reply', (req, res) => {
  const { author, text } = req.body
  if (!author || !text) {
    return res.status(400).json({ error: 'author and text are required' })
  }
  const comments = readComments()
  const idx = comments.findIndex((c) => c.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Comment not found' })
  const reply = {
    id: randomUUID(),
    author,
    text,
    createdAt: new Date().toISOString(),
  }
  comments[idx].replies.push(reply)
  writeComments(comments)
  res.status(201).json(reply)
})

app.listen(PORT, () => {
  console.log(`Comment server running on http://localhost:${PORT}`)
})
