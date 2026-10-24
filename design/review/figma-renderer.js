// Shared Figma plugin construction body. SCREENS and TYPE are prepended by build_figma.mjs.
const made=[];const changed=[];const summaries=[];
await Promise.all([{family:'Manrope',style:'Regular'},{family:'Manrope',style:'Medium'},{family:'Manrope',style:'SemiBold'},{family:'Manrope',style:'Bold'},{family:'Roboto Condensed',style:'Medium'}].map(f=>figma.loadFontAsync(f)));
const allVars=await figma.variables.getLocalVariablesAsync();
const collections=await figma.variables.getLocalVariableCollectionsAsync();
const variables={};
for(const theme of ['dark','light']){const c=collections.find(c=>c.name==='RT2 / '+theme);variables[theme]=Object.fromEntries(allVars.filter(v=>v.variableCollectionId===c.id).map(v=>[v.name,v]));}
const layout=collections.find(c=>c.name==='RT2 / Layout');const spaces=Object.fromEntries(allVars.filter(v=>v.variableCollectionId===layout.id).map(v=>[v.name.split('/')[1],v]));
const styles=Object.fromEntries((await figma.getLocalTextStylesAsync()).filter(s=>s.name.startsWith('RT2 / ')).map(s=>[s.name.slice(6),s]));
const foundation=figma.currentPage.children.find(n=>n.name==='RT2 / Foundations');
const icons=Object.fromEntries(foundation.findAllWithCriteria({types:['COMPONENT']}).filter(n=>n.name.startsWith('RT2 / Icon / ')).map(n=>[n.name.slice(13),n]));
const components=new Map(foundation.findAllWithCriteria({types:['COMPONENT']}).filter(n=>n.name.startsWith('RT2 / Reusable / ')).map(n=>[n.name,n]));
const solid=(theme,key)=>figma.variables.setBoundVariableForPaint(figma.util.solidPaint(PALETTE[theme][key]||PALETTE[theme].text),'color',variables[theme][key]||variables[theme].text);
function applyText(t,scene,theme,width){
 const spec=TYPE[scene.role]||TYPE.body;t.fontName={family:spec[3]==='numbers'?'Roboto Condensed':'Manrope',style:spec[2]};t.textStyleId=styles[scene.role||'body'].id;t.characters=scene.value;if(scene.fontScale){t.fontSize=spec[0]*scene.fontScale;t.lineHeight={unit:'PIXELS',value:spec[1]*scene.fontScale};}t.fills=[solid(theme,scene.color||'text')];t.textAutoResize='HEIGHT';t.resize(Math.max(1,width),spec[1]);
}
function styleIcon(n,theme,color){for(const p of n.findAllWithCriteria({types:['VECTOR','ELLIPSE','RECTANGLE','LINE','POLYGON']})){
 if(p.strokes?.length)p.strokes=p.strokes.map(v=>v.type==='SOLID'?solid(theme,color):v);
 if(p.fills?.length)p.fills=p.fills.map(v=>v.type==='SOLID'?solid(theme,color):v);
}}
function applyProps(n,s,theme,width,parent){
 if(s.kind!=='box')return;
 const isRow=s.direction==='row';n.layoutMode=isRow?'HORIZONTAL':'VERTICAL';
 n.resize(typeof s.width==='number'?s.width:Math.max(1,width),s.height||10);n.primaryAxisSizingMode=isRow?'FIXED':s.height?'FIXED':'AUTO';n.counterAxisSizingMode=isRow&&!s.height?'AUTO':'FIXED';
 n.itemSpacing=s.gap||0;if(spaces[s.gap||0])n.setBoundVariable('itemSpacing',spaces[s.gap||0]);
 n.primaryAxisAlignItems=({center:'CENTER',between:'SPACE_BETWEEN',end:'MAX',start:'MIN'})[s.justify]||'MIN';n.counterAxisAlignItems=({center:'CENTER',end:'MAX',start:'MIN'})[s.align]||'MIN';
 const pad=s.pad||[0,0];const [top,right,bottom,left]=pad.length===4?pad:pad.length===2?[pad[0],pad[1],pad[0],pad[1]]:[pad[0],pad[0],pad[0],pad[0]];
 for(const [key,value]of Object.entries({paddingTop:top,paddingRight:right,paddingBottom:bottom,paddingLeft:left})){n[key]=value;if(spaces[value])n.setBoundVariable(key,spaces[value]);}
 n.fills=s.fill?[solid(theme,s.fill)]:[];n.cornerRadius=s.radius||0;if(s.stroke){n.strokes=[solid(theme,s.stroke)];n.strokeWeight=1;}n.clipsContent=!!s.clip;
 if(s.minHeight)n.minHeight=s.minHeight;
 if(s.name)n.name=s.name;
 if(s.target)n.name='Go to / '+s.target;
 if(parent?.layoutMode&&parent.layoutMode!=='NONE'){
  if(s.flex){n.layoutSizingHorizontal=isRow||parent.layoutMode==='HORIZONTAL'?'FILL':'FILL';if(parent.layoutMode==='VERTICAL')n.layoutSizingVertical='FILL';}
  else if(typeof s.width!=='number')n.layoutSizingHorizontal=parent.layoutMode==='VERTICAL'?'FILL':'FIXED';
 }
}
const keyOf=(s,theme)=>{
 const shape=n=>n.kind==='text'?['t',n.role,n.color,n.fontScale]:n.kind==='icon'?['i',n.color,n.width]:['b',n.direction,n.fill,n.height,n.gap,n.pad,n.children?.map(shape)];
 const value=JSON.stringify(shape(s));let hash=2166136261;for(let i=0;i<value.length;i++)hash=Math.imul(hash^value.charCodeAt(i),16777619);return 'RT2 / Reusable / '+s.component+' / '+theme+' / '+(s.tone||((s.active===true)?'active':'default'))+' '+(hash>>>0).toString(16);
};
function valuesOf(s,out=[]){if(s.kind==='text')out.push({type:'TEXT',value:s.value});else if(s.kind==='icon')out.push({type:'INSTANCE_SWAP',value:icons[s.icon]?.id||icons.activity.id});else s.children?.forEach(c=>valuesOf(c,out));return out;}
async function render(s,parent,theme,width,allowComponent=true){
 if(allowComponent&&s.component){
  const key=keyOf(s,theme);let c=components.get(key);
  if(!c){
   c=figma.createComponent();made.push(c.id);foundation.appendChild(c);c.name=key;c.description=s.component+' used in the running-app review. Text and icon overrides remain editable.';
   const count=components.size;c.x=40+(count%4)*376;c.y=760+Math.floor(count/4)*120;c.resize(width,64);
   const source={...s,component:undefined};applyProps(c,source,theme,width,foundation);
   for(const child of source.children)await render(child,c,theme,childWidth(child,source,width),false);
   const leaves=c.findAll(n=>n.type==='TEXT'||n.type==='INSTANCE');let index=0;
   for(const leaf of leaves){const prop=c.addComponentProperty('Content '+String(++index).padStart(2,'0'),leaf.type==='TEXT'?'TEXT':'INSTANCE_SWAP',leaf.type==='TEXT'?leaf.characters:leaf.mainComponent.id);leaf.componentPropertyReferences=leaf.type==='TEXT'?{characters:prop}:{mainComponent:prop};}
   components.set(key,c);
  }
  const n=c.createInstance();made.push(n.id);parent.appendChild(n);const props=Object.entries(c.componentPropertyDefinitions);const vals=valuesOf(s);const override={};props.forEach(([key],i)=>{if(vals[i])override[key]=vals[i].value;});n.setProperties(override);n.name=s.target?'Go to / '+s.target:s.component;
  n.resize(Math.max(1,width),c.height);if(parent.layoutMode==='VERTICAL')n.layoutSizingHorizontal='FILL';else if(s.flex)n.layoutSizingHorizontal='FILL';
  return n;
 }
 let n;
 if(s.kind==='text'){
  n=figma.createText();made.push(n.id);parent.appendChild(n);applyText(n,s,theme,width);if(parent.layoutMode==='HORIZONTAL'&&!s.flex&&s.role!=='title')n.textAutoResize='WIDTH_AND_HEIGHT';if(parent.layoutMode==='HORIZONTAL'&&s.role==='title')n.layoutSizingHorizontal='FILL';if(parent.layoutMode==='VERTICAL'){n.layoutSizingHorizontal='FILL';if(parent.counterAxisAlignItems==='CENTER')n.textAlignHorizontal='CENTER';}if(s.flex&&parent.layoutMode==='HORIZONTAL')n.layoutSizingHorizontal='FILL';
 }else if(s.kind==='icon'){
  n=(icons[s.icon]||icons.activity).createInstance();made.push(n.id);parent.appendChild(n);n.resize(s.width,s.height);styleIcon(n,theme,s.color||'text');
 }else if(s.kind==='svg'){
  n=figma.createNodeFromSvg(s.markup);made.push(n.id,...n.findAll(()=>true).map(n=>n.id));parent.appendChild(n);n.resize(typeof s.width==='number'?s.width:width,s.height);n.name='Editable vector illustration';
 }else{
  n=figma.createAutoLayout(s.direction==='row'?'HORIZONTAL':'VERTICAL');made.push(n.id);parent.appendChild(n);applyProps(n,s,theme,width,parent);
  if(s.pattern==='checker'){
   // Checkerboard is a preview layer only, outside the exported transparent artwork.
   n.fills=[solid(theme,'raised')];
   const grid=figma.createFrame();made.push(grid.id);n.appendChild(grid);grid.name='Preview checkerboard — exclude from image export';grid.layoutPositioning='ABSOLUTE';grid.resize(width,s.height);grid.fills=[];grid.x=0;grid.y=0;
   for(let row=0;row<Math.ceil(s.height/20);row++)for(let col=0;col<Math.ceil(width/20);col++)if((row+col)%2===0){const tile=figma.createRectangle();made.push(tile.id);grid.appendChild(tile);tile.resize(20,20);tile.x=col*20;tile.y=row*20;tile.fills=[solid(theme,'line')];}
  }
  for(const child of s.children)await render(child,n,theme,childWidth(child,s,width));
 }
 if(s.alignSelf==='center'&&parent.layoutMode==='VERTICAL')n.layoutAlign='CENTER';
 if(s.target)n.name='Go to / '+s.target;
 return n;
}
function childWidth(child,parent,width){
 if(typeof child.width==='number')return child.width;
 const pad=parent.pad||[0,0];const horizontal=pad.length===4?pad[1]+pad[3]:pad[1]*2||0;const inner=width-horizontal;
 if(parent.direction!=='row')return inner;
 const fixed=parent.children.reduce((sum,c)=>sum+(typeof c.width==='number'?c.width:0),0);
 const flexible=parent.children.filter(c=>typeof c.width!=='number').length;
 return Math.max(1,(inner-fixed-(parent.gap||0)*(parent.children.length-1))/Math.max(1,flexible));
}
for(const screen of SCREENS){
 if(screen.id==='large-text'){const scale=n=>{if(n.name==='Android status bar')return;if(n.kind==='text')n.fontScale=(n.fontScale||1)*2;if(n.name==='Persistent actions')for(const child of n.children)child.height=80;n.children?.forEach(scale);};scale(screen.scene);}
 const wrap=figma.currentPage.findOne(n=>n.name==='RT2 Screen / '+screen.id);
 if(!wrap)throw Error('Missing wrapper '+screen.id);
 if(wrap.children.length){summaries.push({id:screen.id,nodeId:wrap.id,skipped:true});continue;}
 changed.push(wrap.id);wrap.layoutMode='VERTICAL';wrap.primaryAxisSizingMode='FIXED';wrap.counterAxisSizingMode='FIXED';wrap.itemSpacing=0;wrap.resize(screen.width,screen.height);wrap.fills=[solid(screen.theme,'background')];
 for(const child of screen.scene.children)await render(child,wrap,screen.theme,childWidth(child,screen.scene,screen.width));
 // A fixed scroll viewport keeps action controls visible while long content can be inspected.
 const body=wrap.children.find(n=>n.name==='Scrollable content');if(body){body.clipsContent=true;body.overflowDirection='VERTICAL';body.layoutSizingVertical='FILL';}
 wrap.clipsContent=true;wrap.overflowDirection='NONE';
 summaries.push({id:screen.id,nodeId:wrap.id,width:wrap.width,height:wrap.height,editableText:wrap.findAllWithCriteria({types:['TEXT']}).length,instances:wrap.findAllWithCriteria({types:['INSTANCE']}).length,bodyHeight:body?.height,contentHeight:body?.children.reduce((a,n)=>a+n.height,0)});
}
const requiredHeight=760+Math.ceil(components.size/4)*120+160;if(foundation.height<requiredHeight){foundation.resize(1600,requiredHeight);changed.push(foundation.id);}
return {createdNodeIds:made,mutatedNodeIds:changed,screens:summaries,reusableComponents:components.size};
