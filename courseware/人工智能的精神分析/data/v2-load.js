(async()=>{
  if(typeof DecompressionStream==='undefined'){
    document.body.innerHTML='<main style="padding:10vh;font-family:system-ui;background:#111;color:#fff;min-height:100vh"><h1 style="color:#d86b45">浏览器版本过旧</h1><p>本课件需要支持 DecompressionStream 的新版 Chrome / Edge。</p></main>';
    return;
  }
  try{
    const parts=window.__V2_PARTS__;
    if(!parts||parts.length!==4||parts.some(v=>!v))throw new Error('V2课程数据分片缺失');
    window.__V2_COURSES__=[];
    window.addV2Course=(c)=>window.__V2_COURSES__.push(c);
    const binary=atob(parts.join(''));
    const bytes=new Uint8Array(binary.length);
    for(let i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i);
    const stream=new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
    const code=await new Response(stream).text();
    (0,eval)(code);
    const LABEL={B:'书中观点',E:'解释性转述',M:'我的延伸'};
    const AUTH={B:'作者正文·伊莎贝尔·米拉',E:'教学解释（据米拉正文）',M:'课程延伸'};
    let gi=1;
    window.COURSE_DATA=(window.__V2_COURSES__||[]).map(c=>{
      const total=c.slides.length;
      return {id:c.id,title:c.title,hook:c.hook,minutes:c.minutes,terms:c.terms,slides:c.slides.map((s,i)=>{
        const labels=[...new Set((s.p||[]).map(x=>x[0]))];
        const label=labels.length===1?LABEL[labels[0]]:'逐块标注';
        const authority=labels.length===1?AUTH[labels[0]]:'原书观点 / 教学转述分块标注';
        const points=(s.p||[]).map(([k,text])=>`【${LABEL[k]}】${text}`);
        const first=(s.p?.[0]?.[1]||'').replace(/[。！？!?].*$/,'');
        const last=(s.p?.[s.p.length-1]?.[1]||'').replace(/[。！？!?].*$/,'');
        const note=s.n||`这一页只完成一个动作：${s.g}。先把“${first}”讲清楚，再用“${last}”收束；不要提前把下一页的理论一起讲完。`;
        const next=c.slides[i+1]?.t;
        return {id:`c${c.id}-s${String(i+1).padStart(2,'0')}`,globalIndex:gi++,courseId:c.id,localIndex:i+1,localTotal:total,title:s.t,goal:s.g,label,authority,source:s.src||c.source,layout:s.l||'statement',points,terms:[s.t,...c.terms].slice(0,5),formula:s.formula||'',cue:s.g,pitfall:s.pit||c.pitfall,bridge:next?`下一页只继续一个问题：“${next}”。`:`本课在这里停下；回到课程目录进入下一课。`,speakerNotes:note};
      })};
    });
    delete window.__V2_PARTS__; delete window.__V2_COURSES__; delete window.addV2Course;
    const script=document.createElement('script');
    script.src='../../engine/lecture-engine.js';
    script.onerror=()=>{document.body.innerHTML='<main style="padding:10vh;font-family:system-ui;background:#111;color:#fff;min-height:100vh"><h1 style="color:#d86b45">引擎加载失败</h1><p>请确认整个仓库目录已完整下载。</p></main>'};
    script.onload=()=>{
      const v3=document.createElement('script');
      v3.src='v3-enhance.js';
      v3.onerror=()=>console.error('V3 enhancer failed to load');
      document.body.appendChild(v3);
    };
    document.body.appendChild(script);
  }catch(err){
    console.error(err);
    document.body.innerHTML='<main style="padding:10vh;font-family:system-ui;background:#111;color:#fff;min-height:100vh"><h1 style="color:#d86b45">课件数据加载失败</h1><pre style="white-space:pre-wrap">'+String(err)+'</pre></main>';
  }
})();
