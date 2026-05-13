import React, { useState } from 'react'
import {
  Box, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, TextField,
  Select, MenuItem, FormControl, InputLabel, Grid,
  IconButton, Tooltip, Stack, useTheme,
} from '@rapid7/rds'
import SearchIcon from '@mui/icons-material/Search'
import FilterListIcon from '@mui/icons-material/FilterList'
import { CONTENT_MAX_WIDTH } from '../App'
import detections from '../mock-data/detections.json'

const SEVERITY_KEYS = ['critical', 'high', 'medium', 'low']

function useSeverityPalette() {
  const theme = useTheme()
  const s = theme.palette.status
  return {
    critical: { color: s.critical.main,  bg: s.critical.states.selected },
    high:     { color: s.high.main,      bg: s.high.states.selected },
    medium:   { color: s.medium.main,    bg: s.medium.states.selected },
    low:      { color: s.low.main,       bg: s.low.states.selected },
    info:     { color: theme.palette.info.main, bg: theme.palette.action.selected },
  }
}

function SeverityBadge({ severity }) {
  const palette = useSeverityPalette()
  const style = palette[severity] ?? palette.info
  return (
    <Chip
      label={severity.toUpperCase()}
      size="small"
      sx={{
        bgcolor: style.bg,
        color: style.color,
        border: '1px solid',
        borderColor: style.color,
        fontWeight: 700,
        fontSize: '0.625rem',
        letterSpacing: '0.06em',
        height: 20,
      }}
    />
  )
}

function StatusChip({ status }) {
  const colorMap = { open: 'error', investigating: 'warning', resolved: 'success' }
  return (
    <Chip
      label={status.charAt(0).toUpperCase() + status.slice(1)}
      size="small"
      color={colorMap[status] ?? 'default'}
      variant="outlined"
    />
  )
}

export default function DetectionListing() {
  const theme = useTheme()
  const [search, setSearch]           = useState('')
  const [severityFilter, setSeverity] = useState('all')
  const [statusFilter, setStatus]     = useState('all')

  const filtered = detections.filter((d) => {
    const matchSearch   = !search || d.rule.toLowerCase().includes(search.toLowerCase()) || d.asset.toLowerCase().includes(search.toLowerCase())
    const matchSeverity = severityFilter === 'all' || d.severity === severityFilter
    const matchStatus   = statusFilter   === 'all' || d.status   === statusFilter
    return matchSearch && matchSeverity && matchStatus
  })

  return (
    <Box sx={{ p: 3, maxWidth: CONTENT_MAX_WIDTH, mx: 'auto' }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary' }}>
            Detections
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {filtered.length} of {detections.length} detections
          </Typography>
        </Box>
        <Tooltip title="Filter options">
          <IconButton size="small" sx={{ color: 'text.secondary' }}>
            <FilterListIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>

      {/* Filter bar */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search rule or asset…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <SearchIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
              ),
            }}
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Severity</InputLabel>
            <Select value={severityFilter} label="Severity" onChange={(e) => setSeverity(e.target.value)}>
              <MenuItem value="all">All severities</MenuItem>
              {SEVERITY_KEYS.map((s) => <MenuItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</MenuItem>)}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Status</InputLabel>
            <Select value={statusFilter} label="Status" onChange={(e) => setStatus(e.target.value)}>
              <MenuItem value="all">All statuses</MenuItem>
              <MenuItem value="open">Open</MenuItem>
              <MenuItem value="investigating">Investigating</MenuItem>
              <MenuItem value="resolved">Resolved</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Rule</TableCell>
              <TableCell>Severity</TableCell>
              <TableCell>Asset</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Alerts</TableCell>
              <TableCell>First Seen</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((row) => (
              <TableRow key={row.id} hover sx={{ cursor: 'pointer', '&:last-child td': { border: 0 } }}>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
                    {row.rule}
                  </Typography>
                </TableCell>
                <TableCell><SeverityBadge severity={row.severity} /></TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', color: 'info.main' }}>
                    {row.asset}
                  </Typography>
                </TableCell>
                <TableCell><StatusChip status={row.status} /></TableCell>
                <TableCell align="right">
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                    {row.alerts}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {new Date(row.firstSeen).toLocaleString()}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
