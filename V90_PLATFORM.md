# NORTE PADEL V90 — PLATFORM

Nueva capa frontend de producto. Mantiene Supabase, RPCs, datos, matching e IDs funcionales existentes.

## Experiencias
- Public: Home, Torneos, Ranking, perfiles y páginas de evento.
- Player App: navegación inferior, cuenta, notificaciones, safe-area y composición móvil propia.
- Tournament Ops: administración de un torneo, Order of Play, días/horarios/canchas, partidos y resultados.
- Club Config: configuración general separada de la operación del torneo.

## Cambios clave
- App shell único y navegación desktop fija arriba.
- Mobile app shell separado.
- Event Page usa `flyer_url` real del torneo como arte principal.
- Ranking con foto y jerarquía deportiva.
- Sponsor wall en movimiento.
- Match rail de un partido por pantalla.
- Order of Play con franjas visuales de 30 minutos.
- Arquitectura CSS V90 limpia separada de las capas V80/V82/V83/V85/V86.
- Service Worker corregido y cache V90.
