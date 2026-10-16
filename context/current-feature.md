# Current Feature

Dashboard mock data: a single importable data file for the current user, item types, collections, and items.

## Status

Completed

## Goals

- Add `src/lib/mock-data.ts` with simple typed data and no helper methods.
- Use the dashboard screenshot as the reference for sample content.

## Notes

Counts should be derived from the sample items rather than copying the screenshot's placeholder totals.

## History

- 2026-10-16: Added typed dashboard mock data. Production build and ESLint passed. No UI changes were needed.
