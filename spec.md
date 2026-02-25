# Specification

## Summary
**Goal:** Fix image loading issues on the ProductBrowse page so all content loads reliably without stuck spinners or timeout states.

**Planned changes:**
- Fix the `LoadingTimeout` component to avoid premature timeout alerts under normal conditions
- Fix the `useImageLoader` hook so retry logic works correctly and falls back to a placeholder without freezing the UI
- Ensure images in `SwipeableGallery`, `AttackOnTitanGallery`, `WatchProductSection`, and `MeeshoProductSection` load correctly
- Fix any lazy-loading mechanisms that cause indefinite loading states on the ProductBrowse page

**User-visible outcome:** The ProductBrowse page loads all product images, gallery images, and promotional sections without hanging spinners or stuck loading states.
