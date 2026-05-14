import React from 'react'
import {
  Box, Typography, Paper, Chip, Divider, Stack,
  Button, LinearProgress, useTheme,
  DetailsPageHeader, SectionHeader,
} from '@rapid7/rds'
import BugReportIcon from '@mui/icons-material/BugReport'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import DetailsTemplate from './DetailsTemplate'
import detections from '../mock-data/detections.json'
import assets from '../mock-data/assets.json'

const detection = detections.find((d) => d.severity === 'critical') ?? detections[0]
const asset     = assets.find((a) => a.hostname === detection.asset) ?? assets[0]

// ─── Sub-components ───────────────────────────────────────────────────────────
function SectionLabel({ children }) {
  return (
    <Typography
      variant="caption"
      sx={{ color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, display: 'block', mb: 1.5 }}
    >
      {children}
    </Typography>
  )
}

function DetailRow({ label, value }) {
  return (
    <Stack direction="row" spacing={2} sx={{ py: 1.25, borderBottom: '1px solid', borderColor: 'divider' }}>
      <Typography variant="body2" sx={{ color: 'text.secondary', width: 160, flexShrink: 0 }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.primary', wordBreak: 'break-all' }}>
        {value}
      </Typography>
    </Stack>
  )
}

// ─── Slot content ─────────────────────────────────────────────────────────────
function DetectionHeader() {
  const theme = useTheme()
  const statusPalette = theme.palette.status
  const severityColor = statusPalette[detection.severity]?.main ?? theme.palette.error.main

  return (
    <DetailsPageHeader
      pageTitle={detection.rule}
      breadcrumbsProps={{
        crumbs: [
          { label: 'Detections', href: '#' },
        ],
        currentLocationLabel: 'Detection Details',
      }}
      slots={{
        tags: (
          <Stack direction="row" spacing={1}>
            <Chip
              label={detection.severity.toUpperCase()}
              size="small"
              sx={{
                bgcolor: statusPalette[detection.severity]?.states?.selected,
                color: severityColor,
                border: '1px solid',
                borderColor: severityColor,
                fontWeight: 700,
                fontSize: '0.625rem',
              }}
            />
            <Chip
              label={detection.status.charAt(0).toUpperCase() + detection.status.slice(1)}
              size="small"
              color={detection.status === 'open' ? 'error' : 'warning'}
              variant="outlined"
            />
          </Stack>
        ),
        actions: (
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" size="small" color="error">
              Close Detection
            </Button>
            <Button variant="contained" size="small">
              Investigate
            </Button>
          </Stack>
        ),
      }}
    />
  )
}

function DetectionSummary() {
  return (
    <Paper sx={{ p: 3 }}>
      <SectionLabel>Detection Details</SectionLabel>
      <DetailRow label="Detection ID"     value={detection.id} />
      <DetailRow label="Rule"             value={detection.rule} />
      <DetailRow label="Asset"            value={detection.asset} />
      <DetailRow label="First Seen"       value={new Date(detection.firstSeen).toLocaleString()} />
      <DetailRow label="Last Seen"        value={new Date(detection.lastSeen).toLocaleString()} />
      <DetailRow label="IP Address"       value={asset.ip} />
      <DetailRow label="Operating System" value={asset.os} />
    </Paper>
  )
}

function DetectionSections() {
  const theme = useTheme()
  const riskColor    = asset.riskScore >= 80 ? theme.palette.error.main : theme.palette.warning.main

  return (
    <Stack spacing={2}>
      {/* Alert count card */}
      <Paper sx={{ p: 3 }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
          <WarningAmberIcon sx={{ color: 'warning.main', fontSize: 18 }} />
          <SectionLabel>Alert Count</SectionLabel>
        </Stack>
        <Typography variant="h3" sx={{ fontWeight: 700, color: 'text.primary' }}>
          {detection.alerts}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          alerts in the last 24 hours
        </Typography>
      </Paper>

      {/* Asset risk card */}
      <Paper sx={{ p: 3 }}>
        <SectionLabel>Asset Risk Score</SectionLabel>
        <Stack direction="row" alignItems="baseline" spacing={1} sx={{ mb: 1 }}>
          <Typography variant="h3" sx={{ fontWeight: 700, color: riskColor }}>
            {asset.riskScore}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>/ 100</Typography>
        </Stack>
        <LinearProgress
          variant="determinate"
          value={asset.riskScore}
          sx={{
            height: 6,
            borderRadius: 99,
            bgcolor: 'action.disabledBackground',
            '& .MuiLinearProgress-bar': { bgcolor: riskColor, borderRadius: 99 },
          }}
        />
        <Stack direction="row" sx={{ mt: 1.5, flexWrap: 'wrap', gap: 0.5 }}>
          {asset.tags.map((tag) => (
            <Chip key={tag} label={tag} size="small" variant="outlined" sx={{ fontSize: '0.625rem', height: 18 }} />
          ))}
        </Stack>
      </Paper>

      <Button variant="outlined" fullWidth size="small">
        View Full Asset Profile
      </Button>
    </Stack>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function DetectionDetails() {
  return (
    <DetailsTemplate
      header={<DetectionHeader />}
      summary={<DetectionSummary />}
      sections={<DetectionSections />}
    />
  )
}
