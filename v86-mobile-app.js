/* NORTE PADEL V86 — final app shell polish */
(function(){
  const $=s=>document.querySelector(s);
  const create=(tag,cls,html)=>{const e=document.createElement(tag); if(cls)e.className=cls; if(html!=null)e.innerHTML=html; return e};
  function ensureMobileShell(){
    if(document.querySelector('.np86-mobilebar')) return;
    const bar=create('header','np86-mobilebar',`<a class="np86-brand" href="#/"><img src="icon-192.png" alt="Norte Padel"><span><b>NORTE <em>PADEL</em></b><small>THE CIRCUIT · 2026</small></span></a><div class="np86-mobile-actions"><button type="button" data-np86="notif" aria-label="Notificaciones">⌁<span id="np86NotifDot"></span></button><button type="button" data-np86="account" aria-label="Cuenta">◎</button></div>`);
    const nav=create('nav','np86-bottom',`<button type="button" data-view="inicio"><span>⌂</span>INICIO</button><button type="button" data-view="torneos"><span>◫</span>TORNEOS</button><button type="button" data-view="ranking"><span>↟</span>RANKING</button><button type="button" data-view="perfil"><span>◯</span>CUENTA</button>`);
    const backdrop=create('div','np86-sheet-backdrop','');
    const sheet=create('section','np86-sheet',`<div class="np86-sheet-handle"></div><div class="np86-sheet-title"><b>CUENTA</b><button type="button" data-np86="close">×</button></div><div class="np86-sheet-grid"><button data-view="perfil"><b>Mi perfil</b><span>Datos y estadísticas</span></button><button data-np86="notif"><b>Notificaciones</b><span>Partidos y novedades</span></button><button data-view="torneos"><b>Mis torneos</b><span>Competencias activas</span></button><button data-view="ranking"><b>Ranking</b><span>Clasificación</span></button><button data-view="admin"><b>Configuración</b><span>Solo administración</span></button><button data-np86="install"><b>Instalar app</b><span>Acceso rápido al circuito</span></button></div>`);
    document.body.append(bar,backdrop,sheet,nav);
    const close=()=>{sheet.classList.remove('open');backdrop.classList.remove('open');document.body.classList.remove('np86-sheet-open')};
    const open=()=>{sheet.classList.add('open');backdrop.classList.add('open');document.body.classList.add('np86-sheet-open')};
    document.addEventListener('click',e=>{
      const v=e.target.closest('[data-view]');
      if(v){ const name=v.dataset.view; if(typeof window.cambiarVista==='function') window.cambiarVista(name); else location.hash=name==='inicio'?'#/':'#/'+name; close(); setTimeout(()=>updateActive(),20); return; }
      const a=e.target.closest('[data-np86]'); if(!a)return;
      if(a.dataset.np86==='account') open();
      if(a.dataset.np86==='close') close();
      if(a.dataset.np86==='notif'){ close(); const n=$('#btnNotif'); if(n)n.click(); }
      if(a.dataset.np86==='install'){ close(); const b=$('#btnInstallApp'); if(b && getComputedStyle(b).display!=='none') b.click(); }
    });
    backdrop.addEventListener('click',close);
    window.addEventListener('hashchange',()=>setTimeout(updateActive,30));
    updateActive();
  }
  function updateActive(){
    const hash=(location.hash||'#/').slice(2).split('/')[0]||'inicio';
    document.querySelectorAll('.np86-bottom [data-view]').forEach(b=>b.classList.toggle('active',(b.dataset.view||'')===hash));
  }
  function injectCss(){
    if(document.getElementById('np86-inline'))return;
    const s=document.createElement('style'); s.id='np86-inline'; s.textContent=`
      .np86-mobilebar,.np86-bottom,.np86-sheet,.np86-sheet-backdrop{display:none}
      @media(max-width:700px){
        .np86-mobilebar{display:flex;position:fixed;top:0;left:0;right:0;z-index:1300;height:calc(64px + env(safe-area-inset-top));padding:env(safe-area-inset-top) 13px 0;align-items:center;justify-content:space-between;background:rgba(5,7,6,.94);backdrop-filter:blur(20px);border-bottom:1px solid rgba(255,255,255,.08)}
        .np86-brand{display:flex;gap:9px;align-items:center;color:#fff;text-decoration:none}.np86-brand img{width:34px;height:34px;border-radius:50%;object-fit:contain}.np86-brand b{font:900 13px/1 Manrope,sans-serif;letter-spacing:.13em}.np86-brand em{color:#7cf63e;font-style:normal}.np86-brand small{display:block;margin-top:4px;font:700 6px/1 Manrope,sans-serif;letter-spacing:.24em;color:#829087}.np86-mobile-actions{display:flex;gap:6px}.np86-mobile-actions button{width:38px;height:38px;border-radius:50%;border:1px solid rgba(255,255,255,.10);background:rgba(255,255,255,.02);color:#fff;font:700 19px/1 Manrope,sans-serif}.np86-mobile-actions button:active{transform:scale(.96)}
        .np86-bottom{display:grid;grid-template-columns:repeat(4,1fr);position:fixed;left:8px;right:8px;bottom:calc(8px + env(safe-area-inset-bottom));z-index:1290;gap:3px;padding:5px;border:1px solid rgba(255,255,255,.11);border-radius:20px;background:rgba(7,10,9,.96);backdrop-filter:blur(20px);box-shadow:0 20px 60px rgba(0,0,0,.52)}.np86-bottom button{min-height:54px;border:0;border-radius:15px;background:transparent;color:#7d8982;font:800 7px/1 Manrope,sans-serif;letter-spacing:.12em}.np86-bottom button span{display:block;font-size:18px;margin-bottom:3px}.np86-bottom button.active{background:rgba(124,246,62,.10);color:#fff}.np86-bottom button.active span{color:#7cf63e}
        .np86-sheet-backdrop{position:fixed;inset:0;z-index:1400;background:rgba(0,0,0,.6);opacity:0;pointer-events:none;transition:opacity .2s}.np86-sheet-backdrop.open{display:block;opacity:1;pointer-events:auto}.np86-sheet{position:fixed;left:8px;right:8px;bottom:calc(8px + env(safe-area-inset-bottom));z-index:1410;transform:translateY(110%);transition:transform .26s cubic-bezier(.22,.8,.2,1);background:#0a100e;border:1px solid rgba(255,255,255,.10);border-radius:24px;padding:10px;max-height:80dvh;overflow:auto;box-shadow:0 32px 90px rgba(0,0,0,.65)}.np86-sheet.open{display:block;transform:translateY(0)}.np86-sheet-handle{width:40px;height:4px;margin:3px auto 9px;border-radius:4px;background:rgba(255,255,255,.16)}.np86-sheet-title{display:flex;align-items:center;justify-content:space-between;padding:4px 4px 11px}.np86-sheet-title b{font:900 12px/1 Manrope,sans-serif;letter-spacing:.14em}.np86-sheet-title button{width:32px;height:32px;border-radius:50%;background:transparent;border:1px solid rgba(255,255,255,.1);color:#fff;font-size:18px}.np86-sheet-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}.np86-sheet-grid button{min-height:68px;text-align:left;padding:11px;border:1px solid rgba(255,255,255,.09);border-radius:16px;background:#0d1512;color:#fff}.np86-sheet-grid b{display:block;font:800 10px/1.1 Manrope,sans-serif;letter-spacing:.06em;text-transform:uppercase}.np86-sheet-grid span{display:block;margin-top:6px;font:600 9px/1.2 Manrope,sans-serif;color:#7e8a83}.np86-sheet-open{overflow:hidden}
        .np-home,.np-view{padding-top:calc(64px + env(safe-area-inset-top))!important}
      }
    `; document.head.appendChild(s);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>{injectCss();ensureMobileShell()}); else {injectCss();ensureMobileShell()}
})();
