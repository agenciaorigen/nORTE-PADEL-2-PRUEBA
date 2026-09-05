# V82 — Tournament Operations / UX direction

The tournament organizer now follows an **Order of Play** model: date selector, court columns, time rows, explicit court availability and drag-and-drop match placement. This pattern mirrors modern tournament tools where the schedule is a visual court grid and matches can be dragged between slots.

References reviewed during design research:
- Universal Tennis Order of Play: visual drag-and-drop court grid.
- Bracket: drag-and-drop scheduling across courts/times.
- SportSoftware / Letzplay: tournament workspaces combining schedules, brackets, players and results.

No Supabase schema, RPC or matching algorithm is changed in this V82 iteration.
