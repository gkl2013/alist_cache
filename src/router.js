import t from"express";import e from"body-parser";import{Level as o}from"level";import n from"fs";import*as a from"path";import{fileURLToPath as r}from"url";import{createClient as s}from"webdav";const i=new o("./database"),c="SCANNING_IS_DOING",l=async(t,e)=>{console.log("=======insert",t),await i.put(t,JSON.stringify(e))},p=async t=>{try{const e=await i.get(t);return e?JSON.parse(e):[]}catch(t){return console.log("=======err",t),[]}},d=async t=>{try{return await i.del(t)}catch(t){return void console.log("=======",t)}},m=async t=>{await i.put(c,String(t))};let u=null;function g(){let t=a.dirname(r(import.meta.url));for(;!n.existsSync(a.join(t,"package.json"));)t=a.dirname(t);return t}g();const f=()=>{const t=a.join(g(),"alist.json");return new Promise((e=>{if(u)return e(u);n.readFile(t,"utf8",((t,o)=>{if(t)console.error("读取配置文件失败：",t);else try{const t=JSON.parse(o);return console.log("读取到的配置内容：",t),u=t,e(t)}catch(t){console.error("解析配置文件内容出错：",t)}}))}))},D=(t=[])=>{let e='<?xml version="1.0" encoding="UTF-8"?><D:multistatus xmlns:D="DAV:">';return t.forEach((t=>{e+="<D:response>",e+=`<D:href>/dav/${t.filename.replace("/","")}</D:href>`,e+="<D:propstat><D:prop>",e+=`<D:displayname>${t.basename}</D:displayname> `,e+=`<D:getlastmodified>${t.lastmod}</D:getlastmodified> `,e+=`<D:getcontentlength>${t.size}</D:getcontentlength>`,e+=`<D:resourcetype>${"directory"===t.type?'<D:collection xmlns:d="DAV:" />':""}</D:resourcetype>`,t.mime&&(e+=`<D:getcontenttype>${t.mime}</D:getcontenttype>`),t.etag&&(e+=`<D:getetag>${t.etag?`"${t.etag}"`:""}</D:getetag>`),e+="</D:prop><D:status>HTTP/1.1 200 OK</D:status></D:propstat>","directory"===t.type&&(e+="<D:propstat> <D:prop> <D:getcontentlength></D:getcontentlength> <D:getetag></D:getetag> <D:getcontenttype></D:getcontenttype> </D:prop> <D:status>HTTP/1.1 404 Not Found</D:status> </D:propstat>"),e+="</D:response>"})),e+="</D:multistatus>",e},y=async(t,e)=>{const o=decodeURIComponent("/dav"===t.url?"/":t.url.replace("/dav",""));console.log("=======path",o),o||e.send("参数错误");if(delete t.headers.host,"GET"===t.method){const{protocol:t,port:n,host:a,username:r,password:s}=await f(),i=`${t}://${r}:${s}@${a}:${n}/dav${encodeURIComponent(o)}`;e.redirect(i)}if("PROPFIND"===t.method){const t=await(async t=>{const e=await p(t);return D(e)})(o);t?(e.set("Content-Type","application/xml"),e.status(207).send(t)):e.send("参数错误")}},w=(t=500)=>new Promise((e=>setTimeout((()=>e(!0)),t))),h="directory";let $=null;const v=async(t,e=!0)=>{try{const o=await(async()=>{if($)return $;const{protocol:t,port:e,host:o,username:n,password:a}=await f();return $=s(`${t}://${o}:${e}/dav`,{username:n,password:a}),$})(),n=await o.getDirectoryContents(t,{includeSelf:!0});if(!n||0===n.length)return;if(!e)return void await l(t,n);const a=await p(t)||[];await l(t,n);const r=new Map,i=[];for(const t of a)r.set(t.filename,t);for(const e of n)if(t!==e.filename){const t=r.get(e.filename);(!t||t.lastmod!==e.lastmod||t.lastmod===e.lastmod&&e.type===h)&&i.push(e)}for(const t of i)await w(1500),await v(t.filename,t.type===h);for(const[t]of r){n.find((e=>e.filename===t))||await d(t)}}catch(t){return void console.error("获取目录内容或转换为XML时出错：",t)}},N=async(t,e=!0)=>{await(async()=>{try{const t=await i.get(c);return!!t&&t===String(!0)}catch(t){return[]}})()?console.log("===已有扫描正在处理中===="):(await m(!0),await v(t,!0),await m(!1),console.log("===扫描完成===="))},S=e.json(),T=t.Router();T.propfind("/dav",y),T.propfind("/dav/*",y),T.get("/dav/*",y),T.get("/api/scanning",(async(t,e)=>{const o=t.params[0]||"/";N(o,!0),e.send({code:0})})),T.post("/api/updateUser",S,(async(t,e)=>{console.log("======="),e.send({success:0})}));export{T as router};
