/* NORTE PADEL V85 — Native App Layer
   Frontend-only app shell. Supabase, RPCs and competition logic remain untouched. */
(() => {
  "use strict";

  const mq = window.matchMedia("(max-width: 768px)");
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const scrollByView = new Map();
  let deferredInstallPrompt = null;
  let sheetOpen = false;

  function rootFromHash() {
    const hash = location.hash.replace(/^#\/?/, "");
    return (hash.split("/")[0] || "inicio");
  }
  function mobileViewFromRoot(root) {
    if (root === "torneos" || root === "torneo") return "torneos";
    if (root === "ranking") return "ranking";
    if (root === "perfil" || root === "perfil-jugador" || root === "admin" || root === "config" || root === "jugar") return "perfil";
    return "inicio";
  }
  function route(path) {
    if (typeof window.navegarA === "function") window.navegarA(path);
    else location.hash = path;
  }

  function haptic(ms = 8) {
    try { navigator.vibrate?.(ms); } catch (_) {}
  }

  function captureScroll() {
    scrollByView.set(mobileViewFromRoot(rootFromHash()), window.scrollY || 0);
  }

  function restoreScroll(view) {
    const y = scrollByView.get(view) || 0;
    requestAnimationFrame(() => window.scrollTo({ top: y, behavior: "instant" }));
  }

  function syncTabs(view) {
    $$(".np-mobile-tab").forEach(btn => {
      const active = btn.dataset.mobileView === view;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-current", active ? "page" : "false");
    });
  }

  function openSheet() {
    const sheet = $("#npMobileSheet");
    const backdrop = $("#npMobileSheetBackdrop");
    if (!sheet || !backdrop) return;
    sheet.classList.add("open");
    backdrop.classList.add("open");
    sheet.setAttribute("aria-hidden", "false");
    document.body.classList.add("np-mobile-sheet-open");
    sheetOpen = true;
    haptic(10);
    $("#npMobileSheetClose")?.focus({ preventScroll: true });
  }

  function closeSheet() {
    const sheet = $("#npMobileSheet");
    const backdrop = $("#npMobileSheetBackdrop");
    if (!sheet || !backdrop) return;
    sheet.classList.remove("open");
    backdrop.classList.remove("open");
    sheet.setAttribute("aria-hidden", "true");
    document.body.classList.remove("np-mobile-sheet-open");
    sheetOpen = false;
  }

  function setInstallState() {
    const btn = $("#btnInstallApp");
    const note = $("#appInstallNote");
    const standalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone;
    if (standalone) {
      if (btn) btn.style.display = "none";
      if (note) note.textContent = "Norte Padel está instalada en este dispositivo.";
      $("#npMobileSheetInstall")?.classList.add("is-installed");
      return;
    }
    if (deferredInstallPrompt && btn) {
      btn.style.display = "inline-flex";
      if (note) note.textContent = "Instalación rápida desde este dispositivo.";
    }
  }

  async function promptInstall() {
    if (window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone) return;
    if (!deferredInstallPrompt) {
      const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
      const text = isIOS
        ? "En iPhone/iPad: Compartir → Agregar a pantalla de inicio."
        : "Usá el menú del navegador y elegí Instalar app / Agregar a pantalla de inicio.";
      window.toast?.(text);
      return;
    }
    try {
      deferredInstallPrompt.prompt();
      await deferredInstallPrompt.userChoice;
    } catch (_) {}
    deferredInstallPrompt = null;
    setInstallState();
  }

  function updateOnlineState() {
    const live = $("#npMobileLiveState");
    if (!live) return;
    const online = navigator.onLine;
    live.classList.toggle("offline", !online);
    live.innerHTML = `<i></i>${online ? "CIRCUIT LIVE" : "SIN CONEXIÓN"}`;
  }

  function buildShell() {
    if (mq.matches === false || $("#npMobileAppbar")) return;

    const bar = document.createElement("header");
    bar.id = "npMobileAppbar";
    bar.className = "np-mobile-appbar";
    bar.innerHTML = `
      <a href="#/" class="np-mobile-brand" aria-label="Norte Padel — Inicio">
        <span class="np-mobile-mark"><img src="icon-192.png" alt="" /></span>
        <span class="np-mobile-wordmark"><b>NORTE <span>PADEL</span></b><small>THE CIRCUIT · 2026</small></span>
      </a>
      <button class="np-mobile-live" id="npMobileLiveState" type="button" aria-label="Estado de conexión"><i></i>CIRCUIT LIVE</button>
      <div class="np-mobile-actions">
        <button class="np-mobile-action" id="npMobileNotif" type="button" aria-label="Notificaciones">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 13 6 9z"/><path d="M10 19a2 2 0 0 0 4 0"/></svg><span class="np-mobile-badge" id="npMobileNotifBadge"></span>
        </button>
        <button class="np-mobile-action" id="npMobileAccount" type="button" aria-label="Cuenta">
          <span class="np-mobile-user-dot" id="npMobileUserDot"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.3"/><path d="M5 20c0-3.6 3.1-6.5 7-6.5s7 2.9 7 6.5"/></svg></span>
        </button>
      </div>`;

    const nav = document.createElement("nav");
    nav.id = "npMobileBottom";
    nav.className = "np-mobile-bottom";
    nav.setAttribute("aria-label", "Navegación principal");
    nav.innerHTML = `
      <button class="np-mobile-tab active" data-mobile-view="inicio" type="button"><span class="np-mobile-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m3 10 9-7 9 7"/><path d="M5 9v11h14V9"/><path d="M9 20v-6h6v6"/></svg></span><span>Inicio</span></button>
      <button class="np-mobile-tab" data-mobile-view="torneos" type="button"><span class="np-mobile-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M6 3v5a6 6 0 0 0 12 0V3"/><path d="M9 3h6"/><path d="M12 14v7"/><path d="M8 21h8"/></svg></span><span>Torneos</span></button>
      <button class="np-mobile-tab" data-mobile-view="ranking" type="button"><span class="np-mobile-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 20V10"/><path d="M12 20V4"/><path d="M19 20v-7"/></svg></span><span>Ranking</span></button>
      <button class="np-mobile-tab" data-mobile-view="perfil" type="button"><span class="np-mobile-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="7" r="3.5"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0"/></svg></span><span>Cuenta</span></button>`;

    const backdrop = document.createElement("div");
    backdrop.id = "npMobileSheetBackdrop";
    backdrop.className = "np-mobile-sheet-backdrop";

    const sheet = document.createElement("aside");
    sheet.id = "npMobileSheet";
    sheet.className = "np-mobile-sheet";
    sheet.setAttribute("aria-hidden", "true");
    sheet.setAttribute("role", "dialog");
    sheet.setAttribute("aria-label", "Cuenta");
    sheet.innerHTML = `
      <div class="np-mobile-sheet-handle"></div>
      <div class="np-mobile-sheet-head"><div><strong>MI CUENTA</strong><small>Tu espacio dentro del circuito</small></div><button class="np-mobile-sheet-close" id="npMobileSheetClose" type="button" aria-label="Cerrar">×</button></div>
      <div class="np-mobile-account-summary" id="npMobileAccountSummary"><span class="np-mobile-account-avatar" id="npMobileAccountAvatar"></span><div><strong id="npMobileAccountName">Invitado</strong><span id="npMobileAccountRole">Ingresá para competir</span></div></div>
      <div class="np-mobile-sheet-grid">
        <button class="np-mobile-sheet-btn" id="npMobileSheetProfile" type="button"><b>Mi perfil</b><span>Perfil, foto y datos</span></button>
        <button class="np-mobile-sheet-btn" id="npMobileSheetNotif" type="button"><b>Notificaciones</b><span>Partidos, resultados y avisos</span></button>
        <button class="np-mobile-sheet-btn" id="npMobileSheetMyTournament" type="button"><b>Mi inscripción</b><span>Tu competencia actual</span></button>
        <button class="np-mobile-sheet-btn" id="npMobileSheetAvailability" type="button"><b>Disponibilidad</b><span>Horarios que no podés jugar</span></button>
        <button class="np-mobile-sheet-btn admin-only" id="npMobileSheetConfig" type="button"><b>Configuración</b><span>Administración general</span></button>
        <button class="np-mobile-sheet-btn" id="npMobileSheetInstall" type="button"><b>Instalar app</b><span>Acceso directo al circuito</span></button>
      </div>`;

    document.body.append(bar, nav, backdrop, sheet);

    $$(".np-mobile-tab").forEach(btn => btn.addEventListener("click", () => {
      const current = mobileViewFromRoot(rootFromHash());
      scrollByView.set(current, window.scrollY || 0);
      haptic(8);
      const target = btn.dataset.mobileView;
      const routes = { inicio: "/", torneos: "/torneos", ranking: "/ranking", perfil: "/perfil" };
      route(routes[target]);
      syncTabs(target);
      if (target !== current) restoreScroll(target);
    }));

    $("#npMobileAccount")?.addEventListener("click", openSheet);
    $("#npMobileNotif")?.addEventListener("click", () => { haptic(8); $("#btnNotif")?.click(); });
    $("#npMobileLiveState")?.addEventListener("click", () => { if (!navigator.onLine) window.toast?.("Sin conexión. Los datos nuevos se actualizarán cuando vuelvas a estar online."); });
    $("#npMobileSheetClose")?.addEventListener("click", closeSheet);
    backdrop.addEventListener("click", closeSheet);
    sheet.addEventListener("click", e => {
      const btn = e.target.closest("button");
      if (!btn) return;
      haptic(6);
      if (btn.id === "npMobileSheetProfile") { closeSheet(); route("/perfil"); }
      else if (btn.id === "npMobileSheetNotif") { closeSheet(); $("#btnNotif")?.click(); }
      else if (btn.id === "npMobileSheetMyTournament") {
        closeSheet();
        const id = window.torneoActualId || null;
        if (id) route(`/torneo/${id}/mi-inscripcion`); else route("/torneos");
      }
      else if (btn.id === "npMobileSheetAvailability") {
        closeSheet();
        const id = window.torneoActualId || null;
        if (id) route(`/torneo/${id}/mi-disponibilidad`); else route("/perfil");
      }
      else if (btn.id === "npMobileSheetConfig") { closeSheet(); $("#btnConfigTop")?.click(); }
      else if (btn.id === "npMobileSheetInstall") { promptInstall(); }
    });

    document.addEventListener("keydown", e => { if (e.key === "Escape" && sheetOpen) closeSheet(); });
    window.addEventListener("online", updateOnlineState);
    window.addEventListener("offline", updateOnlineState);
    window.addEventListener("beforeinstallprompt", e => { e.preventDefault(); deferredInstallPrompt = e; setInstallState(); });
    window.addEventListener("appinstalled", () => { deferredInstallPrompt = null; setInstallState(); window.toast?.("Norte Padel quedó instalada."); });

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("sw.js").catch(() => {});
    }

    syncTabs(mobileViewFromRoot(rootFromHash()));
    updateOnlineState();
    updateMobileUser();
    setInstallState();
  }

  function updateMobileUser() {
    const sourceImg = $("#perfilAvatarWrap img");
    const avatar = $("#npMobileUserDot");
    const accountAvatar = $("#npMobileAccountAvatar");
    const name = $("#perfilNombreCorto");
    const fullName = name?.textContent?.trim();
    if (sourceImg?.src) {
      if (avatar) avatar.innerHTML = `<img src="${sourceImg.src}" alt="" />`;
      if (accountAvatar) accountAvatar.innerHTML = `<img src="${sourceImg.src}" alt="" />`;
    }
    if (fullName) {
      $("#npMobileAccountName")?.replaceChildren(document.createTextNode(fullName));
      $("#npMobileAccountRole")?.replaceChildren(document.createTextNode("Jugador/a de Norte Padel"));
    }
    const count = $("#notifCount")?.textContent?.trim();
    const badge = $("#npMobileNotifBadge");
    if (badge) {
      badge.textContent = count || "";
      badge.style.display = count ? "grid" : "none";
    }
  }

  function enhanceMobileInstallButton() {
    const btn = $("#btnInstallApp");
    if (!btn || btn.dataset.v85Bound) return;
    btn.dataset.v85Bound = "1";
    btn.addEventListener("click", promptInstall);
  }

  document.addEventListener("DOMContentLoaded", () => {
    buildShell();
    enhanceMobileInstallButton();
    const interval = setInterval(() => {
      if (!mq.matches) return;
      updateMobileUser();
      setInstallState();
    }, 2500);
    window.addEventListener("beforeunload", () => clearInterval(interval), { once: true });
  });

  window.addEventListener("hashchange", () => {
    if (!mq.matches) return;
    const view = mobileViewFromRoot(rootFromHash());
    syncTabs(view);
    requestAnimationFrame(updateMobileUser);
  });
})();
