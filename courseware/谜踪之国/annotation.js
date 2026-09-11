(()=>{
  'use strict';

  const stage=document.getElementById('stage');
  const deck=document.getElementById('deck');
  const indicator=document.getElementById('pageIndicator');
  const topbar=document.querySelector('#topbar .toolbar');
  if(!stage||!deck||!indicator||!topbar) return;

  let drawBtn=document.getElementById('drawBtn');
  if(!drawBtn){
    drawBtn=document.createElement('button');
    drawBtn.id='drawBtn';
    drawBtn.title='批注（E）';
    drawBtn.textContent='批注';
    const fs=document.getElementById('fullscreenBtn');
    topbar.insertBefore(drawBtn,fs||null);
  }

  const canvas=document.createElement('canvas');
  canvas.id='annotationCanvas';
  canvas.setAttribute('aria-label','批注画布');
  stage.appendChild(canvas);
  const ctx=canvas.getContext('2d',{alpha:true});

  const toolbar=document.createElement('div');
  toolbar.id='inkToolbar';
  toolbar.className='hidden';
  toolbar.innerHTML=`
    <button type="button" data-tool="pen" class="active" title="画笔">画笔</button>
    <button type="button" data-tool="highlighter" title="荧光笔">荧光</button>
    <button type="button" data-tool="eraser" title="橡皮">橡皮</button>
    <span class="ink-sep"></span>
    <button type="button" class="ink-color active" data-color="#ff5a1f" style="--swatch:#ff5a1f" title="橙色"></button>
    <button type="button" class="ink-color" data-color="#e53935" style="--swatch:#e53935" title="红色"></button>
    <button type="button" class="ink-color" data-color="#2f6b4f" style="--swatch:#2f6b4f" title="绿色"></button>
    <button type="button" class="ink-color" data-color="#20221d" style="--swatch:#20221d" title="黑色"></button>
    <button type="button" class="ink-color" data-color="#f5f0e5" style="--swatch:#f5f0e5" title="白色"></button>
    <span class="ink-sep"></span>
    <label title="笔宽"><span>笔宽</span><input id="inkWidth" type="range" min="2" max="26" step="1" value="6"></label>
    <span class="ink-sep"></span>
    <button type="button" data-action="undo" title="撤销 Ctrl+Z">↶</button>
    <button type="button" data-action="redo" title="重做 Ctrl+Shift+Z">↷</button>
    <button type="button" data-action="clear" title="清除当前页批注">清页</button>
  `;
  stage.appendChild(toolbar);

  const toast=document.createElement('div');
  toast.className='ink-toast';
  stage.appendChild(toast);
  let toastTimer=0;
  function showToast(text){
    toast.textContent=text;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer=setTimeout(()=>toast.classList.remove('show'),1200);
  }

  const STORAGE_PREFIX='lecture-html-engine:mizong:ink:v2:';
  let enabled=false;
  let tool='pen';
  let color='#ff5a1f';
  let widthPx=6;
  let strokes=[];
  let redoStack=[];
  let currentStroke=null;
  let pointerId=null;
  let currentKey='';

  function pageKey(){
    const text=(indicator.textContent||'').trim();
    const no=(deck.querySelector('.page-no')?.textContent||'').trim();
    return (text||no||location.hash||'page-1').replace(/\s+/g,'_');
  }
  function storageKey(key=currentKey){return STORAGE_PREFIX+encodeURIComponent(key)}
  function loadPage(key){
    try{
      const raw=localStorage.getItem(storageKey(key));
      const data=raw?JSON.parse(raw):[];
      return Array.isArray(data)?data:[];
    }catch(_){return []}
  }
  function savePage(){
    if(!currentKey) return;
    try{localStorage.setItem(storageKey(),JSON.stringify(strokes))}catch(_){/* localStorage may be disabled */}
  }
  function syncPage(force=false){
    const key=pageKey();
    if(!force&&key===currentKey) return;
    if(currentKey) savePage();
    currentKey=key;
    strokes=loadPage(key);
    redoStack=[];
    redraw();
  }

  function fitCanvas(){
    const sr=stage.getBoundingClientRect();
    const dr=deck.getBoundingClientRect();
    const left=dr.left-sr.left;
    const top=dr.top-sr.top;
    canvas.style.left=`${left}px`;
    canvas.style.top=`${top}px`;
    canvas.style.width=`${dr.width}px`;
    canvas.style.height=`${dr.height}px`;
    const dpr=Math.max(1,Math.min(3,window.devicePixelRatio||1));
    const w=Math.max(1,Math.round(dr.width*dpr));
    const h=Math.max(1,Math.round(dr.height*dpr));
    if(canvas.width!==w||canvas.height!==h){
      canvas.width=w;canvas.height=h;
    }
    ctx.setTransform(dpr,0,0,dpr,0,0);
    redraw();
  }

  function cssSize(){return {w:canvas.clientWidth||1,h:canvas.clientHeight||1}}
  function pointFromEvent(ev){
    const r=canvas.getBoundingClientRect();
    return {
      x:Math.min(1,Math.max(0,(ev.clientX-r.left)/Math.max(1,r.width))),
      y:Math.min(1,Math.max(0,(ev.clientY-r.top)/Math.max(1,r.height)))
    };
  }

  function drawStroke(s){
    if(!s||!Array.isArray(s.points)||!s.points.length) return;
    const {w,h}=cssSize();
    ctx.save();
    ctx.lineCap='round';
    ctx.lineJoin='round';
    ctx.globalCompositeOperation=s.tool==='eraser'?'destination-out':'source-over';
    ctx.globalAlpha=s.tool==='highlighter'?0.3:1;
    ctx.strokeStyle=s.color||'#ff5a1f';
    ctx.fillStyle=s.color||'#ff5a1f';
    ctx.lineWidth=Math.max(1,(s.width||0.004)*w)*(s.tool==='eraser'?1.8:1);
    const p0=s.points[0];
    if(s.points.length===1){
      ctx.beginPath();
      ctx.arc(p0.x*w,p0.y*h,ctx.lineWidth/2,0,Math.PI*2);
      ctx.fill();
    }else{
      ctx.beginPath();
      ctx.moveTo(p0.x*w,p0.y*h);
      for(let i=1;i<s.points.length;i++){
        const p=s.points[i];
        ctx.lineTo(p.x*w,p.y*h);
      }
      ctx.stroke();
    }
    ctx.restore();
  }

  function redraw(){
    if(!ctx) return;
    const {w,h}=cssSize();
    ctx.save();
    ctx.globalCompositeOperation='source-over';
    ctx.globalAlpha=1;
    ctx.clearRect(0,0,w,h);
    ctx.restore();
    for(const s of strokes) drawStroke(s);
    if(currentStroke) drawStroke(currentStroke);
  }

  function setEnabled(on){
    enabled=!!on;
    if(!enabled&&currentStroke){currentStroke=null;pointerId=null;redraw()}
    canvas.classList.toggle('ink-active',enabled);
    toolbar.classList.toggle('hidden',!enabled);
    drawBtn.classList.toggle('active',enabled);
    drawBtn.setAttribute('aria-pressed',String(enabled));
    drawBtn.textContent=enabled?'退出批注':'批注';
    if(enabled){
      fitCanvas();
      syncPage();
      showToast('批注模式：E / Esc 退出，Ctrl+Z 撤销');
    }else{
      savePage();
    }
  }

  function setTool(next){
    tool=next;
    toolbar.querySelectorAll('[data-tool]').forEach(b=>b.classList.toggle('active',b.dataset.tool===tool));
  }
  function setColor(next){
    color=next;
    toolbar.querySelectorAll('.ink-color').forEach(b=>b.classList.toggle('active',b.dataset.color===color));
  }
  function undo(){
    if(!strokes.length) return;
    redoStack.push(strokes.pop());
    savePage();redraw();
  }
  function redo(){
    if(!redoStack.length) return;
    strokes.push(redoStack.pop());
    savePage();redraw();
  }
  function clearPage(){
    if(!strokes.length) return;
    if(!confirm('清除当前页全部批注？')) return;
    redoStack.push(...strokes.splice(0));
    savePage();redraw();
    showToast('已清除当前页批注');
  }

  drawBtn.addEventListener('click',()=>setEnabled(!enabled));
  toolbar.addEventListener('click',ev=>{
    const b=ev.target.closest('button');
    if(!b) return;
    if(b.dataset.tool) setTool(b.dataset.tool);
    if(b.dataset.color) setColor(b.dataset.color);
    if(b.dataset.action==='undo') undo();
    if(b.dataset.action==='redo') redo();
    if(b.dataset.action==='clear') clearPage();
  });
  toolbar.querySelector('#inkWidth').addEventListener('input',ev=>{widthPx=Number(ev.target.value)||6});

  canvas.addEventListener('pointerdown',ev=>{
    if(!enabled||pointerId!==null) return;
    ev.preventDefault();
    syncPage();
    pointerId=ev.pointerId;
    try{canvas.setPointerCapture(pointerId)}catch(_){ }
    const p=pointFromEvent(ev);
    currentStroke={tool,color,width:widthPx/Math.max(1,canvas.clientWidth),points:[p]};
    redraw();
  });
  canvas.addEventListener('pointermove',ev=>{
    if(!enabled||ev.pointerId!==pointerId||!currentStroke) return;
    ev.preventDefault();
    const p=pointFromEvent(ev);
    const last=currentStroke.points[currentStroke.points.length-1];
    const dx=p.x-last.x,dy=p.y-last.y;
    if(dx*dx+dy*dy<0.000003) return;
    currentStroke.points.push(p);
    redraw();
  });
  function finishStroke(ev){
    if(ev&&pointerId!==null&&ev.pointerId!==pointerId) return;
    if(!currentStroke){pointerId=null;return}
    strokes.push(currentStroke);
    currentStroke=null;
    redoStack=[];
    pointerId=null;
    savePage();redraw();
  }
  canvas.addEventListener('pointerup',finishStroke);
  canvas.addEventListener('pointercancel',finishStroke);
  canvas.addEventListener('lostpointercapture',()=>{if(currentStroke) finishStroke()});

  window.addEventListener('keydown',ev=>{
    const tag=(ev.target&&ev.target.tagName||'').toLowerCase();
    if(tag==='input'||tag==='textarea'||tag==='select') return;
    const key=ev.key.toLowerCase();
    if(key==='e'){
      ev.preventDefault();ev.stopImmediatePropagation();
      setEnabled(!enabled);return;
    }
    if(enabled&&(ev.ctrlKey||ev.metaKey)&&key==='z'){
      ev.preventDefault();ev.stopImmediatePropagation();
      ev.shiftKey?redo():undo();return;
    }
    if(enabled&&ev.key==='Escape'){
      ev.preventDefault();ev.stopImmediatePropagation();
      setEnabled(false);
    }
  },true);

  const pageObserver=new MutationObserver(()=>queueMicrotask(()=>syncPage()));
  pageObserver.observe(indicator,{subtree:true,childList:true,characterData:true});
  const deckObserver=new MutationObserver(()=>requestAnimationFrame(()=>{fitCanvas();syncPage()}));
  deckObserver.observe(deck,{subtree:false,childList:true});
  if('ResizeObserver' in window){
    new ResizeObserver(()=>fitCanvas()).observe(deck);
  }
  window.addEventListener('resize',()=>requestAnimationFrame(fitCanvas));
  window.addEventListener('beforeunload',savePage);

  currentKey=pageKey();
  strokes=loadPage(currentKey);
  requestAnimationFrame(()=>{fitCanvas();redraw()});

  window.mizongAnnotations={
    enable:()=>setEnabled(true),disable:()=>setEnabled(false),undo,redo,clear:clearPage,save:savePage,
    get enabled(){return enabled},get page(){return currentKey}
  };
})();
