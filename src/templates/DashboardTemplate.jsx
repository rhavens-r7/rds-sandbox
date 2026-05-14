import React from 'react'
import { Box, Grid } from '@rapid7/rds'

/**
 * Dashboard Template — slot-based scaffold for overview/summary pages.
 *
 * Slots
 *   header      (required) — SectionHeader with title + optional actions
 *   filterBar   (should)   — global time range or scope filter
 *   kpiRow      (should)   — primary metric strip, rendered full-width in Grid
 *   cards       (required) — data visualization cards, rendered as Grid items
 *
 * Variants: standard | customizable
 *
 * States: loading (cards receive isLoading), empty (EmptyState in card slot), error
 */
export default function DashboardTemplate({ header, filterBar, kpiRow, cards }) {
  return (
    <Box sx={{ p: 3 }}>
      {header}

      {filterBar && (
        <Box sx={{ mt: 2 }}>
          {filterBar}
        </Box>
      )}

      <Grid container spacing={2} sx={{ mt: 1 }}>
        {kpiRow && (
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              {kpiRow}
            </Box>
          </Grid>
        )}

        {cards}
      </Grid>
    </Box>
  )
}
