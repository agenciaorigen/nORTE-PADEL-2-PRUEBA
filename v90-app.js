/* NORTE PADEL V90 — App shell and safe visual enhancements. */
(function(){
  const $=(s)=>document.querySelector(s);
  const mk=(tag,cls,html)=>{const e=document.createElement(tag); if(cls)e.className=cls; if(html!=null)e.innerHTML=html; return e;};
  function isMobile(){return matchMedia('(max-width:760px)').matches}
  function routeRoot(){return ((location.hash||'#/').replace(/^#\/?/,'').split('/')[0]||'inicio')}
  function syncBody(){
    document.body.dataset.np90Route=routeRoot();
    document.body.classList.toggle('np90-mobile',isMobile());
    document.body.classList.toggle('np90-admin',routeRoot()==='admin'||routeRoot()==='config');
    document.body.classList.toggle('np90-tournament',routeRoot()==='torneo');
    updateMobileActive();
  }
  function go(view){
    if(view==='inicio') location.hash='#/'; else location.hash='#/'+view;
  }
  function ensureMobileShell(){
    if($('.n90-mobile-bar')) return;
    const bar=mk('header','n90-mobile-bar',`<a class="n90-mobile-brand" href="#/"><img src="icon-192.png" alt="Norte Padel"><span><b>NORTE <em>PADEL</em></b><small>THE CIRCUIT · 2026</small></span></a><div class="n90-mobile-actions"><button type="button" data-n90="notif" aria-label="Notificaciones">◌</button><button type="button" data-n90="account" aria-label="Cuenta">◎</button></div>`);
    const nav=mk('nav','n90-mobile-nav',`<button type="button" data-view="inicio"><span>⌂</span>INICIO</button><button type="button" data-view="torneos"><span>◫</span>TORNEOS</button><button type="button" data-view="ranking"><span>↟</span>RANKING</button><button type="button" data-view="perfil"><span>◯</span>CUENTA</button>`);
    document.body.append(bar,nav);
    nav.addEventListener('click',e=>{const b=e.target.closest('[data-view]');if(!b)return; if(typeof window.cambiarVista==='function')window.cambiarVista(b.dataset.view); else go(b.dataset.view); updateMobileActive();});
    bar.addEventListener('click',e=>{const b=e.target.closest('[data-n90]');if(!b)return; if(b.dataset.n90==='notif'){const x=$('#btnNotif');if(x)x.click();} if(b.dataset.n90==='account'){const x=$('#btnPerfil');if(x)x.click();}});
    updateMobileActive();
  }
  function updateMobileActive(){
    const r=routeRoot();
    document.querySelectorAll('.n90-mobile-nav [data-view]').forEach(b=>b.classList.toggle('active',(b.dataset.view||'')===r));
  }
  function patchTournamentArt(){
    const art=$('.np-event-art'); const infoArt=$('.np-event-inside-art');
    let flyer='';
    try{ flyer=window.torneoActualData && window.torneoActualData.flyer_url || ''; }catch{}
    const img=flyer || 'hero-torneos.webp';
    [art,infoArt].forEach(el=>{if(!el)return;el.style.backgroundImage=`linear-gradient(90deg,rgba(4,7,5,.15),rgba(4,7,5,.05)), url("${img.replaceAll('"','%22')}")`;});
  }
  function patchSponsorClones(){
    document.querySelectorAll('#sponsorsInline').forEach(strip=>{
      if(strip.dataset.n90Cloned==='1')return;
      const items=[...strip.children]; if(items.length<2)return;
      items.forEach(x=>strip.appendChild(x.cloneNode(true))); strip.dataset.n90Cloned='1';
    });
  }
  function patchFlyers(){
    document.querySelectorAll('.flyer-destacado').forEach(el=>{el.style.backgroundSize='contain';el.style.backgroundPosition='center';});
  }
  function observeDynamic(){
    const obs=new MutationObserver(()=>{patchTournamentArt();patchSponsorClones();patchFlyers();});
    obs.observe(document.body,{subtree:true,childList:true});
  }
  function registerRoutes(){
    window.addEventListener('hashchange',syncBody);
    addEventListener('resize',()=>{document.body.classList.toggle('np90-mobile',isMobile()); if(!isMobile() && $('.n90-mobile-bar')) $('.n90-mobile-bar').style.display='none'; updateMobileActive();});
  }
  function init(){
    ensureMobileShell(); syncBody(); patchTournamentArt(); patchSponsorClones(); patchFlyers(); registerRoutes(); observeDynamic();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init); else init();
})();
