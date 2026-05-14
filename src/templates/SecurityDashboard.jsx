import React from 'react'
import {
  Box, Grid, Paper, Stack, Chip, Typography,
  LinearProgress, Divider, useTheme,
  Kpi, SectionHeader, KPI_VARIANT, KPI_DETAIL_SECTION_VARIANT, KPI_DELTA_SUCCESS_OPTIONS,
} from '@rapid7/rds'
import SecurityIcon from '@mui/icons-material/Security'
import BugReportIcon from '@mui/icons-material/BugReport'
import DevicesIcon from '@mui/icons-material/Devices'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import DashboardTemplate from './DashboardTemplate'
import detections from '../mock-data/detections.json'
import assets from '../mock-data/assets.json'

// ─── Derived data ─────────────────────────────────────────────────────────────
const openDetections = detections.filter((d) => d.status === 'open')
const severityCounts = {
  critical: detections.filter((d) => d.severity === 'critical').length,
  high:     detections.filter((d) => d.severity === 'high').length,
  medium:   detections.filter((d) => d.severity === 'medium').length,
  low:      detections.filter((d) => d.severity === 'low').length,
}
const totalDetections = detections.length
const avgRisk = Math.round(assets.reduce((s, a) => s + a.riskScore, 0) / assets.length)

// ─── Sub-components ───────────────────────────────────────────────────────────
function SeverityRow({ label, count, statusKey }) {
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
        value={totalDetections > 0 ? (count / totalDetections) * 100 : 0}
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

// ─── Slot content ─────────────────────────────────────────────────────────────

function DashboardHeader() {
  return (
    <SectionHeader
      header="Security Dashboard"
      subheaderSlot={
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Last updated: {new Date().toLocaleTimeString()}
        </Typography>
      }
      actionsSlot={
        <SecurityIcon sx={{ color: 'primary.main', fontSize: 22 }} />
      }
      divider
    />
  )
}

function KpiStrip() {
  const criticalHigh = severityCounts.critical + severityCounts.high
  return (
    <>
      <Box sx={{ flex: 1 }}>
        <Kpi
          label="Open Detections"
          value={openDetections.length}
          Icon={<BugReportIcon />}
          variant={KPI_VARIANT.NUMBER}
          detailSections={[{
            variant: KPI_DETAIL_SECTION_VARIANT.PERCENTAGE_CHANGE,
            previousValue: Math.round(openDetections.length * 0.88),
            value: openDetections.length,
            successDelta: KPI_DELTA_SUCCESS_OPTIONS.LESS_THAN,
            label: 'vs yesterday',
          }]}
        />
      </Box>
      <Divider orientation="vertical" flexItem />
      <Box sx={{ flex: 1 }}>
        <Kpi
          label="Critical + High"
          value={criticalHigh}
          Icon={<WarningAmberIcon />}
          variant={KPI_VARIANT.NUMBER}
          detailSections={[{
            variant: KPI_DETAIL_SECTION_VARIANT.PERCENTAGE_CHANGE,
            previousValue: Math.round(criticalHigh * 0.95),
            value: criticalHigh,
            successDelta: KPI_DELTA_SUCCESS_OPTIONS.LESS_THAN,
            label: 'vs yesterday',
          }]}
        />
      </Box>
      <Divider orientation="vertical" flexItem />
      <Box sx={{ flex: 1 }}>
        <Kpi
          label="Monitored Assets"
          value={assets.length}
          Icon={<DevicesIcon />}
          variant={KPI_VARIANT.NUMBER}
          detailSections={[{
            variant: KPI_DETAIL_SECTION_VARIANT.PERCENTAGE_CHANGE,
            previousValue: assets.length + 1,
            value: assets.length,
            successDelta: KPI_DELTA_SUCCESS_OPTIONS.GREATER_THAN,
            label: 'vs last week',
          }]}
        />
      </Box>
    </>
  )
}

function SeverityCard() {
  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, display: 'block', mb: 2 }}>
        Detections by Severity
      </Typography>
      <Stack spacing={2}>
        <SeverityRow label="Critical" count={severityCounts.critical} statusKey="critical" />
        <SeverityRow label="High"     count={severityCounts.high}     statusKey="high" />
        <SeverityRow label="Medium"   count={severityCounts.medium}   statusKey="medium" />
        <SeverityRow label="Low"      count={severityCounts.low}      statusKey="low" />
      </Stack>
    </Paper>
  )
}

function TopAssetsCard() {
  const theme = useTheme()
  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, display: 'block', mb: 2 }}>
        Top Assets by Risk
      </Typography>
      <Stack divider={<Divider flexItem />}>
        {[...assets].sort((a, b) => b.riskScore - a.riskScore).map((a) => {
          const isHigh   = a.riskScore >= 90
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
              <Chip label={a.riskScore} size="small" sx={{ bgcolor: chipBg, color: chipColor, fontWeight: 700, minWidth: 40 }} />
            </Stack>
          )
        })}
      </Stack>
    </Paper>
  )
}

function DetectionStatusCard() {
  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, display: 'block', mb: 2 }}>
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
              <Typography variant="body2" sx={{ fontWeight: 700, color }}>{count}</Typography>
            </Stack>
          )
        })}
      </Stack>
      <Divider sx={{ my: 2 }} />
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>Avg asset risk score</Typography>
        <Typography variant="body2" sx={{ fontWeight: 700, color: avgRisk >= 70 ? 'warning.main' : 'success.main' }}>
          {avgRisk}
        </Typography>
      </Stack>
    </Paper>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function SecurityDashboard() {
  return (
    <DashboardTemplate
      header={<DashboardHeader />}
      kpiRow={
        <Paper sx={{ p: 2, width: '100%', display: 'flex', gap: 3 }}>
          <KpiStrip />
        </Paper>
      }
      cards={
        <>
          <Grid item xs={12} md={4}><SeverityCard /></Grid>
          <Grid item xs={12} md={4}><TopAssetsCard /></Grid>
          <Grid item xs={12} md={4}><DetectionStatusCard /></Grid>
        </>
      }
    />
  )
}
