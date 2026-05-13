import React, { useState, useEffect, useCallback, useRef } from 'react'
import {
  Box, Paper, Typography, TextField, Button, Stack,
  IconButton, Chip, Collapse, Tooltip, Badge, Fade, useTheme,
} from '@rapid7/rds'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import CloseIcon from '@mui/icons-material/Close'
import CheckIcon from '@mui/icons-material/Check'
import ReplyIcon from '@mui/icons-material/Reply'
import AddCommentIcon from '@mui/icons-material/AddComment'

const API = '/api/comments'
const AUTHOR = 'Design Reviewer'

function CommentPin({ comment, onResolve, onReply }) {
  const theme = useTheme()
  const [open, setOpen]         = useState(false)
  const [replyText, setReply]   = useState('')
  const [showReply, setShowReply] = useState(false)

  async function handleResolve() {
    await fetch(`${API}/${comment.id}/resolve`, { method: 'PATCH' })
    onResolve()
  }

  async function handleReply() {
    if (!replyText.trim()) return
    await fetch(`${API}/${comment.id}/reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ author: AUTHOR, text: replyText }),
    })
    setReply('')
    setShowReply(false)
    onReply()
  }

  const pinColor = comment.resolved ? theme.palette.success.main : theme.palette.primary.main

  return (
    <Box sx={{ position: 'absolute', left: comment.x, top: comment.y, zIndex: 1200 }}>
      <Tooltip title={comment.resolved ? 'Resolved' : comment.author} placement="top">
        <Box
          onClick={() => setOpen((o) => !o)}
          sx={{
            width: 28,
            height: 28,
            borderRadius: 99,
            bgcolor: pinColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            border: '2px solid',
            borderColor: 'background.default',
            boxShadow: 4,
            transition: 'transform 0.15s',
            '&:hover': { transform: 'scale(1.15)' },
          }}
        >
          <ChatBubbleOutlineIcon sx={{ fontSize: 14, color: 'common.white' }} />
        </Box>
      </Tooltip>

      <Fade in={open}>
        <Paper
          elevation={4}
          sx={{
            position: 'absolute',
            left: 36,
            top: -4,
            width: 280,
            p: 2,
            zIndex: 1300,
            border: '1px solid',
            borderColor: 'divider',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.primary' }}>
                {comment.author}
              </Typography>
              {comment.resolved && (
                <Chip label="Resolved" size="small" color="success" sx={{ height: 16, fontSize: '0.6rem' }} />
              )}
            </Stack>
            <IconButton size="small" onClick={() => setOpen(false)} sx={{ p: 0.25 }}>
              <CloseIcon sx={{ fontSize: 14 }} />
            </IconButton>
          </Stack>

          <Typography variant="body2" sx={{ color: 'text.primary', mb: 1.5, lineHeight: 1.5 }}>
            {comment.text}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
            {new Date(comment.createdAt).toLocaleString()}
          </Typography>

          {comment.replies?.length > 0 && (
            <Box sx={{ borderLeft: '2px solid', borderColor: 'divider', pl: 1.5, mb: 1.5 }}>
              {comment.replies.map((r) => (
                <Box key={r.id} sx={{ mb: 1 }}>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.primary' }}>
                    {r.author}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.primary' }}>{r.text}</Typography>
                </Box>
              ))}
            </Box>
          )}

          <Collapse in={showReply}>
            <TextField
              fullWidth multiline rows={2} size="small"
              placeholder="Write a reply…"
              value={replyText}
              onChange={(e) => setReply(e.target.value)}
              sx={{ mb: 1 }}
            />
          </Collapse>

          {!comment.resolved && (
            <Stack direction="row" spacing={1}>
              <Button size="small" startIcon={<ReplyIcon />} onClick={() => setShowReply((s) => !s)} sx={{ fontSize: '0.6875rem' }}>
                Reply
              </Button>
              {showReply && (
                <Button size="small" variant="contained" onClick={handleReply} disabled={!replyText.trim()} sx={{ fontSize: '0.6875rem' }}>
                  Send
                </Button>
              )}
              <Button size="small" startIcon={<CheckIcon />} onClick={handleResolve} sx={{ fontSize: '0.6875rem', ml: 'auto !important' }}>
                Resolve
              </Button>
            </Stack>
          )}
        </Paper>
      </Fade>
    </Box>
  )
}

function NewCommentForm({ x, y, page, onSave, onCancel }) {
  const [text, setText] = useState('')

  async function handleSave() {
    if (!text.trim()) return
    await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page, author: AUTHOR, text, x, y }),
    })
    onSave()
  }

  return (
    <Paper
      elevation={8}
      sx={{
        position: 'fixed',
        left: x + 12,
        top: y + 12,
        width: 260,
        p: 2,
        zIndex: 1300,
        border: '1px solid',
        borderColor: 'primary.main',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 1, color: 'text.primary' }}>
        Add comment
      </Typography>
      <TextField
        autoFocus fullWidth multiline rows={3} size="small"
        placeholder="Leave a comment…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        sx={{ mb: 1.5 }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSave()
          if (e.key === 'Escape') onCancel()
        }}
      />
      <Stack direction="row" spacing={1} justifyContent="flex-end">
        <Button size="small" onClick={onCancel} sx={{ fontSize: '0.6875rem' }}>Cancel</Button>
        <Button size="small" variant="contained" onClick={handleSave} disabled={!text.trim()} sx={{ fontSize: '0.6875rem' }}>
          Save
        </Button>
      </Stack>
    </Paper>
  )
}

export default function CommentOverlay({ page }) {
  const theme = useTheme()
  const [comments, setComments]     = useState([])
  const [commenting, setCommenting] = useState(false)
  const [newPin, setNewPin]         = useState(null)
  const [showResolved, setShowResolved] = useState(false)

  const loadComments = useCallback(async () => {
    try {
      const res = await fetch(`${API}?page=${encodeURIComponent(page)}`)
      setComments(await res.json())
    } catch {
      // comment server may not be running
    }
  }, [page])

  useEffect(() => { loadComments() }, [loadComments])

  function handleOverlayClick(e) {
    if (!commenting) return
    setNewPin({ x: e.clientX, y: e.clientY })
  }

  const unresolved = comments.filter((c) => !c.resolved)
  const visible    = showResolved ? comments : unresolved

  return (
    <>
      {commenting && (
        <Box
          onClick={handleOverlayClick}
          sx={{
            position: 'fixed',
            inset: 0,
            zIndex: 1200,
            cursor: 'crosshair',
            bgcolor: theme.palette.primary.main,
            opacity: 0.04,
          }}
        />
      )}

      {visible.map((c) => (
        <CommentPin key={c.id} comment={c} onResolve={loadComments} onReply={loadComments} />
      ))}

      {newPin && (
        <NewCommentForm
          x={newPin.x} y={newPin.y} page={page}
          onSave={() => { setNewPin(null); setCommenting(false); loadComments() }}
          onCancel={() => { setNewPin(null); setCommenting(false) }}
        />
      )}

      {/* Floating toolbar */}
      <Box sx={{ position: 'fixed', bottom: 3, right: 3, zIndex: 1400, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
        <Chip
          label={showResolved ? 'Hide resolved' : `${unresolved.length} open`}
          size="small"
          onClick={() => setShowResolved((s) => !s)}
          sx={{ bgcolor: 'background.paper', color: 'text.secondary', border: '1px solid', borderColor: 'divider', cursor: 'pointer' }}
        />
        <Tooltip title={commenting ? 'Click anywhere to place • Esc to cancel' : 'Add comment'} placement="left">
          <Badge badgeContent={unresolved.length} color="error" max={99}>
            <Button
              variant={commenting ? 'contained' : 'outlined'}
              size="small"
              startIcon={<AddCommentIcon />}
              onClick={() => { setCommenting((c) => !c); setNewPin(null) }}
              onKeyDown={(e) => e.key === 'Escape' && setCommenting(false)}
              sx={{ fontWeight: 600 }}
            >
              {commenting ? 'Click to place…' : 'Comment'}
            </Button>
          </Badge>
        </Tooltip>
      </Box>
    </>
  )
}
