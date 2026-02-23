# Specification

## Summary
**Goal:** Fix loading timeout issues preventing pages from loading properly.

**Planned changes:**
- Investigate and fix loading timeout behavior in LoadingTimeout component
- Review backend actor initialization and authentication flow for hanging requests
- Verify React Query hooks properly handle loading, error, and success states in ProductBrowse and AdminProducts pages
- Ensure proper error handling and loading state transitions throughout the application

**User-visible outcome:** Pages load successfully without getting stuck in infinite loading states, with proper error messages displayed when issues occur.
