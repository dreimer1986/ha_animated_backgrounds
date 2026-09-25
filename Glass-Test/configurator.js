/* The exact values applied to the live HA module are also exported as YAML. */
(() => {
  'use strict';
  const background='linear-gradient(135deg,rgba(255,255,255,.08),rgba(16,12,42,.22))';
  const shadow='inset 0 1px 0 rgba(255,255,255,.48),inset 1px 0 0 rgba(255,255,255,.12),inset 0 -1px 0 rgba(180,165,240,.22),0 12px 30px rgba(0,0,0,.24)';
  const fields=[
    {key:'enabled',label:'Glaseffekt aktiv',type:'check',value:'1'},
    {key:'mobile',label:'Mobile Browser freischalten',type:'check',value:'0',hint:'Erlaubt den Effekt auch in Chrome auf Android. Rendering und Geschwindigkeit auf deinem Gerät prüfen.'},
    {key:'strength',label:'Brechungsstärke',min:0,max:160,step:1,value:'72'},
    {key:'bevel',label:'Kantenbreite · px',min:4,max:160,step:1,value:'48'},
    {key:'blur',label:'Mattierung · px',min:0,max:40,step:.5,value:'0',hint:'0 = klar. Höhere Werte machen den Hintergrund unscharf; Schrift auf der Karte bleibt scharf.'},
    {key:'frost',label:'Milchiger Weißanteil · 0–1',min:0,max:1,step:.01,value:'0',hint:'0 = transparent, 1 = vollständig weiß. Für Milchglas z. B. 0.12 bis 0.25.'},
    {key:'profile',label:'Glasprofil',type:'select',value:'lens',options:[['lens','Glasmurmel · sphärische Linse'],['convex','Gewölbt · Version 0.3'],['legacy','Flach · Version 0.1']],hint:'Glasmurmel: gleichmäßige Vergrößerung innen, starke Umbiegung am Rand. Für vollständig gewölbte Kreise/Kapseln Kantenbreite mindestens auf halbe Höhe stellen.'},
    {key:'background',label:'Glas-Hintergrund · CSS',type:'css',property:'background',value:background},
    {key:'shadow',label:'Glaskante & Schatten · CSS',type:'css',property:'box-shadow',value:shadow},
    {key:'sidebar',label:'Sidebar als Glasflächen',type:'check',value:'1',hint:'Einzelne Navigationseinträge statt einer zusätzlichen Glasplatte vor dem Hintergrund.'},
    {key:'sidebar-strength',label:'Sidebar · Brechungsstärke',min:0,max:160,step:1,value:'54'},
    {key:'sidebar-bevel',label:'Sidebar · Kantenbreite · px',min:4,max:160,step:1,value:'24'},
    {key:'sidebar-blur',label:'Sidebar · Mattierung · px',min:0,max:40,step:.5,value:'1.5'},
    {key:'sidebar-radius',label:'Sidebar · Rundung · CSS',type:'css',property:'border-top-left-radius',value:'22px'},
    {key:'sidebar-background',label:'Sidebar · Hintergrund · CSS',type:'css',property:'background',value:'linear-gradient(135deg,rgba(255,255,255,.14),rgba(16,12,42,.16))'},
    {key:'sidebar-shadow',label:'Sidebar · Lichtkante & Schatten · CSS',type:'css',property:'box-shadow',value:'inset 0 1px 0 rgba(255,255,255,.6),inset 1px 0 0 rgba(255,255,255,.18),inset 0 -1px 0 rgba(190,185,255,.28),0 3px 8px rgba(0,0,0,.18)'},
    {key:'dialogs',label:'Glas auch für Dialoge',type:'check',value:'0',hint:'Vorschau unten rechts; HA-Dialoge können zusätzlich einen eigenen dunklen Hintergrund haben.'}
  ];
  const live=document.querySelector('#live'),form=document.querySelector('#settings'),yaml=document.querySelector('#yaml');
  const state=Object.fromEntries(fields.map(f=>[f.key,f.value]));
  const controls=new Map();
  function apply(){
    for(const [key,value] of Object.entries(state))live.style.setProperty('--liquid-glass-'+key,value);
    yaml.value=fields.map(f=>'  liquid-glass-'+f.key+': '+JSON.stringify(state[f.key])).join('\n');
    document.querySelector('.old').style.setProperty('--liquid-glass-mobile',state.mobile);
    window.haLiquidGlass.refresh();
    const status=window.haLiquidGlass.status;
    if(status.mobile&&status.supported)document.querySelector('#status').textContent=(state.mobile==='1'||status.mobileOverride)?'Mobiler Test freigeschaltet · Darstellung und Flüssigkeit bitte auf dem Gerät beurteilen.':'Mobile Sperre aktiv. Zum Testen „Mobile Browser freischalten“ aktivieren.';
    document.querySelector('#copy-status').textContent='';
  }
  for(const f of fields){
    const wrap=document.createElement('div');wrap.className='field';
    const label=document.createElement('label');label.htmlFor=f.key;label.textContent=f.label;wrap.append(label);
    const code=document.createElement('code');code.textContent='liquid-glass-'+f.key;wrap.append(code);
    let input,range;
    const error=document.createElement('div');error.className='error';error.id=f.key+'-error';error.setAttribute('aria-live','polite');
    if(f.type==='check'){input=document.createElement('input');input.type='checkbox';input.checked=f.value==='1';label.append(input)}
    else if(f.type==='select'){input=document.createElement('select');for(const [value,text] of f.options)input.add(new Option(text,value));wrap.append(input)}
    else if(f.type==='css'){input=document.createElement('textarea');input.spellcheck=false;input.setAttribute('aria-describedby',error.id);wrap.append(input)}
    else {const row=document.createElement('div');row.className='value';range=document.createElement('input');range.type='range';range.setAttribute('aria-label',f.label+' Schieberegler');input=document.createElement('input');input.type='number';for(const node of [input,range]){node.min=f.min;node.max=f.max;node.step=f.step;node.value=f.value}row.append(range,input);wrap.append(row)}
    input.id=f.key;if(f.type!=='check')input.value=f.value;
    function commit(source){
      let value=f.type==='check'?(input.checked?'1':'0'):source.value;
      if(f.type==='css'&&(!value.trim()||!CSS.supports(f.property,value))){error.textContent='Ungültiges CSS. Vorschau und YAML behalten den letzten gültigen Wert.';input.setAttribute('aria-invalid','true');return}
      if(!f.type){if(value.trim()===''||!Number.isFinite(Number(value)))return;value=String(Math.max(f.min,Math.min(f.max,Number(value))));range.value=value;input.value=value}
      error.textContent='';input.removeAttribute('aria-invalid');state[f.key]=value;apply();
    }
    input.addEventListener('input',()=>commit(input));if(range)range.addEventListener('input',()=>commit(range));
    wrap.append(error);if(f.hint){const hint=document.createElement('p');hint.className='hint';hint.textContent=f.hint;wrap.append(hint)}
    controls.set(f.key,{input,range,error});form.append(wrap);
  }
  customElements.define('wa-dialog',class extends HTMLElement{
    constructor(){super();this.attachShadow({mode:'open'}).innerHTML='<style>*{box-sizing:border-box}:host{display:block;margin-top:18px;padding:20px;border-radius:18px;background:repeating-linear-gradient(25deg,#374365 0 12px,#9c81ad 12px 15px,#263756 15px 32px)}dialog{position:relative;inset:auto;display:block;width:100%;margin:0;border:1px solid #ffffff40;border-radius:22px;padding:22px;background:#172133;color:#fff;font:14px system-ui}small{display:block;margin-top:8px}</style><dialog open>Dialog-Vorschau<small>Beschriftung bleibt lesbar.</small></dialog>'}
  });
  document.querySelectorAll('[data-preset]').forEach(button=>button.onclick=()=>{
    Object.assign(state,Object.fromEntries(fields.map(f=>[f.key,f.value])));
    // Keep mobile opt-in when trying materials on an actual phone.
    state.mobile=controls.get('mobile').input.checked?'1':'0';
    if(button.dataset.preset==='marble')Object.assign(state,{strength:'72',bevel:'64',blur:'1',frost:'0.08',background:'linear-gradient(135deg,rgba(255,255,255,.22),rgba(255,255,255,.10))',shadow:'inset 0 1px 1px rgba(255,255,255,.85),inset 1px 0 1px rgba(255,255,255,.3),inset 0 -1px 1px rgba(255,255,255,.65),inset 0 0 0 1px rgba(30,35,55,.12),0 8px 18px rgba(20,20,40,.14)'});
    if(button.dataset.preset==='milk')Object.assign(state,{blur:'12',frost:'0.18'});
    if(button.dataset.preset==='thick')Object.assign(state,{strength:'110',bevel:'64'});
    for(const f of fields){const {input,range,error}=controls.get(f.key);if(f.type==='check')input.checked=state[f.key]==='1';else input.value=state[f.key];if(range)range.value=state[f.key];error.textContent='';input.removeAttribute('aria-invalid')}
    apply();
  });
  document.querySelector('#sidebar-collapsed').onchange=e=>document.querySelectorAll('ha-sidebar').forEach(el=>el.toggleAttribute('collapsed',e.target.checked));
  document.querySelector('#reference-profile').onchange=e=>{
    const old=document.querySelector('.old'),legacy=e.target.value==='legacy';
    old.style.setProperty('--liquid-glass-profile',e.target.value);
    old.style.setProperty('--liquid-glass-strength',legacy?'22':'72');
    old.style.setProperty('--liquid-glass-bevel',legacy?'26':'48');
    document.querySelector('#reference-label').textContent=legacy?'Version 0.1 · 22 / 26 · ohne Mattierung':'Version 0.3 · 72 / 48 · ohne Mattierung';
    window.haLiquidGlass.refresh();
  };
  document.querySelector('#motion').onchange=e=>{
    document.body.classList.toggle('paused',!e.target.checked);
    if(e.target.checked){
      document.querySelectorAll('.reading-sheet').forEach(el=>{el.style.removeProperty('animation');el.style.removeProperty('transform')});
      document.querySelector('#text-position-value').value='automatisch';
    }
  };
  document.querySelector('#text-position').oninput=e=>{
    document.querySelector('#motion').checked=false;document.body.classList.add('paused');
    document.querySelectorAll('.reading-sheet').forEach(el=>{el.style.animation='none';el.style.transform=`translateY(${-Number(e.target.value)}px)`});
    document.querySelector('#text-position-value').value=e.target.value+' px';
  };
  let imageURL;
  document.querySelector('#scene').onchange=e=>{document.body.classList.remove('custom-image');document.body.classList.toggle('landscape',e.target.value==='landscape')};
  document.querySelector('#image').onchange=async e=>{
    const file=e.target.files[0];if(!file)return;
    const url=URL.createObjectURL(file),img=new Image();img.src=url;
    try{await img.decode();if(imageURL)URL.revokeObjectURL(imageURL);imageURL=url;document.body.style.setProperty('--preview-image',`url("${url}")`);document.body.classList.add('custom-image');document.querySelector('#status').textContent='Eigenes Bild geladen · nur lokal in diesem Browser.'}
    catch{URL.revokeObjectURL(url);document.querySelector('#status').textContent='Dieses Bild konnte nicht geladen werden.'}
  };
  document.querySelector('#copy').onclick=async()=>{
    try{await navigator.clipboard.writeText(yaml.value);document.querySelector('#copy-status').textContent='Theme-Werte kopiert.'}
    catch{yaml.focus();yaml.select();document.querySelector('#copy-status').textContent='YAML markiert. Mit Strg+C (Mac: ⌘C) kopieren.'}
  };
  apply();
  if(!window.haLiquidGlass.status.supported)document.querySelector('#status').textContent='Dieser Browser wird vom Modul nicht unterstützt. Bitte Chrome oder Edge verwenden.';
})();
