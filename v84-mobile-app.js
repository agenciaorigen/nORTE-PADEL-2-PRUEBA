(() => {
  "use strict";

  const mobile = window.matchMedia("(max-width: 768px)");
  const $ = (s, root = document) => root.querySelector(s);

  function buildMobileChrome(){
    if ($("#npMobileAppbar")) return;

    const bar = document.createElement("header");
    bar.id = "npMobileAppbar";
    bar.className = "np-mobile-appbar";
    bar.innerHTML = `
      <a href="#/" class="np-mobile-brand" aria-label="Norte Padel — Inicio">
        <span class="np-mobile-mark"><img src="icon-192.png" alt="" /></span>
        <span class="np-mobile-wordmark"><b>NORTE <span>PADEL</span></b><small>THE CIRCUIT · 2026</small></span>
      </a>
      <span class="np-mobile-live"><i></i>CIRCUIT LIVE</span>
      <div class="np-mobile-actions">
        <button class="np-mobile-action" id="npMobileNotif" type="button" aria-label="Notificaciones">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 13 6 9z"/><path d="M10 19a2 2 0 0 0 4 0"/></svg>
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
      <button class="np-mobile-tab active" data-mobile-view="inicio" type="button" aria-label="Inicio">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="m3 10 9-7 9 7"/><path d="M5 9v11h14V9"/><path d="M9 20v-6h6v6"/></svg><span>Inicio</span>
      </button>
      <button class="np-mobile-tab" data-mobile-view="torneos" type="button" aria-label="Torneos">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3v5a6 6 0 0 0 12 0V3"/><path d="M9 3h6"/><path d="M12 14v7"/><path d="M8 21h8"/></svg><span>Torneos</span>
      </button>
      <button class="np-mobile-tab" data-mobile-view="ranking" type="button" aria-label="Ranking">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M5 20V10"/><path d="M12 20V4"/><path d="M19 20v-7"/></svg><span>Ranking</span>
      </button>
      <button class="np-mobile-tab" data-mobile-view="perfil" type="button" aria-label="Cuenta">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="7" r="3.5"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0"/></svg><span>Cuenta</span>
      </button>`;

    const sheetBackdrop = document.createElement("div");
    sheetBackdrop.id = "npMobileSheetBackdrop";
    sheetBackdrop.className = "np-mobile-sheet-backdrop";

    const sheet = document.createElement("aside");
    sheet.id = "npMobileSheet";
    sheet.className = "np-mobile-sheet";
    sheet.setAttribute("aria-hidden", "true");
    sheet.innerHTML = `
      <div class="np-mobile-sheet-head"><strong>Cuenta</strong><button class="np-mobile-sheet-close" id="npMobileSheetClose" type="button">×</button></div>
      <div class="np-mobile-sheet-grid">
        <button class="np-mobile-sheet-btn" id="npMobileSheetProfile" type="button"><b>Mi perfil</b><span>Datos, foto y disponibilidad</span></button>
        <button class="np-mobile-sheet-btn" id="npMobileSheetNotif" type="button"><b>Notificaciones</b><span>Partidos, resultados y avisos</span></button>
        <button class="np-mobile-sheet-btn admin-only" id="npMobileSheetConfig" type="button"><b>Configuración</b><span>Administración del club</span></button>
        <button class="np-mobile-sheet-btn" id="npMobileSheetInstall" type="button"><b>Instalar app</b><span>Agregá Norte Padel a inicio</span></button>
      </div>`;

    document.body.append(bar, sheetBackdrop, sheet, nav);

    const navAction = (view) => {
      if (typeof window.cambiarVista === "function") {
        window.cambiarVista(view);
      } else {
        const tab = document.querySelector(`.tab[data-view="${view}"]`);
        if (tab) tab.click();
      }
      syncActive(view);
    };

    nav.querySelectorAll("[data-mobile-view]").forEach(btn => {
      btn.addEventListener("click", () => navAction(btn.dataset.mobileView));
    });

    $("#npMobileAccount").addEventListener("click", openSheet);
    $("#npMobileNotif").addEventListener("click", () => {
      const target = $("#btnNotif");
      if (target) target.click();
    });
    $("#npMobileSheetClose").addEventListener("click", closeSheet);
    sheetBackdrop.addEventListener("click", closeSheet);
    $("#npMobileSheetProfile").addEventListener("click", () => { closeSheet(); navAction("perfil"); });
    $("#npMobileSheetNotif").addEventListener("click", () => { closeSheet(); $("#btnNotif")?.click(); });
    $("#npMobileSheetConfig").addEventListener("click", () => {
      closeSheet();
      const cfg = $("#btnConfigTop");
      if (cfg) cfg.click();
      else navAction("admin");
    });
    $("#npMobileSheetInstall").addEventListener("click", () => {
      closeSheet();
      const install = $("#btnInstallApp");
      if (install) install.click();
      else showInstallHint();
    });

    window.addEventListener("hashchange", () => syncFromHash());
    window.addEventListener("popstate", syncFromHash);
    window.addEventListener("resize", updateMobileVisibility, { passive: true });

    syncFromHash();
    updateMobileVisibility();
  }

  function syncActive(view){
    document.querySelectorAll(".np-mobile-tab").forEach(btn => btn.classList.toggle("active", btn.dataset.mobileView === view));
  }

  function syncFromHash(){
    const hash = location.hash.replace(/^#\/?/, "");
    const root = hash.split("/")[0] || "inicio";
    const view = root === "torneo" || root === "torneos" ? "torneos" : root === "ranking" ? "ranking" : root === "perfil" || root === "perfil-jugador" ? "perfil" : "inicio";
    syncActive(view);
  }

  function openSheet(){
    $("#npMobileSheet")?.classList.add("open");
    $("#npMobileSheetBackdrop")?.classList.add("open");
    $("#npMobileSheet")?.setAttribute("aria-hidden", "false");
  }
  function closeSheet(){
    $("#npMobileSheet")?.classList.remove("open");
    $("#npMobileSheetBackdrop")?.classList.remove("open");
    $("#npMobileSheet")?.setAttribute("aria-hidden", "true");
  }

  function showInstallHint(){
    if (window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone) return;
    if (typeof window.toast === "function") window.toast("En iPhone: Compartir → Agregar a pantalla de inicio. En Android, usá Instalar app cuando aparezca el aviso del navegador.");
  }

  function updateMobileVisibility(){
    const isMobile = mobile.matches;
    const bar = $("#npMobileAppbar");
    const nav = $("#npMobileBottom");
    if (bar) bar.setAttribute("aria-hidden", String(!isMobile));
    if (nav) nav.setAttribute("aria-hidden", String(!isMobile));
  }

  function updateMobileUserPhoto(){
    const src = $("#perfilAvatarWrap img")?.src;
    const dot = $("#npMobileUserDot");
    if (!dot || !src) return;
    dot.innerHTML = `<img src="${src}" alt="" />`;
  }

  document.addEventListener("DOMContentLoaded", () => {
    buildMobileChrome();
    setTimeout(updateMobileUserPhoto, 700);
    setInterval(updateMobileUserPhoto, 4000);
  });

  // app-like keyboard/scroll hygiene: keep focus inside overlays and never let
  // touch scrolling on horizontal rails move the page when the gesture is horizontal.
  document.addEventListener("touchstart", e => {
    const rail = e.target.closest?.(".np-match-rail,.sponsor-strip");
    if (rail) rail.style.touchAction = "pan-x pinch-zoom";
  }, { passive: true });
})();
