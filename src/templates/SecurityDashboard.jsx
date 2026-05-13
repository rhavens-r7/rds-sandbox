import React from 'react'
import {
  Box, Typography, Grid, Paper, Stack, Chip,
  LinearProgress, Divider, useTheme,
} from '@rapid7/rds'
import SecurityIcon from '@mui/icons-material/Security'
import BugReportIcon from '@mui/icons-material/BugReport'
import DevicesIcon from '@mui/icons-material/Devices'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import { CONTENT_MAX_WIDTH } from '../App'
import detections from '../mock-data/detections.json'
import assets from '../mock-data/assets.json'

const openDetections = detections.filter((d) => d.status === 'open')
const criticalCount  = openDetections.filter((d) => d.severity === 'critical').length
const highCount      = openDetections.filter((d) => d.severity === 'high').length

function StatCard({ icon, label, value, trend, trendLabel, paletteColor }) {
  const theme = useTheme()
  const isUp  = trend > 0
  const color = typeof paletteColor === 'function' ? paletteColor(theme) : paletteColor

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 1,
            bgcolor: 'action.selected',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {React.cloneElement(icon, { sx: { color, fontSize: 18 } })}
        </Box>
        <Stack direction="row" alignItems="center" spacing={0.5}>
          {isUp
            ? <TrendingUpIcon sx={{ fontSize: 14, color: 'error.main' }} />
            : <TrendingDownIcon sx={{ fontSize: 14, color: 'success.main' }} />
          }
          <Typography variant="caption" sx={{ color: isUp ? 'error.main' : 'success.main' }}>
            {Math.abs(trend)}% {trendLabel}
          </Typography>
        </Stack>
      </Stack>
      <Typography variant="h4" sx={{ fontWeight: 700, mt: 2, color: 'text.primary' }}>
        {value}
      </Typography>
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        {label}
      </Typography>
    </Paper>
  )
}

function SeverityRow({ label, count, total, statusKey }) {
  const theme = useTheme()
  const color = theme.palette.status[statusKey]?.main ?? theme.palette.info.main

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>{label}</Typography>
        <Typography variant="body2" sx={{ fontWeight: 600, color }}>{count}</Typography>
      </Stack>
      <LinearProgress
        variant="determinate"
        value={total > 0 ? (count / total) * 100 : 0}
        sx={{
          height: 4,
          borderRadius: 99,
          bgcolor: 'action.disabledBackground',
          '& .MuiLinearProgress-bar': { bgcolor: color, borderRadius: 99 },
        }}
      />
    </Box>
  )
}

export default function SecurityDashboard() {
  const theme = useTheme()

  const severityCounts = {
    critical: detections.filter((d) => d.severity === 'critical').length,
    high:     detections.filter((d) => d.severity === 'high').length,
    medium:   detections.filter((d) => d.severity === 'medium').length,
    low:      detections.filter((d) => d.severity === 'low').length,
  }
  const totalDetections = detections.length
  const avgRisk = Math.round(assets.reduce((s, a) => s + a.riskScore, 0) / assets.length)

  return (
    <Box sx={{ p: 3, maxWidth: CONTENT_MAX_WIDTH, mx: 'auto' }}>
      {/* Page header */}
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 4 }}>
        <SecurityIcon sx={{ color: 'primary.main', fontSize: 28 }} />
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary' }}>
            Security Dashboard
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Last updated: {new Date().toLocaleTimeString()}
          </Typography>
        </Box>
      </Stack>

      {/* Stat cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            icon={<BugReportIcon />}
            label="Open Detections"
            value={openDetections.length}
            trend={12}
            trendLabel="vs yesterday"
            paletteColor="error.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            icon={<WarningAmberIcon />}
            label="Critical + High"
            value={criticalCount + highCount}
            trend={5}
            trendLabel="vs yesterday"
            paletteColor="warning.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            icon={<DevicesIcon />}
            label="Monitored Assets"
            value={assets.length}
            trend={-2}
            trendLabel="vs last week"
            paletteColor="primary.main"
          />
        </Grid>
      </Grid>

      {/* Second row */}
      <Grid container spacing={3}>
        {/* Severity breakdown */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="caption" sx={{ mb: 2.5, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, display: 'block' }}>
              Detections by Severity
            </Typography>
            <Stack spacing={2}>
              <SeverityRow label="Critical" count={severityCounts.critical} total={totalDetections} statusKey="critical" />
              <SeverityRow label="High"     count={severityCounts.high}     total={totalDetections} statusKey="high" />
              <SeverityRow label="Medium"   count={severityCounts.medium}   total={totalDetections} statusKey="medium" />
              <SeverityRow label="Low"      count={severityCounts.low}      total={totalDetections} statusKey="low" />
            </Stack>
          </Paper>
        </Grid>

        {/* Top assets by risk */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="caption" sx={{ mb: 2.5, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, display: 'block' }}>
              Top Assets by Risk
            </Typography>
            <Stack spacing={0} divider={<Divider flexItem />}>
              {[...assets].sort((a, b) => b.riskScore - a.riskScore).map((a) => {
                const isHigh    = a.riskScore >= 90
                const chipColor = isHigh ? theme.palette.error.main : theme.palette.warning.main
                const chipBg    = isHigh ? theme.palette.status.critical.states.selected : theme.palette.status.medium.states.selected
                return (
                  <Stack key={a.id} direction="row" justifyContent="space-between" alignItems="center" sx={{ py: 1.25 }}>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary', fontFamily: 'monospace' }}>
                        {a.hostname}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>{a.os}</Typography>
                    </Box>
                    <Chip
                      label={a.riskScore}
                      size="small"
                      sx={{ bgcolor: chipBg, color: chipColor, fontWeight: 700, minWidth: 40 }}
                    />
                  </Stack>
                )
              })}
            </Stack>
          </Paper>
        </Grid>

        {/* Detection status */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="caption" sx={{ mb: 2.5, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, display: 'block' }}>
              Detection Status
            </Typography>
            <Stack spacing={2}>
              {[
                { status: 'open',          color: 'error.main',   Icon: WarningAmberIcon },
                { status: 'investigating', color: 'warning.main', Icon: WarningAmberIcon },
                { status: 'resolved',      color: 'success.main', Icon: CheckCircleOutlineIcon },
              ].map(({ status, color, Icon }) => {
                const count = detections.filter((d) => d.status === status).length
                return (
                  <Stack key={status} direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Icon sx={{ fontSize: 16, color }} />
                      <Typography variant="body2" sx={{ textTransform: 'capitalize', color: 'text.primary' }}>
                        {status}
                      </Typography>
                    </Stack>
                    <Typography variant="body2" sx={{ fontWeight: 700, color }}>
                      {count}
                    </Typography>
                  </Stack>
                )
              })}
            </Stack>

            <Divider sx={{ my: 2.5 }} />

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Avg asset risk score
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, color: avgRisk >= 70 ? 'warning.main' : 'success.main' }}>
                {avgRisk}
              </Typography>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}
