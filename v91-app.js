/* NORTE PADEL V91 — Final App Shell / routing safety / tournament media.
   Presentation only: Supabase, data, RPCs and existing app logic remain untouched. */
(function(){
  'use strict';
  const $=(s)=>document.querySelector(s);
  const isMobile=()=>window.matchMedia('(max-width:760px)').matches;
  const routeRoot=()=>((location.hash||'#/').replace(/^#\/?/,'').split('/')[0]||'inicio');

  function syncShell(){
    const r=routeRoot();
    document.body.dataset.n91Route=r;
    document.body.classList.toggle('n91-mobile',isMobile());
    document.body.classList.toggle('n91-admin',r==='admin'||r==='config');
    document.body.classList.toggle('n91-tournament',r==='torneo');
    updateActive();
  }

  function updateActive(){
    const r=routeRoot();
    document.querySelectorAll('#mainNav .tab[data-view]').forEach(btn=>{
      const v=btn.dataset.view;
      btn.classList.toggle('active',v===r || (r==='perfil-jugador' && v==='ranking'));
    });
    document.querySelectorAll('.n91-mobile-bottom [data-view]').forEach(btn=>btn.classList.toggle('active',btn.dataset.view===r));
  }

  function ensureMobileChrome(){
    if($('.n91-mobile-top')) return;
    const top=document.createElement('div');
    top.className='n91-mobile-top';
    top.innerHTML=`<a href="#/" class="n91-mobile-brand" aria-label="Norte Padel — Inicio"><img src="icon-192.png" alt="" /><span><b>NORTE <em>PADEL</em></b><small>THE CIRCUIT · 2026</small></span></a><div class="n91-mobile-actions"><button type="button" data-n91="notif" aria-label="Notificaciones">●</button><button type="button" data-n91="account" aria-label="Cuenta">◯</button></div>`;
    document.body.appendChild(top);
    top.addEventListener('click',(e)=>{
      const b=e.target.closest('[data-n91]'); if(!b)return;
      if(b.dataset.n91==='notif'){ const x=$('#btnNotif'); if(x)x.click(); }
      if(b.dataset.n91==='account'){ const x=$('#btnPerfil'); if(x)x.click(); }
    });

    const bottom=document.createElement('nav');
    bottom.className='n91-mobile-bottom';
    bottom.innerHTML=`<button type="button" data-view="inicio"><span>⌂</span>INICIO</button><button type="button" data-view="torneos"><span>◫</span>TORNEOS</button><button type="button" data-view="ranking"><span>↟</span>RANKING</button><button type="button" data-view="perfil"><span>◯</span>CUENTA</button>`;
    document.body.appendChild(bottom);
    bottom.addEventListener('click',(e)=>{
      const b=e.target.closest('[data-view]'); if(!b)return;
      if(typeof window.cambiarVista==='function') window.cambiarVista(b.dataset.view);
      else location.hash=b.dataset.view==='inicio'?'#/':'#/'+b.dataset.view;
    });
  }

  function tournamentData(){
    try{return (typeof torneoActualData!=='undefined' && torneoActualData) ? torneoActualData : null;}catch{return null;}
  }

  function applyTournamentMedia(){
    const t=tournamentData();
    const flyer=(t && t.flyer_url) ? String(t.flyer_url) : 'hero-torneos.webp';
    const art=$('.np-event-art');
    const img=$('#dtTorneoFlyer');
    const infoArt=$('.np-event-inside-art');
    const infoImg=$('#dtTorneoFlyerInfo');
    if(img){img.src=flyer; img.alt=t?.nombre ? `Imagen de ${t.nombre}` : 'Imagen del torneo';}
    if(infoImg){infoImg.src=flyer; infoImg.alt=t?.nombre ? `Imagen de ${t.nombre}` : 'Imagen del torneo';}
    if(art) art.style.setProperty('--n91-event-image',`url("${flyer.replaceAll('"','%22')}")`);
    if(infoArt) infoArt.style.setProperty('--n91-event-image',`url("${flyer.replaceAll('"','%22')}")`);
    document.querySelectorAll('.flyer-destacado').forEach(el=>{
      el.style.backgroundSize='contain';
      el.style.backgroundPosition='center';
      el.style.backgroundRepeat='no-repeat';
    });
  }

  function patchSponsorship(){
    document.querySelectorAll('.sponsor-strip').forEach(strip=>strip.classList.add('n91-sponsor-strip'));
  }

  function patchViews(){
    // Guarantee that only the active view can consume layout/paint.
    document.querySelectorAll('.view').forEach(v=>{
      if(!v.classList.contains('active')){
        v.setAttribute('aria-hidden','true');
      }else{
        v.removeAttribute('aria-hidden');
      }
    });
  }

  function init(){
    ensureMobileChrome();
    syncShell();
    applyTournamentMedia();
    patchSponsorship();
    patchViews();
    window.addEventListener('hashchange',()=>{syncShell();patchViews();setTimeout(applyTournamentMedia,50);});
    window.addEventListener('resize',()=>{syncShell();});
    // Observe DOM insertions only. The previous version also observed class/style
    // mutations while its callback itself changed classes/styles, causing a
    // self-triggering MutationObserver loop that could freeze the page.
    const obs=new MutationObserver(()=>{
      patchViews();
      applyTournamentMedia();
      patchSponsorship();
    });
    obs.observe(document.body,{subtree:true,childList:true});
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
