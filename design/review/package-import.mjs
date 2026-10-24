import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {composeScreen,type} from './scene.mjs';
const data=JSON.parse(await readFile(new URL('./screens.json',import.meta.url),'utf8'));
const output=new URL('./figma-import/',import.meta.url);await mkdir(output,{recursive:true});
let foundation=await readFile(new URL('../../.work/design-review/foundation.js',import.meta.url),'utf8');
foundation=foundation.replace(/const imported=await figma\.getNodeByIdAsync\('2:222'\);[^\n]*\n/,'');
let renderer=await readFile(new URL('./figma-renderer.js',import.meta.url),'utf8');
renderer=renderer.replace("n.name=s.target?'Go to / '+s.target:s.component;", "n.name=s.target?'Go to / '+s.target:s.component;n.opacity=s.disabled ? 0.45 : 1;");
let code=`// Running Tracker UI review importer. All activity values are illustrative.
// Local Figma editor only. No network access or personal-file access.
const paint=hex=>({type:'SOLID',color:{r:parseInt(hex.slice(1,3),16)/255,g:parseInt(hex.slice(3,5),16)/255,b:parseInt(hex.slice(5,7),16)/255}});
const auto=(direction='HORIZONTAL')=>{const n=figma.createFrame();n.layoutMode=direction;return n;};
(async()=>{
 if(figma.currentPage.children.length || (await figma.variables.getLocalVariablesAsync()).length){figma.closePlugin('Open a new blank Design file before running this importer. No changes were made.');return;}
 const start=Date.now();
 const foundationState=await (async()=>{${foundation}})();
 const TYPE=${JSON.stringify(type)};const PALETTE=${JSON.stringify(data.palette)};
 const all=${JSON.stringify(data.screens.map(s=>({...s,scene:composeScreen(s,data.palette)})))};
 for(let i=0;i<all.length;i+=6){const SCREENS=all.slice(i,i+6);await(async()=>{${renderer}})();}
 const screenMap=Object.fromEntries(figma.currentPage.findAllWithCriteria({types:['FRAME']}).filter(n=>n.name.startsWith('RT2 Screen / ')).map(n=>[n.name.slice(13),n]));
 let links=0;
 for(const frame of Object.values(screenMap))for(const node of frame.findAll(n=>n.name.startsWith('Go to / '))){const to=screenMap[node.name.slice(8)];if(to){await node.setReactionsAsync([{trigger:{type:'ON_CLICK'},actions:[{type:'NODE',destinationId:to.id,navigation:'NAVIGATE',transition:{type:'DISSOLVE',duration:.2,easing:{type:'CUSTOM_CUBIC_BEZIER',easingFunctionCubicBezier:{x1:.23,y1:1,x2:.32,y2:1}}},resetScrollPosition:true}]}]);links++;}}
 figma.currentPage.flowStartingPoints=[{name:'First run',nodeId:screenMap.welcome.id},{name:'Daily training',nodeId:screenMap.today.id},{name:'Record and recover',nodeId:screenMap.record.id},{name:'Share an activity',nodeId:screenMap.share.id}];
 figma.viewport.scrollAndZoomIntoView([screenMap.today]);
 figma.closePlugin('Created '+all.length+' editable review frames and '+links+' flow links. Review candidate only.');
})().catch(error=>{figma.closePlugin('Import stopped: '+error.message+'. Inspect the file before running again.');});`;
code=code.replaceAll('figma.util.solidPaint','paint').replaceAll('figma.createAutoLayout','auto');
await writeFile(new URL('code.js',output),code);
await writeFile(new URL('manifest.example.json',output),JSON.stringify({name:'Running Tracker — UI Review Import',api:'1.0.0',main:'code.js',editorType:['figma'],documentAccess:'dynamic-page',networkAccess:{allowedDomains:['none']}},null,2));
await writeFile(new URL('README.md',output),`# Local Figma import\n\nThis optional developer plugin constructs all 84 review frames as editable text, vectors, auto-layout and component instances. It uses the free editor workflow, without the MCP connector. It has no network access.\n\n## How to use\n\n1. Open a **new blank Figma Design file** in the desktop app.\n2. Choose Plugins → Development → New plugin, select Figma Design and create a local plugin without a UI. Figma assigns its own plugin ID.\n3. Replace the generated code.js with the bundled code.js. In the generated manifest, retain Figma’s assigned ID and use the API, documentAccess, editorType and networkAccess fields shown in manifest.example.json.\n4. Run your local development plugin. The completed import is intended to have named flow groups and four prototype starting points.\n\nThe importer refuses a non-empty page or existing local variables. If it stops partway through, inspect the result and use a new blank file rather than retrying over partial output.\n\n## Verification limits\n\nThe equivalent construction operations were verified for the first 31 frames through Figma MCP before its Starter quota was reached. This local developer-plugin package passes a JavaScript syntax check; its full native-editor import has **not** been executed in this session. Use the complete local browser review as the verified visual deliverable. No upgrade is required to review the screens.\n\nAll routes, metrics and check-ins are illustrative. This is a UI review, not an implemented running app.\n`);
console.log('Prepared offline Figma import package for all 84 frames. Native-editor execution remains unverified.');
