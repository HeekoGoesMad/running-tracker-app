import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {composeScreen,blockScene} from './scene.mjs';
const data=JSON.parse(await readFile(new URL('./screens.json',import.meta.url),'utf8'));
const walk=(n)=>[n,...(n.children||[]).flatMap(walk)];
test('all 84 frames and every internal action resolve to an authored screen',()=>{
 const ids=new Set(data.screens.map(s=>s.id));assert.equal(ids.size,84);
 for(const s of data.screens)for(const n of walk(composeScreen(s,data.palette)))if(n.target)assert.ok(ids.has(n.target),`${s.id}: ${n.target}`);
});
test('recording and recovery retain an accessible persistent action outside the scrolling content',()=>{
 for(const id of ['record','record-map','record-weak','interval','paused','recovery','storage-error']){
  const s=data.screens.find(s=>s.id===id);const root=composeScreen(s,data.palette);
  const actions=root.children.find(n=>n.name==='Persistent actions');assert.ok(actions);
  assert.ok(actions.children.every(n=>n.height>=64),id);
  assert.ok(root.children.findIndex(n=>n.scroll)<root.children.indexOf(actions),id);
 }
});
test('chart summaries provide values, units and a zero-based axis',()=>{
 const month=blockScene({kind:'chart',mode:'month',height:220},data.palette.dark);
 assert.match(month.summary,/KILOMETERS/);assert.match(month.summary,/zero to 20/);
 const values=month.summary.split('Values: ')[1].split('. Axis')[0].split(', ').map(Number);
 // Decimal parsing must preserve the complete month total.
 assert.equal(Number(values.reduce((a,b)=>a+b,0).toFixed(1)),48.2);
 assert.ok(month.children.length>=3);assert.ok(values.length>0);
});
test('both themes retain readable foreground/background and action pairs',()=>{
 const lum=h=>{const c=h.slice(1).match(/../g).map(x=>parseInt(x,16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return c[0]*.2126+c[1]*.7152+c[2]*.0722;};
 for(const [theme,p]of Object.entries(data.palette))for(const [a,b,min]of [['text','background',4.5],['muted','surface',4.5],['onAccent','accent',4.5],['accentText','surface',4.5],['warning','surface',4.5]]){
  const x=lum(p[a]),y=lum(p[b]);assert.ok((Math.max(x,y)+.05)/(Math.min(x,y)+.05)>=min,`${theme}: ${a}/${b}`);
 }
});
test('illustrations and navigation use the declared semantic palette',()=>{
 for(const s of data.screens)for(const n of walk(composeScreen(s,data.palette))){
  for(const key of ['fill','stroke','color'])if(n[key])assert.ok(data.palette[s.theme][n[key]],`${s.id}: unknown ${key} ${n[key]}`);
  if(n.kind==='svg')assert.ok(n.markup.startsWith('<svg'));
 }
});
