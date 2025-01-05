import{Level as t}from"level";const e=new t("./database");var o={protocol:"http",host:"101.35.113.109",port:5244,username:"test",password:"test"};const n=async t=>{const o=await(async t=>{try{const o=await e.get(t);return o?JSON.parse(o):[]}catch(t){return console.log("=======err",t),[]}})(t);return s(o)},s=(t=[])=>{let e='<?xml version="1.0" encoding="UTF-8"?><D:multistatus xmlns:D="DAV:">';return t.forEach((t=>{e+="<D:response>",e+=`<D:href>/dav/${t.filename.replace("/","")}</D:href>`,e+="<D:propstat><D:prop>",e+=`<D:displayname>${t.basename}</D:displayname> `,e+=`<D:getlastmodified>${t.lastmod}</D:getlastmodified> `,e+=`<D:getcontentlength>${t.size}</D:getcontentlength>`,e+=`<D:resourcetype>${"directory"===t.type?'<D:collection xmlns:d="DAV:" />':""}</D:resourcetype>`,t.mime&&(e+=`<D:getcontenttype>${t.mime}</D:getcontenttype>`),t.etag&&(e+=`<D:getetag>${t.etag?`"${t.etag}"`:""}</D:getetag>`),e+="</D:prop><D:status>HTTP/1.1 200 OK</D:status></D:propstat>","directory"===t.type&&(e+="<D:propstat> <D:prop> <D:getcontentlength></D:getcontentlength> <D:getetag></D:getetag> <D:getcontenttype></D:getcontenttype> </D:prop> <D:status>HTTP/1.1 404 Not Found</D:status> </D:propstat>"),e+="</D:response>"})),e+="</D:multistatus>",e},a=async(t,e)=>{const s=decodeURIComponent("/dav"===t.url?"/":t.url.replace("/dav",""));console.log("=======path",s),s||e.send("参数错误");if(delete t.headers.host,"GET"===t.method){const{protocol:t,port:n,host:a,username:r,password:p}=await(console.log("=======config",o,"object"),new Promise((t=>t(o)))),c=`${t}://${r}:${p}@${a}:${n}/dav${encodeURIComponent(s)}`;e.redirect(c)}if("PROPFIND"===t.method){const t=await n(s);t?(e.set("Content-Type","application/xml"),e.status(207).send(t)):e.send("参数错误")}};export{s as convertToXML,a as webdavHandler};
