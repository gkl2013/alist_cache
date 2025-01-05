import{createClient as t}from"webdav";import{Level as e}from"level";import o from"fs";import*as a from"path";import{fileURLToPath as r}from"url";const n=new e("./database"),s="SCANNING_IS_DOING",i=async(t,e)=>{console.log("=======insert",t),await n.put(t,JSON.stringify(e))},c=async t=>{try{return await n.del(t)}catch(t){return void console.log("=======",t)}},l=async t=>{await n.put(s,String(t))},f=(t=500)=>new Promise((e=>setTimeout((()=>e(!0)),t)));let u=null;function m(){let t=a.dirname(r(import.meta.url));for(;!o.existsSync(a.join(t,"package.json"));)t=a.dirname(t);return t}m();const w=()=>{const t=a.join(m(),"alist.json");return new Promise((e=>{if(u)return e(u);o.readFile(t,"utf8",((t,o)=>{if(t)console.error("读取配置文件失败：",t);else try{const t=JSON.parse(o);return console.log("读取到的配置内容：",t),u=t,e(t)}catch(t){console.error("解析配置文件内容出错：",t)}}))}))};let p=null;const y=async(e,o=!0)=>{try{const a=await(async()=>{if(p)return p;const{protocol:e,port:o,host:a,username:r,password:n}=await w();return p=t(`${e}://${a}:${o}/dav`,{username:r,password:n}),p})(),r=await a.getDirectoryContents(e,{includeSelf:!0});if(!r||0===r.length)return;if(!o)return void await i(e,r);const s=await(async t=>{try{const e=await n.get(t);return e?JSON.parse(e):[]}catch(t){return console.log("=======err",t),[]}})(e)||[];await i(e,r);const l=new Map,u=[];for(const t of s)l.set(t.filename,t);for(const t of r)if(e!==t.filename){const e=l.get(t.filename);e&&e.lastmod===t.lastmod?l.delete(t.filename):u.push(t)}for(const t of u)await f(1500),await y(t.filename,"directory"===t.type);for(const t of[...l.values()])await c(t.filename)}catch(t){return void console.error("获取目录内容或转换为XML时出错：",t)}},d=async(t,e=!0)=>{await(async()=>{try{const t=await n.get(s);return!!t&&t===String(!0)}catch(t){return[]}})()?console.log("===已有扫描正在处理中===="):(await l(!0),await y(t,!0),await l(!1),console.log("===扫描完成===="))},g=async(t,e)=>{const o=t.params[0]||"/";d(o,!0),e.send({code:0})},h=async()=>{await w(),await l(!1),d("/",!0)};export{h as initData,g as scanning,d as scanningHandler};
