(()=>{
  const LABELS={
    '书中观点':{code:'BOOK',cls:'book'},
    '解释性转述':{code:'EXPLAIN',cls:'explain'},
    '我的延伸':{code:'EXTENSION',cls:'extension'}
  };
  const courseById=id=>(window.COURSE_DATA||[]).find(c=>String(c.id)===String(id).padStart(2,'0'));
  const currentSlide=()=>{
    try{return typeof flatSlides!=='undefined'&&typeof state!=='undefined'?flatSlides[state.globalIndex]:null}catch(_){return null}
  };
  const escHtml=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const courseIdFromStage=()=>{
    const text=document.querySelector('#stage .slide-course')?.textContent||'';
    const m=text.match(/COURSE\s+(\d+)/i); return m?m[1].padStart(2,'0'):null;
  };

  function titleClass(title){
    const n=[...String(title||'')].length;
    if(n<=10)return 'v3-title-short';
    if(n<=18)return 'v3-title-medium';
    if(n<=28)return 'v3-title-long';
    return 'v3-title-xlong';
  }

  function setSemanticTheme(article,title){
    article.classList.remove('v3-theme-case','v3-theme-warning','v3-theme-core');
    if(article.classList.contains('layout-case')) article.classList.add('v3-theme-case');
    if(/误区|警告|危险|悖论|苦难|惩罚/.test(title)&&!article.classList.contains('layout-chapter')) article.classList.add('v3-theme-warning');
    if(/结论|人是什么|数元与焦虑|蛇妖回返|课程结束/.test(title)&&!article.classList.contains('layout-chapter')) article.classList.add('v3-theme-core');
    if(article.classList.contains('v3-theme-case')||article.classList.contains('v3-theme-core')){
      article.classList.remove('light','orange'); article.classList.add('dark');
    }else if(article.classList.contains('v3-theme-warning')){
      article.classList.remove('light','dark'); article.classList.add('orange');
    }else if(article.classList.contains('orange')&&!article.classList.contains('layout-signal')){
      article.classList.remove('orange'); article.classList.add('light');
    }
  }

  function transformPoints(article){
    const list=article.querySelector('.point-list'); if(!list)return;
    const seqLayouts=['layout-timeline','layout-process','layout-formula-step','layout-axis'];
    const title=article.querySelector('.slide-title')?.textContent||'';
    const shouldNumber=seqLayouts.some(c=>article.classList.contains(c))||/第一式|第二式|三重|三阶段|逐步|步骤|旋转规则|如何读/.test(title);
    list.classList.toggle('v3-numbered',shouldNumber);
    [...list.querySelectorAll('.point')].forEach((li,i)=>{
      if(li.dataset.v3==='1')return;
      const raw=li.textContent.trim();
      const m=raw.match(/^【([^】]+)】\s*(.*)$/s);
      if(m){
        const meta=LABELS[m[1]]||{code:m[1],cls:'explain'};
        li.classList.add('v3-point');
        li.innerHTML=`<span class="v3-point-badge v3-badge-${meta.cls}">${escHtml(meta.code)}</span><span class="v3-point-text">${escHtml(m[2])}</span>`;
      }
      li.dataset.v3='1';
      if(!shouldNumber)li.removeAttribute('data-n');
      else li.dataset.n=String(i+1).padStart(2,'0');
    });
  }

  function tuneTerms(article,s){
    const box=article.querySelector('.terms'); if(!box)return;
    if(article.classList.contains('layout-chapter')){box.classList.add('v3-terms-hidden');return}
    const title=article.querySelector('.slide-title')?.textContent||'';
    const els=[...box.querySelectorAll('.term')];
    let kept=0;
    els.forEach((el,i)=>{
      const t=el.textContent.trim();
      const formal=title.includes(t)&&t!==title;
      const early=(s?.localIndex||99)<=2&&i>0;
      if(i===0||(!formal&&!early))el.remove(); else kept++;
    });
    if(!kept)box.classList.add('v3-terms-hidden');
  }

  function chapterPoster(article,s){
    if(!article.classList.contains('layout-chapter'))return;
    const body=article.querySelector('.slide-body'); if(!body||body.querySelector('.chapter-hook'))return;
    const course=courseById(s?.courseId||courseIdFromStage());
    const hook=course?.hook||s?.courseHook||s?.goal||'';
    const no=String(s?.courseId||courseIdFromStage()||'').padStart(2,'0');
    const hookEl=document.createElement('p');hookEl.className='chapter-hook';hookEl.textContent=hook;
    const code=document.createElement('div');code.className='chapter-code';code.textContent='PSYCHOANALYSIS OF ARTIFICIAL INTELLIGENCE · LECTURE SERIES';
    const num=document.createElement('div');num.className='chapter-poster-number';num.textContent=no;
    const stripe=document.createElement('div');stripe.className='chapter-stripe';
    body.append(hookEl,code,num,stripe);
  }

  function sourceAndPage(article,s){
    const source=article.querySelector('.source');
    if(source){
      const first=source.textContent.split('\n')[0].replace(/^SOURCE\s*·\s*/i,'').trim();
      source.textContent=`SOURCE · ${first}`;
    }
    const page=article.querySelector('.page-code');
    if(page&&s)page.textContent=`C${s.courseId} · ${s.localIndex}/${s.localTotal}`;
    const hud=document.querySelector('#hudPage');
    if(hud&&s)hud.textContent=`C${s.courseId} · ${s.localIndex}/${s.localTotal}`;
    const type=article.querySelector('.slide-type');
    if(type&&s)type.textContent=s.label||'';
  }

  function caseFile(article,s){
    if(!article.classList.contains('layout-case'))return;
    const body=article.querySelector('.slide-body'); if(!body||body.querySelector('.case-kicker'))return;
    const kicker=document.createElement('div');kicker.className='case-kicker';kicker.textContent=`CASE FILE · C${s?.courseId||''}-${String(s?.localIndex||'').padStart(2,'0')}`;
    body.prepend(kicker);
  }

  function wrapForVisual(article){
    const body=article.querySelector('.slide-body');
    if(!body||body.classList.contains('v3-visual-layout'))return null;
    const copy=document.createElement('div');copy.className='v3-copy';
    [...body.childNodes].filter(n=>!(n.nodeType===1&&n.classList?.contains('ornament'))).forEach(n=>copy.appendChild(n));
    body.prepend(copy);body.classList.add('v3-visual-layout');
    return body;
  }

  function visualMoebius(){return `<svg viewBox="0 0 560 420" role="img" aria-label="莫比乌斯带示意"><defs><linearGradient id="mbg" x1="0" x2="1"><stop offset="0" stop-color="var(--orange)"/><stop offset="1" stop-color="var(--purple)"/></linearGradient></defs><path d="M90 220 C125 105 245 80 320 150 C392 216 408 304 340 330 C268 358 180 292 206 208 C229 136 336 103 451 173" fill="none" stroke="url(#mbg)" stroke-width="34" stroke-linecap="round"/><path d="M93 222 C155 315 256 344 338 302 C417 262 431 164 365 118" class="svg-soft"/><circle cx="91" cy="220" r="10" fill="var(--orange)"/><circle cx="451" cy="173" r="10" fill="var(--purple)"/><text x="72" y="268" class="svg-label">“内部”</text><text x="403" y="215" class="svg-label">“外部”</text><text x="138" y="384" class="svg-small">沿同一表面行走，不跨越边界，也会从内来到外</text></svg>`}
  function visualHyperstition(){return `<svg viewBox="0 0 560 430" role="img" aria-label="超迷信反馈环"><defs><marker id="arr1" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="var(--orange)"/></marker></defs><circle cx="280" cy="215" r="145" class="svg-soft" opacity=".35"/><g><rect x="205" y="22" width="150" height="64" rx="4" class="svg-node"/><text x="280" y="61" text-anchor="middle" class="svg-label">叙事 / 想象</text><rect x="388" y="174" width="150" height="64" rx="4" class="svg-node"/><text x="463" y="213" text-anchor="middle" class="svg-label">信念 / 行动</text><rect x="205" y="344" width="150" height="64" rx="4" class="svg-node"/><text x="280" y="383" text-anchor="middle" class="svg-label">制度 / 技术</text><rect x="22" y="174" width="150" height="64" rx="4" class="svg-node"/><text x="97" y="213" text-anchor="middle" class="svg-label">现实反馈</text></g><path d="M350 76 C425 98 458 123 463 170" class="svg-line" marker-end="url(#arr1)"/><path d="M455 238 C435 304 390 345 352 365" class="svg-line" marker-end="url(#arr1)"/><path d="M205 372 C132 350 98 306 96 241" class="svg-line" marker-end="url(#arr1)"/><path d="M101 174 C132 112 177 82 210 70" class="svg-line" marker-end="url(#arr1)"/><text x="280" y="224" text-anchor="middle" class="svg-small">虚构不是自动成真，而是进入现实因果链</text></svg>`}
  function visualLathouse(){return `<svg viewBox="0 0 560 430" role="img" aria-label="抽灵机与真理球回路"><defs><marker id="arr2" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="var(--orange)"/></marker></defs><rect x="20" y="165" width="135" height="90" rx="8" class="svg-node"/><text x="88" y="204" text-anchor="middle" class="svg-label">言说身体</text><text x="88" y="230" text-anchor="middle" class="svg-small">声音 · 目光 · 痕迹</text><rect x="211" y="150" width="140" height="120" rx="8" class="svg-node"/><text x="281" y="195" text-anchor="middle" class="svg-label">抽灵机</text><text x="281" y="223" text-anchor="middle" class="svg-small">抽取 / 编码</text><circle cx="465" cy="210" r="72" fill="rgba(103,86,168,.12)" stroke="var(--purple)" stroke-width="3"/><text x="465" y="205" text-anchor="middle" class="svg-label">真理球</text><text x="465" y="233" text-anchor="middle" class="svg-small">存储 / 无蔽</text><path d="M155 210 L207 210" class="svg-line" marker-end="url(#arr2)"/><path d="M351 210 L388 210" class="svg-line" marker-end="url(#arr2)"/><path d="M456 285 C430 370 125 375 91 267" class="svg-soft" marker-end="url(#arr2)"/><text x="280" y="397" text-anchor="middle" class="svg-small">数据再返回身体：推荐、提醒、排序、可见性</text></svg>`}
  function visualDeaths(){return `<svg viewBox="0 0 560 430" role="img" aria-label="三种死亡结构"><g transform="translate(30,55)"><rect width="150" height="285" rx="6" class="svg-node"/><text x="75" y="55" text-anchor="middle" class="svg-label">现实中的死亡</text><text x="75" y="94" text-anchor="middle" class="svg-small">肉身生命终止</text><path d="M35 145 H115" class="svg-line"/><text x="75" y="205" text-anchor="middle" class="svg-small">生物时间</text></g><g transform="translate(205,55)"><rect width="150" height="285" rx="6" fill="rgba(103,86,168,.10)" stroke="var(--purple)" stroke-width="2"/><text x="75" y="55" text-anchor="middle" class="svg-label">实在死亡</text><text x="75" y="94" text-anchor="middle" class="svg-small">从大他者场域抹除</text><path d="M35 145 H115" class="svg-soft"/><text x="75" y="205" text-anchor="middle" class="svg-small">不必等同肉身终止</text></g><g transform="translate(380,55)"><rect width="150" height="285" rx="6" class="svg-node"/><text x="75" y="55" text-anchor="middle" class="svg-label">符号死亡</text><text x="75" y="94" text-anchor="middle" class="svg-small">符号秩序彻底抹除</text><path d="M35 145 H115" class="svg-line"/><text x="75" y="205" text-anchor="middle" class="svg-small">极限 / 悖论状态</text></g><text x="280" y="390" text-anchor="middle" class="svg-small">三者必须区分，不能压成“身体死两次”</text></svg>`}
  function visualSnakeDavid(){return `<svg viewBox="0 0 560 430" role="img" aria-label="蛇妖与大卫的首尾回环"><defs><marker id="arr3" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="var(--orange)"/></marker></defs><circle cx="140" cy="210" r="92" class="svg-node"/><text x="140" y="198" text-anchor="middle" class="svg-label">蛇妖</text><text x="140" y="229" text-anchor="middle" class="svg-small">未来AI审判现在</text><circle cx="420" cy="210" r="92" fill="rgba(103,86,168,.1)" stroke="var(--purple)" stroke-width="3"/><text x="420" y="198" text-anchor="middle" class="svg-label">大卫</text><text x="420" y="229" text-anchor="middle" class="svg-small">AI等待人的爱</text><path d="M220 165 C285 88 350 90 386 137" class="svg-line" marker-end="url(#arr3)"/><path d="M340 286 C278 348 213 337 173 290" class="svg-soft" marker-end="url(#arr3)"/><text x="280" y="62" text-anchor="middle" class="svg-small">吞噬性的大他者幻想</text><text x="280" y="382" text-anchor="middle" class="svg-small">欲望、等待与焦虑</text></svg>`}

  function discourseVisual(){
    return `<div class="v3-discourse-rotator" data-discourse-step="0"><div class="discourse-caption"><div class="discourse-name">四个位置固定，元素轮转</div><button class="v3-rotate-btn" type="button" data-v3-rotate>旋转辞说 R</button></div><div class="discourse-grid"><div class="discourse-slot" data-slot="agent"><span class="discourse-pos">代理者 / agent</span><strong class="discourse-value">—</strong></div><div class="discourse-slot" data-slot="other"><span class="discourse-pos">大他者 / other</span><strong class="discourse-value">—</strong></div><div class="discourse-slot" data-slot="truth"><span class="discourse-pos">真理 / truth</span><strong class="discourse-value">—</strong></div><div class="discourse-slot" data-slot="product"><span class="discourse-pos">产品 / product</span><strong class="discourse-value">—</strong></div><div class="discourse-arrow">→</div><div class="discourse-divider"></div></div><div class="discourse-help">SPACE：主人 → 大学 → 癔症 → 分析家；位置不动，S₁ / S₂ / $ / a 每次旋转四分之一圈</div></div>`;
  }

  const discourseStates=[
    {name:'等待开始',agent:'—',other:'—',truth:'—',product:'—'},
    {name:'主人辞说',agent:'S₁',other:'S₂',truth:'$',product:'a'},
    {name:'大学辞说',agent:'S₂',other:'a',truth:'S₁',product:'$'},
    {name:'癔症辞说',agent:'$',other:'S₁',truth:'a',product:'S₂'},
    {name:'分析家辞说',agent:'a',other:'$',truth:'S₂',product:'S₁'}
  ];

  function syncDiscourse(){
    const box=document.querySelector('#stage .v3-discourse-rotator'); if(!box)return;
    let step=0;
    const markers=[...document.querySelectorAll('#stage .v3-discourse-marker')];
    if(markers.length)step=markers.filter(m=>!m.classList.contains('unrevealed')).length;
    else step=Number(box.dataset.manualStep||0);
    step=Math.max(0,Math.min(4,step));box.dataset.discourseStep=step;
    const st=discourseStates[step];
    box.querySelector('.discourse-name').textContent=st.name;
    ['agent','other','truth','product'].forEach(k=>{
      const slot=box.querySelector(`[data-slot="${k}"]`); if(!slot)return;
      slot.querySelector('.discourse-value').textContent=st[k];
      slot.classList.remove('v3-pulse'); requestAnimationFrame(()=>slot.classList.add('v3-pulse')); setTimeout(()=>slot.classList.remove('v3-pulse'),330);
    });
  }

  function addDiscourseMarkers(article){
    if(article.dataset.v3DiscourseMarkers==='1')return;
    const existing=[...article.querySelectorAll('[data-step]')];
    existing.forEach(el=>{el.dataset.step=String(Number(el.dataset.step||0)+4)});
    const body=article.querySelector('.slide-body');
    for(let i=1;i<=4;i++){
      const m=document.createElement('span');m.className='v3-discourse-marker unrevealed';m.dataset.step=String(i);body.appendChild(m);
    }
    article.dataset.v3DiscourseMarkers='1';
  }

  function addVisual(article,s){
    if(article.dataset.v3Visual==='1'||article.classList.contains('layout-chapter')||article.classList.contains('layout-case'))return;
    const title=article.querySelector('.slide-title')?.textContent||'';
    let html='';let type='';
    if(/莫比乌斯/.test(title)){html=visualMoebius();type='moebius'}
    else if(/反馈回路|超迷信/.test(title)){html=visualHyperstition();type='hyperstition'}
    else if(/图3\.1|抽灵机.*真理球|真理球.*抽灵机|对象a如何接入抽灵机/.test(title)){html=visualLathouse();type='lathouse'}
    else if(/三种死亡的结构比较|三种死亡/.test(title)){html=visualDeaths();type='deaths'}
    else if(/蛇妖回返|同一条莫比乌斯带/.test(title)){html=visualSnakeDavid();type='snake-david'}
    else if(/旋转规则|位置不动.*元素|元素.*轮转/.test(title)){html=discourseVisual();type='discourse'}
    if(!html)return;
    const body=wrapForVisual(article); if(!body)return;
    const visual=document.createElement('div');visual.className=`v3-visual v3-visual-${type}`;visual.innerHTML=html;body.appendChild(visual);
    article.dataset.v3Visual='1';
    if(type==='discourse'){addDiscourseMarkers(article);syncDiscourse()}
  }

  function enhanceStage(){
    const stage=document.querySelector('#stage');const article=stage?.querySelector('.slide-shell'); if(!stage||!article)return;
    const s=currentSlide();
    const titleEl=article.querySelector('.slide-title');const title=titleEl?.textContent||'';
    const key=`${s?.id||courseIdFromStage()||''}|${title}`;
    if(stage.dataset.v3Key===key)return;
    stage.dataset.v3Key=key;article.classList.add('v3-slide');
    if(titleEl){titleEl.classList.remove('v3-title-short','v3-title-medium','v3-title-long','v3-title-xlong');titleEl.classList.add(titleClass(title))}
    setSemanticTheme(article,title);
    const deck=article.querySelector('.slide-deck');
    const showDeck=article.classList.contains('layout-question')||article.classList.contains('layout-hook')||article.classList.contains('layout-chapter');
    if(deck)deck.classList.toggle('v3-hide-deck',!showDeck||article.classList.contains('layout-chapter'));
    transformPoints(article); tuneTerms(article,s); chapterPoster(article,s); caseFile(article,s); sourceAndPage(article,s); addVisual(article,s);
    if((article.classList.contains('layout-split-left')||article.classList.contains('layout-split-right'))&&(article.querySelectorAll('.point').length>=4||title.length>20))article.classList.add('v3-split-balanced');
    requestAnimationFrame(()=>{try{if(typeof resizeStage==='function')resizeStage()}catch(_){}});
  }

  function groupHome(){
    const home=document.querySelector('#homeView');const grid=home?.querySelector('.course-grid');
    if(!grid||grid.classList.contains('v3-grouped'))return;
    const cards=[...grid.querySelectorAll('.course-card')]; if(cards.length<10)return;
    const defs=[
      {title:'导论 · 为什么AI能进入精神分析？',range:[1,3],code:'INTRODUCTION'},
      {title:'第一部分 · 概念工具',range:[4,16],code:'PART I · CONCEPTUAL TOOLS'},
      {title:'第二部分 · 康德四问',range:[17,23],code:'PART II · KANT\'S FOUR QUESTIONS'}
    ];
    grid.innerHTML='';grid.classList.add('v3-grouped');
    defs.forEach(g=>{
      const sec=document.createElement('section');sec.className='v3-course-group';
      sec.innerHTML=`<header class="v3-group-head"><b>${escHtml(g.title)}</b><span>${escHtml(g.code)}</span></header><div class="v3-group-grid"></div>`;
      const inner=sec.querySelector('.v3-group-grid');
      cards.filter(card=>{const id=Number(card.dataset.course);return id>=g.range[0]&&id<=g.range[1]}).forEach(c=>inner.appendChild(c));
      grid.appendChild(sec);
    });
  }

  function buildKnowledgeGraph(){
    const panel=[...document.querySelectorAll('.panel')].find(p=>p.querySelector('.panel-head h2')?.textContent.includes('知识地图'));
    const grid=panel?.querySelector('.map-grid'); if(!panel||!grid||grid.dataset.v3==='1')return;
    const courses=window.COURSE_DATA||[]; if(!courses.length)return;
    const rows=[[1,2,3],[4,5,6,7,8,9],[10,11,12,13,14,15,16],[17,18,19,20,21,22,23]];
    const W=1200,H=760,nodeW=142,nodeH=72,marginX=42,top=46,rowGap=170;
    const pos={};
    rows.forEach((ids,r)=>{
      const usable=W-2*marginX;const step=ids.length===1?0:(usable-nodeW)/(ids.length-1);
      ids.forEach((id,i)=>pos[id]={x:marginX+i*step,y:top+r*rowGap});
    });
    const edges=[];
    for(let i=1;i<courses.length;i++)edges.push([i,i+1,'main']);
    const find=kw=>{const c=courses.find(c=>String(c.title).includes(kw));return c?Number(c.id):null};
    [['蛇妖','外密性'],['抽灵机','对象'],['性的非关系','性化公式'],['性化公式','享乐'],['享乐','四大辞说'],['死亡','人是什么'],['我可以希望什么','人是什么']].forEach(([a,b])=>{const A=find(a),B=find(b);if(A&&B&&A!==B)edges.push([A,B,'cross'])});
    const pathFor=(a,b)=>{const A=pos[a],B=pos[b];if(!A||!B)return'';const x1=A.x+nodeW/2,y1=A.y+nodeH/2,x2=B.x+nodeW/2,y2=B.y+nodeH/2;const mid=(y1+y2)/2;return`M${x1},${y1} C${x1},${mid} ${x2},${mid} ${x2},${y2}`};
    const svg=`<div class="kg-legend"><span><i></i>原书推进</span><span><i class="cross"></i>概念回路</span></div><div class="kg-shell"><svg viewBox="0 0 ${W} ${H}" aria-label="课程知识关系图">${edges.map(([a,b,k])=>`<path d="${pathFor(a,b)}" class="kg-edge ${k==='cross'?'cross':''}"/>`).join('')}${courses.map(c=>{const id=Number(c.id),p=pos[id];if(!p)return'';return`<foreignObject x="${p.x}" y="${p.y}" width="${nodeW}" height="${nodeH}"><button xmlns="http://www.w3.org/1999/xhtml" class="kg-node" data-course-jump="${escHtml(c.id)}"><b>C${escHtml(c.id)}</b><span>${escHtml(c.title)}</span></button></foreignObject>`}).join('')}</svg></div>`;
    const oldIntro=grid.previousElementSibling;if(oldIntro?.tagName==='P')oldIntro.remove();
    grid.outerHTML=svg;
  }

  function noteLayoutSync(){
    const drawer=document.querySelector('#notesDrawer');if(!drawer)return;
    const obs=new MutationObserver(()=>setTimeout(()=>{try{if(typeof resizeStage==='function')resizeStage()}catch(_){}} ,25));
    obs.observe(drawer,{attributes:true,attributeFilter:['class']});
  }

  function fullscreenChrome(){
    let pinned=false,timer=null;
    const nav=()=>document.querySelector('.lecture-chrome');
    document.addEventListener('mousemove',e=>{
      if(!document.fullscreenElement)return;
      const n=nav();if(!n||pinned)return;
      const near=e.clientY>window.innerHeight-115;
      n.classList.toggle('v3-chrome-visible',near);
      clearTimeout(timer);if(near)timer=setTimeout(()=>n.classList.remove('v3-chrome-visible'),1800);
    });
    document.addEventListener('keydown',e=>{
      if(e.key==='Tab'&&document.fullscreenElement){e.preventDefault();pinned=!pinned;nav()?.classList.toggle('v3-chrome-pinned',pinned)}
      if((e.key==='r'||e.key==='R')&&document.querySelector('#stage .v3-discourse-rotator')){e.preventDefault();rotateDiscourseManual()}
      if(e.code==='Space')setTimeout(syncDiscourse,0);
    });
    document.addEventListener('fullscreenchange',()=>{if(!document.fullscreenElement){pinned=false;nav()?.classList.remove('v3-chrome-visible','v3-chrome-pinned')}});
  }

  function rotateDiscourseManual(){
    const box=document.querySelector('#stage .v3-discourse-rotator');if(!box)return;
    const next=(Number(box.dataset.manualStep||0)%4)+1;box.dataset.manualStep=String(next);
    const markers=[...document.querySelectorAll('#stage .v3-discourse-marker')];
    if(markers.length){markers.forEach((m,i)=>m.classList.toggle('unrevealed',i>=next));}
    syncDiscourse();
  }

  document.addEventListener('click',e=>{
    if(e.target.closest('[data-v3-rotate]')){e.preventDefault();e.stopPropagation();rotateDiscourseManual();return}
    if(e.target.closest('[data-action="next"]'))setTimeout(syncDiscourse,0);
    if(e.target.closest('[data-action="map"]')||e.target.closest('[data-home-action="map"]'))setTimeout(buildKnowledgeGraph,0);
  });

  const stage=document.querySelector('#stage');
  if(stage)new MutationObserver(()=>queueMicrotask(enhanceStage)).observe(stage,{childList:true,subtree:false});
  const home=document.querySelector('#homeView');
  if(home)new MutationObserver(()=>queueMicrotask(groupHome)).observe(home,{childList:true,subtree:true});
  const modal=document.querySelector('#modalRoot');
  if(modal)new MutationObserver(()=>queueMicrotask(buildKnowledgeGraph)).observe(modal,{childList:true,subtree:true});
  noteLayoutSync();fullscreenChrome();
  enhanceStage();groupHome();
})();
