import React, { useState } from 'react'
import {
  Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText,
  Typography, Divider, Stack, ToggleButtonGroup, ToggleButton,
  RDSThemeProvider, CssBaseline,
} from '@rapid7/rds'
import DashboardIcon from '@mui/icons-material/Dashboard'
import BugReportIcon from '@mui/icons-material/BugReport'
import ArticleIcon from '@mui/icons-material/Article'
import SecurityIcon from '@mui/icons-material/Security'

import SecurityDashboard from './templates/SecurityDashboard'
import DetectionListing from './templates/DetectionListing'
import DetectionDetails from './templates/DetectionDetails'
import CommentOverlay from './components/CommentOverlay'

export const SIDEBAR_WIDTH = 240
export const CONTENT_MAX_WIDTH = 1280

const PAGES = [
  { id: 'dashboard',         label: 'Dashboard',         icon: <DashboardIcon />, component: <SecurityDashboard /> },
  { id: 'detections',        label: 'Detections',        icon: <BugReportIcon />, component: <DetectionListing /> },
  { id: 'detection-details', label: 'Detection Details', icon: <ArticleIcon />,   component: <DetectionDetails /> },
]

const THEMES = [
  { brand: 'Original', mode: 'dark',  label: 'Original Dark' },
  { brand: 'Original', mode: 'light', label: 'Original Light' },
  { brand: 'Callisto', mode: 'dark',  label: 'Callisto Dark' },
  { brand: 'Callisto', mode: 'light', label: 'Callisto Light' },
]

function ThemeToggle({ value, onChange }) {
  return (
    <Box sx={{ px: 1.5, pb: 2 }}>
      <Typography
        variant="caption"
        sx={{ color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, display: 'block', mb: 1 }}
      >
        Theme
      </Typography>
      <ToggleButtonGroup
        value={value}
        exclusive
        onChange={(_, val) => val && onChange(val)}
        size="small"
        orientation="vertical"
        fullWidth
        sx={{ gap: 0.25 }}
      >
        {THEMES.map(({ brand, mode, label }) => {
          const key = `${brand}:${mode}`
          return (
            <ToggleButton
              key={key}
              value={key}
              sx={{
                justifyContent: 'flex-start',
                px: 1.5,
                py: 0.5,
                fontSize: '0.75rem',
                fontWeight: 500,
                textTransform: 'none',
                border: '1px solid',
                borderColor: 'divider',
                '&.Mui-selected': {
                  bgcolor: 'action.selected',
                  color: 'primary.main',
                  borderColor: 'primary.main',
                  fontWeight: 700,
                  '&:hover': { bgcolor: 'action.selected' },
                },
              }}
            >
              {label}
            </ToggleButton>
          )
        })}
      </ToggleButtonGroup>
    </Box>
  )
}

function AppShell({ activePage, setActivePage, themeKey, setThemeKey }) {
  const current = PAGES.find((p) => p.id === activePage)

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: SIDEBAR_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: SIDEBAR_WIDTH,
            boxSizing: 'border-box',
            bgcolor: 'background.paper',
            borderRight: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        {/* Logo */}
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ px: 2, py: 2 }}>
          <SecurityIcon sx={{ color: 'primary.main', fontSize: 22 }} />
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary', lineHeight: 1.2 }}>
              RDS Sandbox
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Rapid7 Design System
            </Typography>
          </Box>
        </Stack>

        <Divider />

        <Typography
          variant="caption"
          sx={{ px: 2, pt: 2, pb: 0.5, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}
        >
          Templates
        </Typography>

        <List dense disablePadding sx={{ px: 1, flexGrow: 1 }}>
          {PAGES.map((page) => (
            <ListItemButton
              key={page.id}
              selected={activePage === page.id}
              onClick={() => setActivePage(page.id)}
              sx={{
                borderRadius: 1,
                mb: 0.25,
                '&.Mui-selected': {
                  bgcolor: 'action.selected',
                  '& .MuiListItemIcon-root': { color: 'primary.main' },
                  '& .MuiListItemText-primary': { color: 'primary.main', fontWeight: 600 },
                  '&:hover': { bgcolor: 'action.selected' },
                },
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              <ListItemIcon sx={{ minWidth: 32, color: 'text.secondary', '& svg': { fontSize: 18 } }}>
                {page.icon}
              </ListItemIcon>
              <ListItemText
                primary={page.label}
                primaryTypographyProps={{ variant: 'body2', color: 'text.primary' }}
              />
            </ListItemButton>
          ))}
        </List>

        <Divider sx={{ mt: 1 }} />

        <ThemeToggle value={themeKey} onChange={setThemeKey} />
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: 'background.default', overflow: 'auto', position: 'relative' }}>
        {current?.component}
      </Box>

      <CommentOverlay page={activePage} />
    </Box>
  )
}

export default function App() {
  const [activePage, setActivePage] = useState('dashboard')
  const [themeKey, setThemeKey] = useState('Original:dark')

  const [brandName, themeMode] = themeKey.split(':')

  return (
    <RDSThemeProvider brandName={brandName} themeMode={themeMode}>
      <CssBaseline />
      <AppShell
        activePage={activePage}
        setActivePage={setActivePage}
        themeKey={themeKey}
        setThemeKey={setThemeKey}
      />
    </RDSThemeProvider>
  )
}
