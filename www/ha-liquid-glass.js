/** HA Liquid Glass 0.5.0 — experimental Chromium frontend module.
 * No network requests, dependencies, credentials or HA service calls.
 * Configure with inherited --liquid-glass-* CSS variables (see INSTALL.md).
 */
(() => {
  'use strict';
  if (window.haLiquidGlass) return;
  const VERSION = '0.5.0';
  const ns = 'http://www.w3.org/2000/svg';
  const mark = 'data-ha-liquid-glass';
  const owned = 'data-ha-lg-owned';
  const roots = new Map(), panes = new Map(), dirty = new Set();
  let serial = 0, timer, frame, scanTimer, stopped = false;
  const mobile = /Mobile|Android|iPhone|iPad|iPod/.test(navigator.userAgent);
  const mobileOverride = new URL(location.href).searchParams.get('liquid_glass_mobile') === 'on';
  const supported = /(?:Chrome|Chromium|Edg)\//.test(navigator.userAgent) &&
    CSS.supports('backdrop-filter', 'url("#ha-lg-test")');
  const off = new URL(location.href).searchParams.get('liquid_glass') === 'off';
  const css = `
    [${mark}] {
      background: linear-gradient(rgb(255 255 255 / clamp(0, var(--liquid-glass-frost, 0), 1)),rgb(255 255 255 / clamp(0, var(--liquid-glass-frost, 0), 1))), var(--liquid-glass-background, linear-gradient(135deg,rgba(255,255,255,.08),rgba(16,12,42,.22))) !important;
      backdrop-filter: var(--ha-lg-filter) !important;
      -webkit-backdrop-filter: var(--ha-lg-filter) !important;
      box-shadow: var(--liquid-glass-shadow,inset 0 1px 0 rgba(255,255,255,.48),inset 1px 0 0 rgba(255,255,255,.12),inset 0 -1px 0 rgba(180,165,240,.22),0 12px 30px rgba(0,0,0,.24)) !important;
    }
    [${mark}="sidebar"] {
      border-radius: var(--liquid-glass-sidebar-radius, 22px) !important;
      background: linear-gradient(rgb(255 255 255 / clamp(0, var(--liquid-glass-frost, 0), 1)),rgb(255 255 255 / clamp(0, var(--liquid-glass-frost, 0), 1))), var(--liquid-glass-sidebar-background, linear-gradient(135deg,rgba(255,255,255,.14),rgba(16,12,42,.16))) !important;
      box-shadow: var(--liquid-glass-sidebar-shadow,inset 0 1px 0 rgba(255,255,255,.6),inset 1px 0 0 rgba(255,255,255,.18),inset 0 -1px 0 rgba(190,185,255,.28),0 3px 8px rgba(0,0,0,.18)) !important;
    }
    [${mark}="sidebar"]::before,
    [${mark}="sidebar"]::part(base) { border-radius: inherit !important; }
    [${mark}="sidebar"].selected,
    [${mark}="sidebar"][aria-selected="true"],
    [${mark}="sidebar"][aria-current="page"] {
      outline: 1px solid var(--sidebar-selected-icon-color, var(--primary-color, #c8b6ff));
      outline-offset: -1px;
    }
    [${mark}="sidebar"]:focus-within,
    [${mark}="sidebar"]:focus-visible {
      outline: 2px solid var(--primary-text-color, white);
      outline-offset: -2px;
    }
  `;
  function svg(name, attrs) {
    const node = document.createElementNS(ns,name);
    for (const [k,v] of Object.entries(attrs)) node.setAttribute(k,v);
    return node;
  }
  function parent(el) { return el.assignedSlot || el.parentElement || el.getRootNode()?.host || null; }
  function number(style, name, fallback, min, max) {
    const n = parseFloat(style.getPropertyValue('--liquid-glass-'+name));
    return Math.max(min,Math.min(max,Number.isFinite(n)?n:fallback));
  }
  function disabled(el) {
    for(let p=el;p;p=parent(p)) if(p.hasAttribute?.('data-liquid-glass-ignore')) return true;
    return getComputedStyle(el).getPropertyValue('--liquid-glass-enabled').trim()==='0';
  }
  function isSidebarItem(el) {
    if(!el.matches('ha-list-item-button,ha-md-list-item,paper-icon-item[role="option"],paper-icon-item[aria-role="option"],.menu ha-icon-button')) return false;
    for(let p=parent(el);p;p=parent(p)) if(p.localName==='ha-sidebar') return true;
    return false;
  }
  function kind(el) {
    if(isSidebarItem(el)) return 'sidebar';
    if(el.matches('ha-card,[data-liquid-glass]')) return 'card';
    const host=el.getRootNode()?.host;
    if(el.matches('dialog') && host?.localName==='wa-dialog') return 'dialog';
    if(el.matches('.mdc-dialog__surface') && ['ha-dialog','mwc-dialog'].includes(host?.localName)) return 'dialog';
    return null;
  }
  function eligible(el) {
    const type=kind(el);
    if(!type || disabled(el)) return false;
    if(mobile && !mobileOverride && getComputedStyle(el).getPropertyValue('--liquid-glass-mobile').trim()!=='1') return false;
    if(type==='sidebar') return getComputedStyle(el).getPropertyValue('--liquid-glass-sidebar').trim()==='1';
    if(type==='dialog') return getComputedStyle(el).getPropertyValue('--liquid-glass-dialogs').trim()==='1';
    // Avoid two filters on wrapper cards and their inner cards, across slots/shadow roots.
    for(let p=parent(el);p;p=parent(p)) if(kind(p)==='card' && !disabled(p)) return false;
    return true;
  }
  function installRoot(root) {
    if(roots.has(root)) return roots.get(root);
    const style=document.createElement('style');style.setAttribute(owned,'');style.textContent=css;
    const container=svg('svg',{[owned]:'',width:0,height:0,'aria-hidden':'true',focusable:'false'});
    container.style.cssText='position:absolute;width:0;height:0;overflow:hidden;pointer-events:none';
    const defs=svg('defs',{});container.append(defs);
    (root===document?document.head:root).append(style);
    (root===document?document.body:root).append(container);
    const observer=new MutationObserver(records=>{
      if(records.some(r=>!r.target.closest?.('['+owned+']') &&
        [...r.addedNodes,...r.removedNodes].some(n=>n.nodeType===1 && !n.hasAttribute?.(owned)))) scheduleScan();
    });
    observer.observe(root,{childList:true,subtree:true});
    const state={style,container,defs,observer};roots.set(root,state);return state;
  }
  const resize=new ResizeObserver(entries=>entries.forEach(({target})=>queue(target)));
  const intersection=new IntersectionObserver(entries=>entries.forEach(entry=>{
    const state=panes.get(entry.target);if(!state)return;
    state.visible=entry.isIntersecting;if(state.visible)queue(entry.target);
  }),{rootMargin:'120px'});
  function add(el) {
    if(panes.has(el)) {queue(el);return;}
    const root=el.getRootNode();const store=installRoot(root);
    const id='ha-lg-'+(++serial);
    const filter=svg('filter',{id,filterUnits:'userSpaceOnUse',primitiveUnits:'userSpaceOnUse',x:0,y:0,'color-interpolation-filters':'sRGB'});
    const map=svg('feImage',{x:0,y:0,result:'map',preserveAspectRatio:'none'});
    // Exact neutral 128 -> 0.5; prevents a constant half-pixel shift in flat centres.
    const neutral=svg('feComponentTransfer',{in:'map',result:'centered'});
    neutral.append(svg('feFuncR',{type:'linear',slope:1,intercept:-.5/255}),svg('feFuncG',{type:'linear',slope:1,intercept:-.5/255}));
    const displacement=svg('feDisplacementMap',{in:'SourceGraphic',in2:'centered',scale:72,xChannelSelector:'R',yChannelSelector:'G'});
    filter.append(map,neutral,displacement);store.defs.append(filter);
    panes.set(el,{root,filter,map,displacement,key:'',visible:true,
      oldFilter:el.style.getPropertyValue('--ha-lg-filter'),oldPriority:el.style.getPropertyPriority('--ha-lg-filter')});
    resize.observe(el);intersection.observe(el);queue(el);
  }
  function remove(el) {
    const state=panes.get(el);if(!state)return;
    resize.unobserve(el);intersection.unobserve(el);dirty.delete(el);
    el.removeAttribute(mark);
    if(state.oldFilter)el.style.setProperty('--ha-lg-filter',state.oldFilter,state.oldPriority);
    else el.style.removeProperty('--ha-lg-filter');
    state.filter.remove();panes.delete(el);
  }
  // Orthographic rays through a spherical front surface, n_air=1, n_glass=1.5.
  // u is the radial surface coordinate (0 at the flat shoulder, 1 at the rim).
  // Snell: theta_t = asin(sin(theta_i)/1.5). Propagating the refracted
  // ray to a virtual sampling plane gives a lateral shift proportional to
  // tan(theta_i-theta_t). Normalize only the peak; strength stays compatible.
  // Unlike the old quartic, this has finite optical power at the centre and
  // a steep grazing-angle shoulder at the rim. It is a single-interface lens
  // approximation, NOT a ray-traced glass sphere or Apple's private shader.
  const lensCurve=Float64Array.from({length:1025},(_,i)=>{
    const u=i/1024;
    return Math.tan(Math.asin(u)-Math.asin(u/1.5))/Math.sqrt(1.5*1.5-1);
  });
  function lensBend(t) {
    const index=(1-t)*1024,lo=Math.floor(index),hi=Math.min(1024,lo+1);
    return lensCurve[lo]+(lensCurve[hi]-lensCurve[lo])*(index-lo);
  }
  function update(el) {
    const state=panes.get(el);if(!state?.visible || !el.isConnected)return;
    const w=el.offsetWidth,h=el.offsetHeight;if(w<2||h<2)return;
    const sidebar=kind(el)==='sidebar';
    // Apply the radius before measuring it, so the optical map matches the
    // visible pill on the first frame. The selector also wins over UIX fills.
    const marker=sidebar?'sidebar':'';
    if(el.getAttribute(mark)!==marker)el.setAttribute(mark,marker);
    const style=getComputedStyle(el);
    const strength=sidebar?number(style,'sidebar-strength',54,0,160):number(style,'strength',72,0,160);
    const blur=sidebar?number(style,'sidebar-blur',1.5,0,40):number(style,'blur',0,0,40);
    const requestedProfile=style.getPropertyValue('--liquid-glass-profile').trim();
    const profile=['legacy','convex'].includes(requestedProfile)?requestedProfile:'lens';
    // Keep opposing rims from crossing on short HA entity cards.
    const edge=Math.min(number(style,sidebar?'sidebar-bevel':'bevel',sidebar?24:48,4,160),Math.min(w,h)/2);
    const radiusValue=style.borderTopLeftRadius;
    const radius=Math.min(radiusValue.includes('%')?parseFloat(radiusValue)*Math.min(w,h)/100:parseFloat(radiusValue)||0,w/2,h/2);
    state.displacement.setAttribute('scale',strength);
    // Bounded texture size; CSS pixel dimensions remain accurate in the SVG.
    // Supersample the steep lens rim on small controls; retain the texture cap.
    const ratio=Math.min(profile==='lens'?2:1,768/Math.max(w,h));
    const cw=Math.max(2,Math.round(w*ratio)),ch=Math.max(2,Math.round(h*ratio));
    const key=[w,h,radius,edge,cw,ch,profile].join(':');
    if(state.key!==key) {
      const canvas=document.createElement('canvas');canvas.width=cw;canvas.height=ch;
      const ctx=canvas.getContext('2d');if(!ctx)return;
      const image=ctx.createImageData(cw,ch);
      for(let y=0;y<ch;y++)for(let x=0;x<cw;x++) {
        const px=(x+.5)*w/cw-w/2,py=(y+.5)*h/ch-h/2;
        const qx=Math.abs(px)-(w/2-radius),qy=Math.abs(py)-(h/2-radius);
        const ax=Math.max(qx,0),ay=Math.max(qy,0),length=Math.hypot(ax,ay);
        const d=radius-(length+Math.min(Math.max(qx,qy),0));
        let nx=0,ny=0;
        if(length>0){nx=ax/length*Math.sign(px);ny=ay/length*Math.sign(py);}
        else if(qx>qy)nx=Math.sign(px);else ny=Math.sign(py);
        const t=Math.max(0,Math.min(1,d/edge));
        // The inward sampling direction produces magnification. Near the
        // rim, its steep derivative creates the characteristic folded image.
        // A circle/capsule becomes a full lens when bevel reaches half-height.
        // Continue lens normals outside the rounded silhouette: CSS clips the
        // backdrop, while interpolation at the boundary must not mix in a
        // neutral map and introduce false ripples around circular buttons.
        const bend=profile==='lens'?(d<edge?lensBend(t):0):
          d>=0&&d<edge?(profile==='legacy'?(1-t)**2*(.35+.65*Math.sin(Math.PI*t)):(1-t*t)**2):0;
        const i=(y*cw+x)*4;
        image.data[i]=Math.round(128-nx*bend*126);
        image.data[i+1]=Math.round(128-ny*bend*126);
        image.data[i+2]=128;image.data[i+3]=255;
      }
      ctx.putImageData(image,0,0);
      state.filter.setAttribute('width',w);state.filter.setAttribute('height',h);
      state.map.setAttribute('width',w);state.map.setAttribute('height',h);
      state.map.setAttribute('href',canvas.toDataURL());state.key=key;
    }
    // The definition lives in the SAME tree scope as the styled surface.
    // Blur the backdrop before refraction; foreground text remains untouched.
    const value=(blur>0?`blur(${blur}px) `: '')+`url("#${state.filter.id}")`;
    if(el.style.getPropertyValue('--ha-lg-filter')!==value)el.style.setProperty('--ha-lg-filter',value);
    if(!el.hasAttribute(mark))el.setAttribute(mark,'');
  }
  function queue(el) {dirty.add(el);if(!frame&&!stopped)frame=requestAnimationFrame(flush);}
  function flush() {
    frame=0;const start=performance.now();
    for(const el of dirty){dirty.delete(el);try{update(el)}catch(error){remove(el);console.warn('[HA Liquid Glass] Surface skipped',error)}if(performance.now()-start>10)break;}
    if(dirty.size&&!stopped)frame=requestAnimationFrame(flush);
  }
  function scan() {
    scanTimer=0;if(stopped||document.hidden)return;
    const found=new Set();
    function walk(root) {
      for(const el of root.querySelectorAll('*')) {
        if(el.closest('['+owned+']'))continue;
        if(kind(el)&&eligible(el))found.add(el);
        if(el.shadowRoot)walk(el.shadowRoot);
      }
    }
    walk(document);
    for(const el of panes.keys())if(!found.has(el)||panes.get(el).root!==el.getRootNode())remove(el);
    for(const el of found)add(el);
    for(const [root,state] of roots)if(root!==document&&!root.host.isConnected){state.observer.disconnect();state.style.remove();state.container.remove();roots.delete(root);}
  }
  function scheduleScan(){if(!scanTimer&&!stopped)scanTimer=setTimeout(scan,120);}
  function stop() {
    stopped=true;clearInterval(timer);clearTimeout(scanTimer);cancelAnimationFrame(frame);
    document.removeEventListener('visibilitychange',scheduleScan);
    window.removeEventListener('location-changed',scheduleScan);
    for(const el of [...panes.keys()])remove(el);
    for(const state of roots.values()){state.observer.disconnect();state.style.remove();state.container.remove();}
    roots.clear();resize.disconnect();intersection.disconnect();
  }
  window.haLiquidGlass={version:VERSION,refresh:scheduleScan,stop,
    get status(){return {version:VERSION,supported,mobile,mobileOverride,disabled:off,stopped,surfaces:panes.size,roots:roots.size}}};
  if(!supported||off){stopped=true;console.info('[HA Liquid Glass] Inactive on this browser or disabled via URL.');return;}
  function start(){
    if(stopped)return;
    installRoot(document);scan();
    // Discovers late attachShadow()/theme changes without patching browser or HA APIs.
    timer=setInterval(scan,3000);
    document.addEventListener('visibilitychange',scheduleScan);
    window.addEventListener('location-changed',scheduleScan);
    console.info('[HA Liquid Glass]',VERSION,'Experimental Chromium mode.');
  }
  if(document.body)start();else document.addEventListener('DOMContentLoaded',start,{once:true});
})();
