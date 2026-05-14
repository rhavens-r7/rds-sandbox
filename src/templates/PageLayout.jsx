import React from 'react'
import { Box, useTheme } from '@rapid7/rds'

export const SIDEBAR_WIDTH = 240
export const PANEL_WIDTH   = 360

/**
 * UI Shell — slot-based page scaffold.
 *
 * Slots
 *   banner          (optional) — system alerts, env banners
 *   topNav          (optional) — top application bar
 *   sideNav         (required) — persistent left navigation
 *   pageHeader      (optional) — sticky page-level header
 *   main            (required) — primary scrollable content
 *   panel           (optional) — contextual side panel (right)
 *
 * Behavior
 *   - single primary scroll region (main)
 *   - panel is contextual, not primary navigation
 *   - layout shell persists through loading and error states
 *
 * Responsive
 *   - sideNav width fixed at 240px (collapses to overlay on smDown — host app responsibility)
 *   - panel pushes main content; collapses to Drawer at xs — host app responsibility
 *
 * Accessibility
 *   - landmark regions: header (topNav), nav (sideNav), main, aside (panel)
 */
export default function PageLayout({ banner, topNav, sideNav, pageHeader, main, panel }) {
  const theme = useTheme()

  return (
    <Box
      component="div"
      sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: 'background.default' }}
    >
      {/* Banner slot — optional system/env strip */}
      {banner && (
        <Box role="status" aria-live="polite" sx={{ flexShrink: 0 }}>
          {banner}
        </Box>
      )}

      {/* Top nav slot */}
      {topNav && (
        <Box component="header" sx={{ flexShrink: 0, zIndex: theme.zIndex.appBar }}>
          {topNav}
        </Box>
      )}

      {/* Body row: sideNav + (main + panel) */}
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* Side nav slot */}
        <Box
          component="nav"
          aria-label="Primary navigation"
          sx={{
            width: SIDEBAR_WIDTH,
            flexShrink: 0,
            bgcolor: 'background.paper',
            borderRight: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
          }}
        >
          {sideNav}
        </Box>

        {/* Main + contextual panel */}
        <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

          {/* Main scroll region */}
          <Box
            component="main"
            sx={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}
          >
            {pageHeader}
            {main}
          </Box>

          {/* Contextual panel slot */}
          {panel && (
            <Box
              component="aside"
              aria-label="Contextual panel"
              sx={{
                width: PANEL_WIDTH,
                flexShrink: 0,
                borderLeft: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
                overflowY: 'auto',
              }}
            >
              {panel}
            </Box>
          )}

        </Box>
      </Box>
    </Box>
  )
}
