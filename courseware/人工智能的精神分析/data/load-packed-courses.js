(async()=>{
  const keys=['0709','1012','1315','1618','1921','2222'];
  if(typeof DecompressionStream==='undefined'){
    document.body.innerHTML='<main style="padding:10vh;font-family:system-ui;background:#111;color:#fff;min-height:100vh"><h1 style="color:#ff5a1f">浏览器版本过旧</h1><p>本课件需要支持 DecompressionStream 的新版 Chrome / Edge。</p></main>';
    return;
  }
  try{
    for(const key of keys){
      const parts=window.__COURSE_PACK_PARTS__?.[key];
      if(!parts||parts.some(v=>!v)) throw new Error('课程数据分片缺失：'+key);
      const binary=atob(parts.join(''));
      const bytes=new Uint8Array(binary.length);
      for(let i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i);
      const stream=new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
      const code=await new Response(stream).text();
      (0,eval)(code);
    }
    delete window.__COURSE_PACK_PARTS__;
    const script=document.createElement('script');
    script.src='../../engine/lecture-engine.js';
    script.onerror=()=>{document.body.innerHTML='<main style="padding:10vh;font-family:system-ui;background:#111;color:#fff;min-height:100vh"><h1 style="color:#ff5a1f">引擎加载失败</h1><p>请确认整个仓库目录已完整下载。</p></main>'};
    document.body.appendChild(script);
  }catch(err){
    console.error(err);
    document.body.innerHTML='<main style="padding:10vh;font-family:system-ui;background:#111;color:#fff;min-height:100vh"><h1 style="color:#ff5a1f">课件数据加载失败</h1><pre style="white-space:pre-wrap">'+String(err)+'</pre></main>';
  }
})();
