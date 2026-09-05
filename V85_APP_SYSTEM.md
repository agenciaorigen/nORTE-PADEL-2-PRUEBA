# Norte Padel V85 — Native App System

V85 upgrades the PWA shell into a native-feeling mobile experience without changing Supabase, RPCs, schema, ranking logic, tournament matching, inscriptions, availability or admin data models.

## App shell
- Fixed translucent top bar with status, notification badge and account access.
- Fixed bottom navigation: Inicio / Torneos / Ranking / Cuenta.
- Safe-area support for iOS/Android.
- Native-feeling account sheet with profile, notifications, tournament enrollment, availability, configuration and installation.
- Screen transitions and route-aware active state.
- Haptic feedback where supported.
- Online/offline status in the app bar.
- Install prompt using `beforeinstallprompt` plus iOS instructions.

## PWA
- Standalone-first display mode.
- Portrait-primary orientation.
- PWA shortcuts to Ranking and Torneos.
- Service worker v85 with stale-while-revalidate behavior for same-origin static resources.
