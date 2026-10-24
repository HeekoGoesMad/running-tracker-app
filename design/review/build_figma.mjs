// Generates retryable construction phases. Runtime calls use the official Figma MCP.
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {composeScreen,type} from './scene.mjs';
const data=JSON.parse(await readFile(new URL('./screens.json',import.meta.url),'utf8'));
const icons={};
for(const name of ['activity','arrow-left','arrow-right','calendar-days','check','check-check','chevron-right','circle-pause','circle-play','download','file-up','footprints','layers','map','map-pin','navigation','pause','play','plus','route','settings-2','share-2','shield-check','signal','sliders-horizontal','sun','timer','trending-up','triangle-alert','volume-2','x'])icons[name]=await readFile(new URL(`../assets/icons/${name}.svg`,import.meta.url),'utf8');
const dir=new URL('../../.work/design-review/',import.meta.url);await mkdir(dir,{recursive:true});
const semanticHelper=await readFile(new URL('./figma-token-helpers.js',import.meta.url),'utf8');
const groups=[...new Set(data.screens.map(s=>s.group))];
const placements={};let y=900;
for(const group of groups){const items=data.screens.filter(s=>s.group===group);placements[group]={x:240,y,width:2704,height:Math.ceil(items.length/6)*980+120};y+=placements[group].height+160;}
const foundation=`${semanticHelper}
const DATA=${JSON.stringify({palette:data.palette,screens:data.screens.map(({id,group,width,height,theme})=>({id,group,width,height,theme}))})};const GROUPS=${JSON.stringify(placements)};const ICONS=${JSON.stringify(icons)};
const created=[];const mutated=[];const ids={};
const p=figma.currentPage;if(p.children.some(n=>n.name.startsWith('RT2 / '))||(await figma.variables.getLocalVariablesAsync()).some(v=>v.name.startsWith('dark/')))throw Error('Foundation already exists or is partial; inspect before continuing.');p.name='UI & UX · Review 02';
const fontNames=[{family:'Manrope',style:'Regular'},{family:'Manrope',style:'Medium'},{family:'Manrope',style:'SemiBold'},{family:'Manrope',style:'Bold'},{family:'Roboto Condensed',style:'Medium'}];
await Promise.all(fontNames.map(f=>figma.loadFontAsync(f)));
const primitive=figma.variables.createVariableCollection('RT2 / Primitives');
const colls={};const varIds={};
for(const theme of ['dark','light']){
 const c=figma.variables.createVariableCollection('RT2 / '+theme);colls[theme]=c.id;varIds[theme]={};
 for(const [name,value]of Object.entries(DATA.palette[theme])){
  const primitiveName=theme+'/'+name;
  const pv=(await createSemanticTokens(primitive,{Default:primitive.defaultModeId},[{name:primitiveName,type:'COLOR',values:{Default:value},scopes:[]}])).variables[primitiveName];
  const scopes=['text','muted','subtle','onAccent','accentText','blue','warning','error'].includes(name)?['TEXT_FILL','STROKE_COLOR','SHAPE_FILL']:['FRAME_FILL','SHAPE_FILL','STROKE_COLOR'];
  const sv=(await createSemanticTokens(c,{Default:c.defaultModeId},[{name,type:'COLOR',values:{Default:{type:'VARIABLE_ALIAS',id:pv.id}},scopes,codeSyntax:{WEB:'var(--'+name+')',ANDROID:'ReviewColors.'+name}}])).variables[name];
  varIds[theme][name]=sv.id;
 }
}
const geom=figma.variables.createVariableCollection('RT2 / Layout');
for(const n of [0,4,8,12,16,20,24,32,40,48,56,64])await createSemanticTokens(geom,{Default:geom.defaultModeId},[{name:'space/'+n,type:'FLOAT',values:{Default:n},scopes:['GAP'],codeSyntax:{WEB:n+'px',ANDROID:n+'.dp'}}]);
const styles={};
for(const [name,[size,line,weight,family]] of Object.entries(${JSON.stringify(type)})){
 const s=figma.createTextStyle();s.name='RT2 / '+name;s.fontName={family:family==='numbers'?'Roboto Condensed':'Manrope',style:weight};s.fontSize=size;s.lineHeight={unit:'PIXELS',value:line};s.letterSpacing={unit:'PIXELS',value:name==='label'?.65:['title','headline','clock'].includes(name)?-.65:0};styles[name]=s.id;
}
// Library navigation import was inspected: its imported variants have a 12px empty shell.
// It cannot faithfully represent a usable phone navigation bar. Use local, labeled components.
const imported=await figma.getNodeByIdAsync('2:222');if(imported&&imported.parent?.id===p.id){mutated.push(imported.id);imported.remove();}
const foundation=figma.createFrame();created.push(foundation.id);foundation.name='RT2 / Foundations';foundation.x=3400;foundation.y=240;foundation.resize(1600,2200);foundation.fills=[figma.util.solidPaint('#101416')];
const label=(parent,value,x,y,size=18,color='#F3F5EF')=>{const t=figma.createText();created.push(t.id);parent.appendChild(t);t.fontName={family:'Manrope',style:'Regular'};t.characters=value;t.fontSize=size;t.fills=[figma.util.solidPaint(color)];t.x=x;t.y=y;return t;};
label(foundation,'FOUNDATIONS / CANDIDATE 02',40,32,14,'#D2F77A');label(foundation,'A quieter running journal.',40,72,40);label(foundation,'Manrope for reading. Roboto Condensed for the numbers.',40,136,18,'#ADB8BD');
for(const [i,name]of ['background','surface','raised','text','muted','accent','blue','warning'].entries()){const r=figma.createRectangle();created.push(r.id);foundation.appendChild(r);r.resize(150,76);r.x=40+i%4*190;r.y=210+Math.floor(i/4)*124;r.cornerRadius=8;r.fills=[figma.variables.setBoundVariableForPaint(figma.util.solidPaint(DATA.palette.dark[name]),'color',await figma.variables.getVariableByIdAsync(varIds.dark[name]))];label(foundation,name,r.x,r.y+82,12,'#ADB8BD');}
label(foundation,'EDITABLE COMPONENTS',40,500,14,'#ADB8BD');
for(const [index,[name,source]]of Object.entries(ICONS).entries()){
 const c=figma.createComponent();created.push(c.id);foundation.appendChild(c);c.name='RT2 / Icon / '+name;c.resize(24,24);c.x=40+index%16*72;c.y=570+Math.floor(index/16)*64;c.fills=[];const vector=figma.createNodeFromSvg(source.replaceAll('currentColor','#F3F5EF'));created.push(vector.id,...vector.findAll(()=>true).map(n=>n.id));c.appendChild(vector);vector.resize(24,24);vector.x=0;vector.y=0;ids['icon/'+name]=c.id;
}
const groups={};const screens={};
for(const [group,rect]of Object.entries(GROUPS)){
 const f=figma.createFrame();created.push(f.id);p.appendChild(f);f.name='RT2 / '+group;f.x=rect.x;f.y=rect.y;f.resize(rect.width,rect.height);f.fills=[figma.util.solidPaint('#0B0F11')];f.clipsContent=false;groups[group]=f.id;label(f,group.toUpperCase(),24,28,22,'#F3F5EF');
 const list=DATA.screens.filter(s=>s.group===group);
 for(const [i,s]of list.entries()){
  const wrap=figma.createFrame();created.push(wrap.id);f.appendChild(wrap);wrap.name='RT2 Screen / '+s.id;wrap.resize(s.width,s.height);wrap.x=24+(i%6)*440;wrap.y=100+Math.floor(i/6)*980;wrap.fills=[figma.util.solidPaint(DATA.palette[s.theme].background)];wrap.clipsContent=true;screens[s.id]=wrap.id;
  label(f,s.id,wrap.x,wrap.y+s.height+12,12,'#ADB8BD');
 }
}
return {createdNodeIds:created,mutatedNodeIds:mutated,foundationId:foundation.id,groups,screens,icons:ids,variables:varIds,styles,collections:colls,frameCount:Object.keys(screens).length};`;
await writeFile(new URL('foundation.js',dir),foundation);
await writeFile(new URL('placements.json',dir),JSON.stringify(placements,null,2));

const renderer=await readFile(new URL('./figma-renderer.js',import.meta.url),'utf8');
let phase=0;let chunk=[];
async function saveChunk(){if(!chunk.length)return;phase++;const code=`const SCREENS=${JSON.stringify(chunk)};const TYPE=${JSON.stringify(type)};const PALETTE=${JSON.stringify(data.palette)};\n${renderer}`;if(code.length>49000)throw Error('Oversized phase '+phase);await writeFile(new URL(`screens-${String(phase).padStart(2,'0')}.js`,dir),code);chunk=[];}
for(const screen of data.screens){const item={...screen,scene:composeScreen(screen,data.palette)};const test=[...chunk,item];if(JSON.stringify(test).length+renderer.length+JSON.stringify(type).length+JSON.stringify(data.palette).length>48000)await saveChunk();chunk.push(item);}
await saveChunk();
console.log('Prepared foundation and '+phase+' safely bounded screen phases.');
