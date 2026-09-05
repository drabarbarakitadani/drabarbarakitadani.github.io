const http=require('node:http');const fs=require('node:fs');const path=require('node:path');
const root=require('node:path').resolve(process.env.ROOT||__dirname);
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.mp4':'video/mp4','.woff2':'font/woff2','.webp':'image/webp','.ico':'image/x-icon','.json':'application/json','.txt':'text/plain; charset=utf-8','.xml':'application/xml'};
const server=http.createServer((req,res)=>{
let pathname;try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400).end();return;}
const file=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
if(!file.startsWith(root+path.sep)||pathname.split('/').some(p=>p.startsWith('.'))){res.writeHead(403).end();return;}
fs.stat(file,(err,stat)=>{if(err||!stat.isFile()){res.writeHead(404).end();return;}
let start=0,end=stat.size-1,status=200;
if(req.headers.range){const m=/^bytes=(\d+)-(\d*)$/.exec(req.headers.range);if(!m){res.writeHead(416).end();return;}start=Number(m[1]);end=m[2]?Number(m[2]):end;if(start>end||end>=stat.size){res.writeHead(416,{'Content-Range':'bytes */'+stat.size}).end();return;}status=206;}
const headers={'Content-Type':types[path.extname(file).toLowerCase()]||'application/octet-stream','Content-Length':end-start+1,'Accept-Ranges':'bytes'};if(status===206)headers['Content-Range']='bytes '+start+'-'+end+'/'+stat.size;
res.writeHead(status,headers);if(req.method==='HEAD'){res.end();return;}fs.createReadStream(file,{start,end}).on('error',()=>res.destroy()).pipe(res);
});
});
server.listen(Number(process.env.PORT ?? 4173),'127.0.0.1',()=>console.log('Servindo '+root+': http://127.0.0.1:'+server.address().port));
