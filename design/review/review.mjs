import {composeScreen,type} from './scene.mjs';
const response=await fetch('./screens.json');
if(!response.ok)throw Error('The frame inventory could not be loaded.');
const data=await response.json();
const icons=new Map();
const iconNames=['activity','arrow-left','arrow-right','calendar-days','check','check-check','chevron-right','circle-play','download','file-up','footprints','layers','map','navigation','pause','play','plus','route','settings-2','share-2','shield-check','signal','sliders-horizontal','sun','trending-up','triangle-alert','volume-2'];
await Promise.all(iconNames.map(async name=>{const r=await fetch(`../assets/icons/${name}.svg`);if(r.ok)icons.set(name,await r.text());}));
const frames=document.getElementById('frames');
let currentGroup='Overview';let focused=false;let keyboard=false;
const overview=['today','record','plan','maps','progress','share-compose'];
const groups=['Overview',...new Set(data.screens.map(s=>s.group))];
document.addEventListener('keydown',()=>{keyboard=true;document.body.classList.add('keyboard-nav');});
document.addEventListener('pointerdown',()=>{keyboard=false;document.body.classList.remove('keyboard-nav');});
function navigate(id){const screen=data.screens.find(s=>s.id===id);if(!screen)return;focused=true;currentGroup=screen.group;render([screen]);history.replaceState(null,'',`#${id}`);document.getElementById('review-live').textContent=`Opened ${screen.title.replaceAll('\n',' ')}.`;if(keyboard)frames.querySelector('button,a')?.focus();window.scrollTo({top:0,behavior:'instant'});}
function el(tag,className){const n=document.createElement(tag);n.className=className;return n;}
function renderNode(scene,p,large=false){
 if(scene.name==='Android status bar')large=false;
 let n;
 if(scene.kind==='text'){
  n=el(scene.target?'button':'p','scene scene-text'+(scene.target?' scene-action':''));n.textContent=scene.value;if(scene.target){n.type='button';n.addEventListener('click',()=>navigate(scene.target));}if(scene.role==='title'){n.setAttribute('role','heading');n.setAttribute('aria-level','2');}
  const [size,line,weight,family]=type[scene.role]||type.body;
  Object.assign(n.style,{fontSize:`${size*(large?2:1)*(scene.fontScale||1)}px`,lineHeight:`${line*(large?2:1)*(scene.fontScale||1)}px`,fontFamily:family==='numbers'?"'Roboto Condensed',sans-serif":'Manrope,sans-serif',fontWeight:{Regular:400,Medium:500,SemiBold:600,Bold:700}[weight],color:`var(--${scene.color||'text'})`,letterSpacing:scene.role==='label'?'.65px':['title','headline','clock'].includes(scene.role)?'-.65px':'0'});
 }else if(scene.kind==='icon'){
  n=el('span','scene scene-icon');n.innerHTML=icons.get(scene.icon)||icons.get('activity');n.style.color=`var(--${scene.color||'text'})`;n.setAttribute('aria-hidden','true');
 }else if(scene.kind==='svg'){
  n=el('div','scene scene-svg');n.innerHTML=scene.markup;n.setAttribute('role','img');n.setAttribute('aria-label',scene.markup.includes('map')?'Schematic route drawing':'Illustrative route or chart drawing');
 }else{
  const clickable=scene.target||scene.selectable||'toggle'in scene||scene.component==='Button';
  n=el(clickable?'button':'div','scene scene-box'+(clickable?' scene-action':'')+(scene.scroll?' scene-scroll':'')+(scene.pattern?' scene-checker':'')+(scene.shareTheme?' scene-share':'')+(scene.landscape?' scene-landscape':'')+(scene.loading?' scene-loading':''));
  if(clickable){n.type='button';if(scene.disabled){n.disabled=true;n.title='Preview only: this handoff is available in the native app.';}if(scene.name&&scene.children.every(c=>c.kind!=='text'))n.setAttribute('aria-label',scene.name);}
  Object.assign(n.style,{flexDirection:scene.direction==='row'?'row':'column',gap:`${scene.gap||0}px`,alignItems:({center:'center',end:'flex-end',start:'flex-start'})[scene.align]||'stretch',justifyContent:({center:'center',between:'space-between',end:'flex-end',start:'flex-start'})[scene.justify]||'flex-start'});
  if(scene.fill)n.style.backgroundColor=`var(--${scene.fill})`;
  if(scene.radius)n.style.borderRadius=`${scene.radius}px`;
  if(scene.stroke)n.style.border=`1px solid var(--${scene.stroke})`;
  if(scene.pad)n.style.padding=scene.pad.map(v=>`${v}px`).join(' ');
  if(scene.clip)n.style.overflow='hidden';
  for(const child of scene.children)n.append(renderNode(child,p,large));
  if(scene.chart){n.setAttribute('role','img');n.setAttribute('aria-label',scene.summary);}
  if(scene.loading)n.setAttribute('aria-busy','true');
  if(scene.active)n.setAttribute('aria-current','page');
  if(scene.target)n.addEventListener('click',()=>navigate(scene.target));
  else if('toggle'in scene){n.setAttribute('role','switch');n.setAttribute('aria-label',scene.label);n.setAttribute('aria-checked',String(scene.toggle));n.addEventListener('click',()=>{scene.toggle=!scene.toggle;n.setAttribute('aria-checked',String(scene.toggle));const track=n.lastElementChild;track.style.backgroundColor=`var(--${scene.toggle?'accent':'line'})`;track.style.justifyContent=scene.toggle?'flex-end':'flex-start';});}
  else if(scene.selectable){n.setAttribute('aria-pressed',String(!!scene.selected));n.addEventListener('click',()=>{n.setAttribute('aria-pressed',String(n.getAttribute('aria-pressed')!=='true'));n.style.boxShadow=n.getAttribute('aria-pressed')==='true'?'inset 0 0 0 2px var(--accentText)':'none';});}
 }
 if(scene.kind==='text'&&scene.role==='shareMetric'){n.style.whiteSpace='pre';n.style.overflowWrap='normal';}if(scene.kind==='text'&&['metric','clock','workout','shareMetric'].includes(scene.role))n.style.fontVariantNumeric='tabular-nums';
 if(scene.width==='fill')n.style.width='100%';
 if(typeof scene.width==='number')n.style.width=`${scene.width}px`;
 if(typeof scene.height==='number')n.style.height=`${scene.height}px`;
 if(scene.minHeight)n.style.minHeight=`${scene.minHeight}px`;
 if(scene.flex)n.style.flex=`${scene.flex} 1 0%`;
 if(scene.alignSelf)n.style.alignSelf=scene.alignSelf;
 if(scene.name)n.dataset.layer=scene.name;
 return n;
}
function render(screens){
 frames.replaceChildren();frames.classList.toggle('focused',focused);
 for(const s of screens){
  const figure=el('figure','frame-tile');figure.dataset.screen=s.id;
  const caption=el('figcaption','frame-label');const title=el('button','');title.type='button';title.textContent=s.title.replaceAll('\n',' ');title.addEventListener('click',()=>navigate(s.id));const index=el('span','frame-index');index.textContent=s.id;caption.append(title,index);
  const shell=el('div','phone-shell');const phone=renderNode(composeScreen(s,data.palette),data.palette[s.theme],s.id==='large-text');phone.classList.add('phone');if(focused)shell.classList.add('screen-enter');if(s.id==='large-text')phone.classList.add('large-text');phone.setAttribute('role','region');phone.setAttribute('aria-label',`${s.title.replaceAll('\n',' ')} — ${s.theme} frame`);
  for(const [key,value]of Object.entries(data.palette[s.theme]))phone.style.setProperty(`--${key}`,value);
  shell.append(phone);figure.append(caption,shell);
  const note=el('p','scene-note');note.textContent=s.note||'Select a control to explore the connected flow.';figure.append(note);frames.append(figure);
  const resize=()=>{const available=figure.clientWidth;const max=focused?400:230;const scale=Math.min(available,max)/s.width;shell.style.width=`${s.width*scale}px`;shell.style.height=`${s.height*scale}px`;phone.style.transform=`scale(${scale})`;};
  new ResizeObserver(resize).observe(figure);resize();
 }
 document.getElementById('review-summary').textContent=focused?'Explore the flow; use All frames to return.':`${screens.length} visible frames · ${data.screens.length} frames in the full review`;
 document.querySelectorAll('#groups button').forEach(n=>n.setAttribute('aria-current',String(n.textContent===currentGroup)));
}
for(const group of groups){const button=el('button','');button.type='button';button.textContent=group;button.addEventListener('click',()=>{focused=false;currentGroup=group;render(group==='Overview'?data.screens.filter(s=>overview.includes(s.id)):data.screens.filter(s=>s.group===group));});document.getElementById('groups').append(button);}
document.getElementById('show-overview').addEventListener('click',()=>{focused=false;currentGroup='All';render(data.screens);});
document.getElementById('reduce-motion').addEventListener('change',e=>{document.documentElement.dataset.reduceMotion=String(e.target.checked);});
const initial=decodeURIComponent(location.hash.slice(1));if(initial&&data.screens.some(s=>s.id===initial))navigate(initial);else render(data.screens.filter(s=>overview.includes(s.id)));


if(new URLSearchParams(location.search).has('qa')){await document.fonts.ready;requestAnimationFrame(()=>requestAnimationFrame(()=>{const report={viewport:innerWidth,loaded:!!document.querySelector('.phone'),documentWidth:document.documentElement.scrollWidth,overflow:document.documentElement.scrollWidth>innerWidth,phoneOverflow:[...document.querySelectorAll('.scene-scroll')].some(n=>n.scrollWidth>n.clientWidth+2)};parent.postMessage({reviewViewport:report},location.origin);}));}
