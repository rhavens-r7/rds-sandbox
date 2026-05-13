import React from 'react'
import {
  Box, Typography, Paper, Grid, Chip, Divider,
  Stack, Button, LinearProgress, useTheme,
} from '@rapid7/rds'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import BugReportIcon from '@mui/icons-material/BugReport'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import { CONTENT_MAX_WIDTH } from '../App'
import detections from '../mock-data/detections.json'
import assets from '../mock-data/assets.json'

const detection = detections.find((d) => d.severity === 'critical') ?? detections[0]
const asset     = assets.find((a) => a.hostname === detection.asset) ?? assets[0]

function DetailRow({ label, value }) {
  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{ py: 1.25, borderBottom: '1px solid', borderColor: 'divider' }}
    >
      <Typography variant="body2" sx={{ color: 'text.secondary', width: 160, flexShrink: 0 }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.primary', wordBreak: 'break-all' }}>
        {value}
      </Typography>
    </Stack>
  )
}

function SectionLabel({ children }) {
  return (
    <Typography
      variant="caption"
      sx={{ mb: 2, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, display: 'block' }}
    >
      {children}
    </Typography>
  )
}

export default function DetectionDetails() {
  const theme = useTheme()
  const statusPalette = theme.palette.status
  const severityColor = statusPalette[detection.severity]?.main ?? theme.palette.error.main
  const severityBg    = statusPalette[detection.severity]?.states?.selected ?? theme.palette.error.states?.selected

  const riskColor = asset.riskScore >= 80
    ? theme.palette.error.main
    : theme.palette.warning.main
  const riskBarColor = asset.riskScore >= 80
    ? theme.palette.error.main
    : theme.palette.warning.main

  return (
    <Box sx={{ p: 3, maxWidth: CONTENT_MAX_WIDTH, mx: 'auto' }}>
      {/* Back nav */}
      <Button startIcon={<ArrowBackIcon />} size="small" sx={{ mb: 2, color: 'text.secondary' }}>
        Back to Detections
      </Button>

      {/* Header */}
      <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ mb: 3 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 1,
            bgcolor: severityBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <BugReportIcon sx={{ color: severityColor, fontSize: 20 }} />
        </Box>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary' }}>
            {detection.rule}
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
            <Chip
              label={detection.severity.toUpperCase()}
              size="small"
              sx={{
                bgcolor: severityBg,
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
            <Typography variant="caption" sx={{ color: 'text.disabled' }}>
              {detection.id}
            </Typography>
          </Stack>
        </Box>
        <Box sx={{ ml: 'auto !important', display: 'flex', gap: 1 }}>
          <Button variant="outlined" size="small" color="error">
            Close Detection
          </Button>
          <Button variant="contained" size="small">
            Investigate
          </Button>
        </Box>
      </Stack>

      <Grid container spacing={3}>
        {/* Details panel */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <SectionLabel>Detection Details</SectionLabel>
            <DetailRow label="Detection ID"    value={detection.id} />
            <DetailRow label="Rule"            value={detection.rule} />
            <DetailRow label="Asset"           value={detection.asset} />
            <DetailRow label="First Seen"      value={new Date(detection.firstSeen).toLocaleString()} />
            <DetailRow label="Last Seen"       value={new Date(detection.lastSeen).toLocaleString()} />
            <DetailRow label="IP Address"      value={asset.ip} />
            <DetailRow label="Operating System" value={asset.os} />
          </Paper>
        </Grid>

        {/* Right column */}
        <Grid item xs={12} md={4}>
          <Stack spacing={2}>
            {/* Alert count */}
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

            {/* Asset risk */}
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
                  '& .MuiLinearProgress-bar': { bgcolor: riskBarColor, borderRadius: 99 },
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
        </Grid>
      </Grid>
    </Box>
  )
}
