NORTE PADEL V92 — FINAL VISUAL QA

Purpose
- Restore the intended V91/V90 design direction without reintroducing stale layered CSS behavior.
- Keep Supabase, schema, RPCs, matching and tournament data untouched.

Key changes
- One authoritative visual layer: v92-final.css.
- Desktop app shell: fixed header + fixed top navigation.
- Mobile app shell: top bar + bottom navigation.
- One full-width next-match card at a time.
- Four results on desktop, one column on mobile.
- Sponsors as larger full-color wall items.
- Tournament flyer rendered as a real image in event pages.
- Ranking photo-led with real player photo slots and consistent 5-column desktop grid.
- Tournament Ops visually separated from global configuration.
- Order of Play is horizontal, date/time/court oriented, and scrollable on mobile.
- Service worker switched to network-first for HTML/CSS/JS to reduce stale GitHub Pages assets.
- One-time cleanup script removes stale Norte Padel service-worker caches in the current browser session.
