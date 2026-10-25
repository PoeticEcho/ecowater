import {build} from 'esbuild';
import fs from 'node:fs/promises';
import postcss from 'postcss';
import tailwind from 'tailwindcss';
let html=await fs.readFile('shell.html','utf8');
for(const name of ['icon-192.png','icon-180.png','icon-32.png','favicon.ico']){const mime=name.endsWith('.ico')?'image/x-icon':'image/png';const bytes=await fs.readFile('assets/generated/'+name);html=html.replaceAll('assets/generated/'+name,'data:'+mime+';base64,'+bytes.toString('base64'));}
for(const name of [...html.matchAll(/data-icon="([^"]+)"/g)].map(m=>m[1])){const svg=(await fs.readFile('assets/icons/'+name+'.svg','utf8')).replace('<svg','<svg aria-hidden="true" focusable="false"');html=html.replaceAll('<span data-icon="'+name+'"></span>','<span data-icon="'+name+'">'+svg+'</span>');}
const js=await build({entryPoints:['app.js'],bundle:true,write:false,minify:true,format:'iife',loader:{'.svg':'text','.webp':'dataurl','.png':'dataurl'},legalComments:'inline',target:['safari15']});
const css=await postcss([tailwind({content:['./shell.html','./app.js'],theme:{extend:{}},corePlugins:{preflight:false}})]).process(await fs.readFile('style.css','utf8'),{from:'style.css'});
await fs.mkdir('dist',{recursive:true});
await fs.writeFile('dist/index.html',html.replace('/* APP_STYLE */',css.css).replace('/* APP_SCRIPT */',()=>js.outputFiles[0].text.replaceAll('</script','<\\/script')));
console.log('Built standalone HTML with embedded Three.js, OrbitControls and compiled Tailwind CSS.');

await fs.cp('assets','dist/assets',{recursive:true});
