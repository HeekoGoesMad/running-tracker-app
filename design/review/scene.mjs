// Shared, declarative scene structure for the local review and editable Figma frames.
export const type = {
  title: [30, 38, 'SemiBold', 'ui'], headline: [28, 36, 'SemiBold', 'ui'],
  body: [15, 23, 'Regular', 'ui'], small: [12, 18, 'Medium', 'ui'],
  label: [11, 16, 'SemiBold', 'ui'], rowTitle: [15, 21, 'SemiBold', 'ui'],
  metric: [32, 36, 'Medium', 'numbers'], clock: [88, 96, 'Medium', 'numbers'],
  workout: [72, 76, 'Medium', 'numbers'], button: [15, 20, 'Bold', 'ui'],
  shareMetric: [20, 24, 'Medium', 'numbers'], shareLabel: [7, 10, 'SemiBold', 'ui'],
};
const box = (children = [], props = {}) => ({kind:'box', children:children.filter(Boolean), gap:0, ...props});
const txt = (value, role='body', color='text', props={}) => ({kind:'text',value,role,color,...props});
const ico = (icon, color='text', size=22) => ({kind:'icon',icon,color,width:size,height:size});
const h = (children, props={}) => box(children,{direction:'row',align:'center',...props});
const v = (children, props={}) => box(children,{direction:'column',...props});
const rule = () => box([],{height:1,fill:'line'});
const action = (target) => target ? {target} : {};

export function routeSvg({color='#D2F77A',simple=false,trim=false}={}) {
  const path = simple ? 'M28 102 60 66 100 78 126 34 170 56 188 30 218 84 190 116 142 105 105 132 62 116Z' : 'M62 176 90 148 80 112 112 94 146 114 172 84 162 52 196 32 224 64 212 100 250 124 230 158 194 154 174 198 126 184 100 212Z';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 240" fill="none"><path d="${path}" stroke="${color}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>${trim?'':`<circle cx="62" cy="176" r="6" fill="${color}"/><circle cx="100" cy="212" r="5" fill="${color}"/>`}</svg>`;
}
export function mapSvg(p, opts={}) {
  const roads = ['M-20 40 340 210','M-40 150 340 320','M30 -20 300 110','M70 -20 -10 270','M170 -20 70 310','M300 -20 160 320','M370 30 250 320'];
  let s=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 330" fill="none"><rect width="352" height="330" fill="${opts.routeOnly?p.background:p.mapLand}"/>`;
  if(!opts.routeOnly){
    s+=`<path d="M-40 50C100 35 175 210 410 165L410 235C190 265 90 95-40 125Z" fill="${p.mapWater}"/>`;
    s+=`<path d="M230 0 352 0 352 85 275 60Z M0 240 50 255 80 330 0 330Z" fill="${p.raised}"/>`;
    s+=roads.map(d=>`<path d="${d}" stroke="${p.mapRoad}" stroke-width="2"/>`).join('');
    s+=`<path d="M0 290 352 100M-20 30 320 320" stroke="${p.mapRoad}" stroke-width="5"/>`;
  }
  if(opts.heat){s+=`<path d="M40 270 110 220 90 150 155 126 190 70 225 84 270 140 244 213 190 240 155 210 110 220" stroke="${p.accent}" stroke-width="18" opacity=".12" stroke-linecap="round"/><path d="M40 270 110 220 90 150 155 126 190 70 225 84 270 140 244 213 190 240 155 210 110 220" stroke="${p.accentText}" stroke-width="5" opacity=".8" stroke-linecap="round"/>`;}
  else s+=`<path d="M62 250 110 218 95 164 146 132 184 152 220 107 208 62 262 42 294 91 276 145 314 179 282 232 230 220 204 284 144 266 110 296" stroke="${p.accentText}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" ${opts.quality==='gap'?'stroke-dasharray="35 9"':''}/>`;
  if(opts.area)s+=`<rect x="45" y="30" width="280" height="275" rx="4" stroke="${p.accentText}" stroke-dasharray="8 6"/>`;
  if(opts.quality!=='trim')s+=`<circle cx="62" cy="250" r="6" fill="${p.accentText}"/><circle cx="110" cy="296" r="5" fill="${p.text}"/>`;
  s+='</svg>';return s;
}
const svg=(markup,height,props={})=>({kind:'svg',markup,height,...props});
const progress=(n,total=7)=>h(Array.from({length:total},(_,i)=>box([],{height:4,fill:i<n?'accentText':'line',flex:1,radius:2})),{gap:4});
const badge=(label,color='accentText')=>h([box([],{width:5,height:5,fill:color,radius:3}),txt(label,'label',color)],{gap:6});

function mapBlock(block, p) {
  return v([
    svg(mapSvg(p,block),block.height,{width:'fill'}),
    h([txt(block.routeOnly?'Route geometry · schematic':'Map preview · schematic route','small','muted'),ico('navigation','text',18)],{justify:'between',pad:[8,12],fill:'surface'}),
  ],{radius:12,clip:true,fill:'surface'});
}
function shareBlock(block,p) {
 const cardHeight=block.height-16,cardWidth=cardHeight*9/16,scale=cardWidth/200;
 const st=(value,role='shareMetric',color='text')=>({...txt(value,role,color),fontScale:scale});
 const route=svg(routeSvg({color:'#D2F77A'}),cardHeight*.43,{width:cardWidth-24,alignSelf:'center'});
 const numbers=h([v([st('3.84'),st('KILOMETERS','shareLabel','muted')],{flex:1}),v([st('24:18'),st('ACTIVE TIME','shareLabel','muted')],{flex:1}),v([st('6:20'),st('AVG /KM','shareLabel','muted')],{flex:1})],{gap:6,justify:'center',width:'fill'});
 const content=block.template==='empty'?[ico('plus','muted',22),st('Your preview','shareLabel','muted')]:block.template==='receipt'?[st('SATURDAY','shareLabel'),st('ONE GOOD\nRUN.','shareMetric'),rule(),numbers,st('KEEP SHOWING UP.','shareLabel')]:block.template==='stats'?[st('SATURDAY\nEASY RUN','shareMetric'),numbers]:[route,numbers];
 const artboard=v(content,{width:cardWidth,height:cardHeight,fill:block.template==='photo'?'mapLand':block.template==='receipt'?'surface':undefined,pattern:!['receipt','photo'].includes(block.template)?'checker':undefined,pad:[12,10],gap:16,align:'center',justify:'center',radius:8,clip:true,shareTheme:true,name:'Story artboard · 9:16',...(block.template==='photo'?{landscape:true}:{})});
 return v([artboard],{height:block.height,align:'center',justify:'center',name:'Share image — preview only'});
}
export function blockScene(block,p) {
 switch(block.kind){
 case 'text':return txt(block.value,block.role,block.color);
 case 'section':return h([txt(block.value,'rowTitle'),block.action?txt(block.action,'small','accentText',action(block.target)):null],{justify:'between',gap:12,height:24});
 case 'routeArt':return svg(routeSvg({color:p.accentText}),block.height,{width:260,alignSelf:'center'});
 case 'stats':return h(block.values.map(m=>v([txt(m.value,'metric'),txt(m.label,'small','muted')],{gap:3,flex:1,component:'Metric'})),{gap:16});
 case 'row':return v([h([v([txt(block.title,'rowTitle'),block.detail?txt(block.detail,'small','muted'):null],{gap:4,flex:1}),block.trailing?txt(block.trailing,'small','muted'):null,ico(block.icon||'chevron-right','muted',20)],{gap:12,pad:[10,0],minHeight:56}),rule()],{...action(block.target),component:'Journal row'});
 case 'button':return h([block.icon?ico(block.icon,block.tone==='primary'?'onAccent':'text',20):null,txt(block.label,'button',block.tone==='primary'?'onAccent':'text')],{gap:8,justify:'center',height:56,radius:12,fill:block.tone==='primary'?'accent':'raised',...action(block.target),component:'Button',tone:block.tone,disabled:!block.target});
 case 'notice':{const tone=block.tone==='warning'?'warning':block.tone==='success'?'accentText':'muted';return h([box([],{width:2,height:46,fill:tone,radius:1}),v([txt(block.title,'rowTitle',block.tone==='warning'?'warning':'text'),txt(block.detail,'small','muted')],{gap:4,flex:1})],{gap:12,pad:[12,12],fill:'surface',radius:8,...action(block.target)});}
 case 'field':return v([txt(block.label,'small','muted'),h([txt(block.value,'body'),ico('chevron-right','muted',18)],{justify:'between',gap:8,pad:[12,0]}),rule()],{gap:3,...action(block.target)});
 case 'choice':return h([v([txt(block.label,'rowTitle'),block.detail?txt(block.detail,'small','muted'):null],{gap:4,flex:1}),box([block.selected?ico('check','onAccent',14):null],{width:22,height:22,radius:12,fill:block.selected?'accent':undefined,stroke:block.selected?'accent':'strong',align:'center',justify:'center'})],{gap:12,pad:[12,14],radius:10,fill:block.selected?'raised':'surface',minHeight:56,...action(block.target),selectable:true,selected:block.selected});
 case 'toggle':return h([v([txt(block.label,'rowTitle'),block.detail?txt(block.detail,'small','muted'):null],{gap:4,flex:1}),h([box([],{width:20,height:20,radius:12,fill:block.on?'onAccent':'muted'})],{width:44,height:28,pad:[4,4],fill:block.on?'accent':'line',radius:16,justify:block.on?'end':'start'})],{gap:12,minHeight:54,toggle:block.on,label:block.label});
 case 'workout':return v([h([badge(block.label),ico('arrow-right','muted',20)],{justify:'between'}),h([v([txt(block.title,'headline'),h([txt(block.minutes,'workout'),txt('min','body','muted')],{gap:8,align:'end'})],{gap:4,flex:1}),svg(routeSvg({color:p.accentText,simple:true}),100,{width:112})],{gap:8}),txt(block.effort,'small','muted')],{gap:8,pad:[16,18],fill:'surface',radius:12,...action(block.target)});
 case 'clock':return v([badge(block.label,'muted'),txt(block.value,'clock')],{gap:8,pad:[12,0]});
 case 'interval':return v([txt(block.label,'label','accentText'),txt(block.value,'headline'),progress(4),txt(block.detail,'small','muted')],{gap:12,pad:[20,16],radius:12,fill:'surface'});
 case 'map':return mapBlock(block,p);
 case 'segments':return h(block.options.map((value,i)=>h([txt(value,'small',i===block.selected?'text':'muted')],{justify:'center',height:48,radius:8,fill:i===block.selected?'raised':undefined,flex:1,...action(block.targets?.[i]),selected:i===block.selected,selectable:true})),{gap:4,pad:[4,4],fill:'surface',radius:10});
 case 'week':return h(['M','T','W','T','F','S','S'].map((d,i)=>{let chosen=Array.isArray(block.selected)?block.selected.includes(i):i===block.selected;return v([txt(d,'small',chosen?'onAccent':'muted'),txt(String(19+i),'rowTitle',chosen?'onAccent':'text')],{gap:6,align:'center',justify:'center',height:64,flex:1,fill:chosen?'accent':'surface',radius:10,selectable:true,selected:chosen});}),{gap:0});
 case 'steps':return v(block.values.map((r,i)=>h([v([txt(String(i+1).padStart(2,'0'),'label','accentText')],{width:28}),v([h([txt(r[1],'rowTitle'),txt(r[0],'rowTitle','text')],{justify:'between'}),txt(r[2],'small','muted')],{gap:4,flex:1})],{gap:8,pad:[12,0],minHeight:66})),{gap:4});
 case 'rating':return v([0,5].map(start=>h(block.labels.slice(start,start+5).map((label,j)=>{const i=start+j;return h([txt(label,'small',i===block.selected?'onAccent':'muted')],{height:48,flex:1,justify:'center',fill:i===block.selected?'accent':'surface',radius:6,selectable:true,selected:i===block.selected});}),{gap:6})),{gap:6});
 case 'chart':{
  const isWeek=block.mode==='week';const isMonth=block.mode==='month';const isPlan=block.mode==='plan';
  const vals=isWeek?[0,30,0,32,0,0,0]:isMonth?[9.6,11.8,12.2,14.6]:isPlan?[90,90,90,76]:[30,48,38,62,58,72,70,94];
  const max=isWeek?40:isMonth?20:120;const unit=isWeek?'RECORDED MINUTES':isMonth?'KILOMETERS / WEEK':'MINUTES / WEEK';const graphHeight=block.height-48;
  const bars=h(vals.map((value,i)=>v([box([],{height:Math.max(3,graphHeight*value/max),fill:i===vals.length-1||isWeek&&i===5?'accentText':'line',radius:3})],{flex:1,height:graphHeight,justify:'end'})),{gap:isWeek?16:10,height:graphHeight,align:'end'});
  const labels=isWeek?['M','T','W','T','F','S','S']:isPlan||isMonth?['W1','W2','W3','W4']:['7 WEEKS AGO','THIS WEEK'];
  return v([h([txt(unit,'label','muted'),txt('0–'+max,'label','muted')],{justify:'between'}),bars,h(labels.map(l=>txt(l,'label','muted')),{justify:'between'})],{gap:8,height:block.height,name:'Training chart — illustrative values',chart:true,summary:unit+'. Values: '+vals.join(', ')+'. Axis zero to '+max+'.'});}
 case 'splits':return v([h(['KM','PACE /KM','ACTIVE TIME'].map(t=>txt(t,'label','muted',{flex:1})),{gap:16,pad:[8,0]}),...block.values.map(r=>v([h(r.map((t,i)=>txt(t,i?'body':'rowTitle','text',{flex:1})),{gap:16,pad:[16,0]}),rule()]))],{gap:4});
 case 'sharePreview':return shareBlock(block,p);
 case 'templateGrid':return v([h([v([svg(routeSvg({color:p.accentText}),90,{width:130}),txt('Route + stats','small')],{flex:1,gap:8,pad:[12,12],fill:'surface',radius:10,target:'share-compose'}),v([txt('3.84','workout'),txt('Stats only','small')],{flex:1,gap:8,pad:[12,12],fill:'surface',radius:10,target:'share-stats'})],{gap:12}),h([v([txt('SATURDAY','label'),txt('24:18','metric'),txt('Receipt','small')],{flex:1,gap:8,pad:[12,12],fill:'surface',radius:10,target:'share-receipt'}),v([svg(routeSvg({color:p.accentText}),50,{width:130}),txt('Photo + stats','small')],{flex:1,gap:8,pad:[12,12],fill:'mapLand',radius:10,target:'share-photo'})],{gap:12})],{gap:12});
 case 'swatches':return h(block.values.map((l,i)=>v([box([],{width:44,height:44,radius:24,fill:['text','background','accent'][i],stroke:'strong'}),txt(l,'small','muted')],{gap:8,align:'center',flex:1,selectable:true})),{gap:16});
 case 'themePreview':return h([v([txt('Today','rowTitle'),txt('30','workout'),txt('Dark','small')],{pad:[16,16],gap:8,flex:1,fill:'surface',radius:12}),v([txt('Today','rowTitle','onAccent'),txt('30','workout','onAccent'),txt('Light','small','onAccent')],{pad:[16,16],gap:8,flex:1,fill:'accent',radius:12})],{gap:12});
 case 'success':return v([ico('check','accentText',36),txt(block.value,'headline')],{gap:20,pad:[24,0]});
 case 'legend':return h([txt('Fewer passes','small','muted'),progress(5),txt('More','small','muted')],{gap:12});
 case 'skeleton':return v([box([],{height:48,width:180,fill:'raised',radius:8}),box([],{height:200,fill:'surface',radius:12}),...Array.from({length:3},()=>box([],{height:48,fill:'surface',radius:8}))],{gap:16,loading:true});
 case 'shoeArt':return svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 160" fill="none"><path d="M34 106 54 62 96 82 116 40 143 86 228 102 260 124 256 141 40 141Z" stroke="${p.accentText}" stroke-width="3" stroke-linejoin="round"/><path d="M104 88 140 76M115 101 152 87M45 125 253 125" stroke="${p.muted}" stroke-width="3" stroke-linecap="round"/></svg>`,180,{width:280,alignSelf:'center'});
 default:throw Error(`Unknown scene block ${block.kind}`);
 }
}
export function composeScreen(s,palette){
 const p=palette[s.theme];
 const status=h([txt('08:42','small'),h([ico('signal','text',16),txt('89%','small')],{gap:6})],{justify:'between',height:28,pad:[0,24],name:'Android status bar'});
 const title=v([h([txt(s.title,'title'),s.nav?{...h([ico('settings-2')],{width:48,height:48,justify:'center',target:'settings'}),name:'Settings'}:null],{justify:'between',gap:8}),s.subtitle?txt(s.subtitle,'small','muted'):null],{gap:4,pad:[12,24,16,24]});
 const back=s.back?h([ico('arrow-left','text',20),txt('Back','small')],{gap:8,pad:[8,24,0,24],height:48,target:s.back,name:'Back'}):null;
 const content=v(s.blocks.map(b=>blockScene(b,p)),{gap:16,pad:[0,24,24,24],name:'Scrollable content',scroll:true,flex:1});
 const recording=['record','record-map','record-weak','interval','paused','recovery','storage-error'].includes(s.id);
 const actions=s.actions.length?v(s.actions.map(b=>({...blockScene(b,p),height:recording?64:56})),{gap:8,pad:[12,24,16,24],fill:'background',name:'Persistent actions'}):null;
 const destinations=[['Today','activity','today'],['Plan','calendar-days','plan'],['Record','circle-play','pre-run'],['Maps','map','maps'],['Progress','trending-up','progress']];
 const nav=s.nav?v([rule(),h(destinations.map(([label,icon,target])=>v([ico(icon,label===s.nav?'accentText':'muted',22),txt(label,'label',label===s.nav?'text':'muted')],{height:64,flex:1,align:'center',justify:'center',gap:5,target,name:'Navigation / '+label,component:'Navigation item',active:label===s.nav})),{pad:[0,12],gap:0})],{fill:'background',name:'Bottom navigation'}):null;
 return v([status,back,title,content,actions,nav,box([],{height:8,fill:'background'})],{width:s.width,height:s.height,fill:'background',clip:true,name:s.id,screen:true,large:s.id==='large-text'});
}
