import React from 'react'
import { Box, Grid } from '@rapid7/rds'

/**
 * Details Template — slot-based scaffold for single-record inspection pages.
 *
 * Slots
 *   header    (required) — DetailsPageHeader: breadcrumbs, title, tags, attribute strip, actions
 *   summary   (required) — primary data panel; key attributes rendered as Attribute pairs
 *   sections  (required) — secondary cards / panels; additional context, related data
 *   panel     (may)      — contextual side panel; timeline, related events, AI insights
 *
 * Variants: panel | split | page
 *
 * Layout
 *   - summary takes 8/12 columns on md+, full width on xs
 *   - sections take 4/12 columns on md+, full width on xs
 *   - panel renders as aside at PANEL_WIDTH (360px) when provided
 */
export default function DetailsTemplate({ header, summary, sections, panel }) {
  return (
    <Box sx={{ p: 3 }}>
      {header}

      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} md={8}>
          <Box>{summary}</Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Box>{sections}</Box>
        </Grid>
      </Grid>

      {panel}
    </Box>
  )
}
