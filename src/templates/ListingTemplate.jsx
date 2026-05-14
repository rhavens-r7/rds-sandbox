import React from 'react'
import { Box } from '@rapid7/rds'

/**
 * Listing Template — slot-based scaffold for collection management pages.
 *
 * Slots
 *   header        (required) — SectionHeader with title + count + bulk actions
 *   filterBar     (should)   — FilterBar for search + facet filtering
 *   toolbar       (should)   — row-level actions, column picker, density toggle
 *   dataView      (required) — DataGrid, table, or list; receives loading/empty/error state
 *   pagination    (required) — Pagination component below dataView
 *   detailPanel   (may)      — contextual panel; opens on row selection
 *
 * Variants: table | list | gallery
 *
 * States
 *   empty (no data)    — EmptyState with CTA
 *   empty (no results) — EmptyState with clear-filters action
 *   loading            — skeleton rows in dataView
 *   error              — ErrorState with retry
 *
 * Accessibility
 *   - ARIA live region on filterBar result count
 *   - keyboard navigation across rows (DataGrid handles internally)
 */
export default function ListingTemplate({ header, filterBar, toolbar, dataView, pagination, detailPanel }) {
  return (
    <Box sx={{ p: 3 }}>
      {header}

      {filterBar && (
        <Box sx={{ mt: 2 }} role="search" aria-label="Filter detections">
          {filterBar}
        </Box>
      )}

      {toolbar && (
        <Box sx={{ mt: 1.5 }}>
          {toolbar}
        </Box>
      )}

      <Box sx={{ mt: 2 }} aria-live="polite" aria-relevant="additions removals">
        {dataView}
      </Box>

      {pagination && (
        <Box sx={{ mt: 2 }}>
          {pagination}
        </Box>
      )}

      {detailPanel}
    </Box>
  )
}
