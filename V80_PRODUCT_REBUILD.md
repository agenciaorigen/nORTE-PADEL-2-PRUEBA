NORTE PADEL V80 — PRODUCT REBUILD

Scope
- Visual/product redesign over existing frontend.
- No database/schema changes.
- No Supabase RPC changes.
- No matching.js changes.
- Existing data IDs and major JS handlers preserved.

Changes
- Full-bleed editorial home and distinct route screens.
- Ranking with real player-photo rendering and stronger hierarchy.
- Tournament index as an event/poster gallery.
- Tournament event view and context navigation styling.
- Registration / profile / player profile / admin visual system.
- Sponsors treated as dark sponsor wall.
- PWA/cache version bumped to V80.
- Deterministic bracket order: Zona -> Dieciseisavos -> Octavos -> Cuartos -> Semifinal -> Final.
- prefers-reduced-motion + focus-visible.

Functional safety
- Existing Supabase contract is preserved.
- Existing IDs used by app.js are intentionally retained.
