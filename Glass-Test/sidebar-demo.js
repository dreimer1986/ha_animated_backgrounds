/* Local structural fixture, not a running HA frontend. Native links keep keyboard behavior. */
customElements.define('ha-list-item-button',class extends HTMLElement{
  constructor(){super();this.attachShadow({mode:'open'}).innerHTML='<style>:host{display:block}a{display:flex;align-items:center;gap:14px;box-sizing:border-box;width:100%;height:44px;padding:0 14px;color:inherit;text-decoration:none;background:transparent;border-radius:inherit;white-space:nowrap}a:hover{background:#ffffff12}a:focus-visible{outline:2px solid white;outline-offset:-3px}::slotted(.icon){width:24px;text-align:center;flex-shrink:0}</style><a part="base" href="#sidebar-preview"><slot></slot></a>'}
});
customElements.define('ha-sidebar',class extends HTMLElement{
  constructor(){super();const root=this.attachShadow({mode:'open'});root.innerHTML=`<style>
  :host{display:flex;flex-direction:column;width:256px;max-width:100%;color:#eee8ff;font:14px system-ui;--sidebar-selected-icon-color:#d2baff;--primary-text-color:#fff;--sidebar-background-color:transparent}
  .menu{display:flex;align-items:center;gap:14px;height:52px;padding:0 12px}.title{white-space:nowrap}nav{display:block;padding:4px 0}ha-list-item-button{position:relative;margin:0 4px 6px;border-radius:4px;background:#17162e88}ha-list-item-button.selected::before{content:'';position:absolute;inset:0;border-radius:4px;background:#bd98ff;opacity:.16;pointer-events:none}.selected{color:#e6d7ff}.after-spacer{margin-top:18px}.badge{margin-left:auto;padding:2px 6px;border-radius:10px;background:#e8933a;color:#171426;font-size:11px}:host([collapsed]){width:56px}:host([collapsed]) .label,:host([collapsed]) .title,:host([collapsed]) .badge{display:none}
  </style><div class="menu"><span>☰</span><span class="title">Home Assistant</span></div><nav></nav>`;
  const nav=root.querySelector('nav');
  for(const [icon,label,badge] of [['⌂','Übersicht',''],['◇','Karte',''],['ϟ','Energie',''],['▦','Kalender',''],['♫','Medien',''],['⚙','Einstellungen','4'],['◉','Benachrichtigungen',''],['●','Profil','']]){
    const item=document.createElement('ha-list-item-button');item.innerHTML=`<span class="icon">${icon}</span><span class="label">${label}</span>${badge?`<span class="badge">${badge}</span>`:''}`;
    if(label==='Übersicht')item.classList.add('selected');
    if(label==='Einstellungen')item.classList.add('after-spacer');
    item.addEventListener('click',event=>{event.preventDefault();nav.querySelectorAll('.selected').forEach(el=>el.classList.remove('selected'));item.classList.add('selected')});nav.append(item);
  }
  }
});
