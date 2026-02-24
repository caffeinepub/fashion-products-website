# Specification

## Summary
**Goal:** Fix the application loading issue preventing proper initialization and data display.

**Planned changes:**
- Investigate and resolve infinite loading states in ProductBrowse.tsx and SwipeableGallery.tsx
- Fix data-fetching hooks to prevent queries from hanging in pending states
- Ensure LoadingTimeout component properly triggers and provides retry functionality
- Verify backend actor initialization completes successfully before dependent queries execute
- Optimize useQueries hooks to eliminate re-render loops and cascading query invalidations

**User-visible outcome:** The application loads successfully, displays product data without hanging, and shows appropriate error messages with retry options when loading issues occur.
