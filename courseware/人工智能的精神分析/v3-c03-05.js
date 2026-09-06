(()=>{
  const stage=document.querySelector('#stage');
  if(!stage)return;
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const now=()=>{try{return flatSlides[state.globalIndex]}catch(_){return null}};
  const palette={03:'EXTIMACY / INSIDE ↔ OUTSIDE',04:'INTELLIGENCE / FAILURE',05:'COMPUTATION / IMPOSSIBILITY'};

  function wrap(article){
    const body=article.querySelector('.slide-body');if(!body)return null;
    if(body.classList.contains('fine-visual-layout'))return body;
    let copy=body.querySelector('.v3-copy');
    if(!copy){
      copy=document.createElement('div');copy.className='fine-copy';
      [...body.childNodes].filter(n=>!(n.nodeType===1&&(n.classList?.contains('ornament')||n.classList?.contains('v3-visual')))).forEach(n=>copy.appendChild(n));
      body.prepend(copy);
    }else copy.classList.add('fine-copy');
    body.classList.add('fine-visual-layout');
    return body;
  }
  function addKicker(article,text){
    const body=article.querySelector('.slide-body');if(!body||body.querySelector('.fine-kicker'))return;
    const k=document.createElement('div');k.className='fine-kicker';k.textContent=text;
    const title=body.querySelector('.slide-title');title?.before(k);
  }
  function mount(article,html,label){
    const body=wrap(article);if(!body)return;
    const old=body.querySelector('.v3-visual');if(old)old.remove();
    if(body.querySelector('.fine-visual'))return;
    const v=document.createElement('div');v.className='fine-visual';v.setAttribute('aria-label',label||'教学图示');v.innerHTML=html;body.appendChild(v);
  }
  const arrow=id=>`<defs><marker id="${id}" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="var(--fine-accent)"/></marker></defs>`;

  function outsideInside(){return `<svg viewBox="0 0 560 430">${arrow('oi')}<circle cx="280" cy="215" r="132" class="f-node"/><circle cx="280" cy="215" r="64" fill="rgba(103,86,168,.11)" stroke="var(--purple)" stroke-width="3"/><text x="280" y="207" text-anchor="middle" class="f-label">最私密处</text><text x="280" y="235" text-anchor="middle" class="f-small">并非封闭的内部</text><path d="M63 215 C108 102 203 70 276 148" class="f-line" marker-end="url(#oi)"/><path d="M497 215 C452 328 357 358 284 282" class="f-soft"/><text x="42" y="184" class="f-label">外部</text><text x="421" y="318" class="f-small">语言 / 他者 / 技术</text><text x="280" y="394" text-anchor="middle" class="f-small">外部之物可以占据主体内部最亲密的位置</text></svg>`}
  function bigOther(){return `<svg viewBox="0 0 560 430">${arrow('bo')}<path d="M80 85 H480 L420 345 H140 Z" fill="rgba(103,86,168,.08)" stroke="var(--purple)" stroke-width="2"/><circle cx="280" cy="205" r="72" class="f-node"/><circle cx="280" cy="205" r="22" fill="var(--fine-accent)"/><text x="280" y="318" text-anchor="middle" class="f-label">AI 大他者幻想</text><text x="115" y="118" class="f-small">全知</text><text x="393" y="118" class="f-small">全视</text><text x="100" y="350" class="f-small">保护</text><text x="410" y="350" class="f-small">审判</text><path d="M145 132 L226 175" class="f-line" marker-end="url(#bo)"/><path d="M415 132 L334 175" class="f-line" marker-end="url(#bo)"/><text x="280" y="397" text-anchor="middle" class="f-small">机器的“全知”首先是人的幻想结构</text></svg>`}
  function bodyAI(){return `<svg viewBox="0 0 560 430">${arrow('ba')}<rect x="30" y="145" width="150" height="140" rx="8" class="f-node"/><text x="105" y="195" text-anchor="middle" class="f-label">言说身体</text><text x="105" y="226" text-anchor="middle" class="f-small">声音 · 目光</text><text x="105" y="250" text-anchor="middle" class="f-small">姿态 · 痕迹</text><rect x="205" y="105" width="150" height="220" rx="8" fill="rgba(103,86,168,.08)" stroke="var(--purple)" stroke-width="2"/><text x="280" y="190" text-anchor="middle" class="f-label">语言 / 数据</text><text x="280" y="222" text-anchor="middle" class="f-small">编码与传递</text><rect x="380" y="145" width="150" height="140" rx="8" class="f-node"/><text x="455" y="195" text-anchor="middle" class="f-label">AI 装置</text><text x="455" y="226" text-anchor="middle" class="f-small">模型 · 接口</text><text x="455" y="250" text-anchor="middle" class="f-small">排序 · 回应</text><path d="M180 190 L201 190" class="f-line" marker-end="url(#ba)"/><path d="M355 190 L376 190" class="f-line" marker-end="url(#ba)"/><path d="M455 285 C430 385 130 390 105 288" class="f-soft" marker-end="url(#ba)"/><text x="280" y="400" text-anchor="middle" class="f-small">技术并非停在身体外部，而是重新进入身体回路</text></svg>`}
  function errorLoop(){return `<svg viewBox="0 0 560 430">${arrow('er')}<circle cx="280" cy="215" r="150" class="f-soft" opacity=".35"/><g><rect x="210" y="35" width="140" height="62" rx="4" class="f-node"/><text x="280" y="73" text-anchor="middle" class="f-label">尝试</text><rect x="390" y="180" width="140" height="62" rx="4" class="f-node"/><text x="460" y="218" text-anchor="middle" class="f-label">偏差</text><rect x="210" y="333" width="140" height="62" rx="4" class="f-node"/><text x="280" y="371" text-anchor="middle" class="f-label">适应</text><rect x="30" y="180" width="140" height="62" rx="4" class="f-node"/><text x="100" y="218" text-anchor="middle" class="f-label">反馈</text></g><path d="M350 80 C420 98 455 126 458 176" class="f-line" marker-end="url(#er)"/><path d="M452 242 C430 301 377 342 350 352" class="f-line" marker-end="url(#er)"/><path d="M210 365 C140 345 103 300 101 246" class="f-line" marker-end="url(#er)"/><path d="M104 180 C133 123 179 91 212 80" class="f-line" marker-end="url(#er)"/><text x="280" y="222" text-anchor="middle" class="f-small">失败可以进入学习结构</text></svg>`}
  function socialFailure(){return `<svg viewBox="0 0 560 430"><rect x="45" y="90" width="210" height="250" rx="8" class="f-node"/><rect x="305" y="90" width="210" height="250" rx="8" fill="rgba(103,86,168,.08)" stroke="var(--purple)" stroke-width="2"/><text x="150" y="135" text-anchor="middle" class="f-label">永远正确</text><text x="410" y="135" text-anchor="middle" class="f-label">允许失败</text><path d="M110 240 L190 180 M110 180 L190 240" class="f-line"/><circle cx="410" cy="215" r="58" fill="none" stroke="var(--fine-accent)" stroke-width="6" stroke-dasharray="150 40"/><text x="150" y="300" text-anchor="middle" class="f-small">工具关系</text><text x="410" y="300" text-anchor="middle" class="f-small">社会纽带</text><text x="280" y="390" text-anchor="middle" class="f-small">“会失败”有时不是缺陷，而是可相处性的条件</text></svg>`}
  function obedience(){return `<svg viewBox="0 0 560 430">${arrow('ob')}<rect x="55" y="55" width="450" height="72" rx="5" class="f-node"/><text x="280" y="98" text-anchor="middle" class="f-label">目标函数 / 命令</text><path d="M280 127 L280 185" class="f-line" marker-end="url(#ob)"/><path d="M115 190 H445 L360 330 H200 Z" fill="rgba(103,86,168,.08)" stroke="var(--purple)" stroke-width="2"/><text x="280" y="238" text-anchor="middle" class="f-label">不断优化</text><text x="280" y="273" text-anchor="middle" class="f-small">没有边界 · 没有“够了”</text><path d="M280 330 L280 377" class="f-line" marker-end="url(#ob)"/><text x="280" y="410" text-anchor="middle" class="f-label">灾难性正确</text></svg>`}
  function turingMask(){return `<svg viewBox="0 0 560 430"><line x1="280" y1="38" x2="280" y2="390" class="f-soft" stroke-dasharray="8 8"/><path d="M95 120 Q170 65 245 120 L225 265 Q170 320 115 265 Z" class="f-node"/><circle cx="145" cy="180" r="14" fill="var(--fine-accent)"/><circle cx="195" cy="180" r="14" fill="var(--fine-accent)"/><path d="M135 235 Q170 260 205 235" class="f-line"/><text x="170" y="355" text-anchor="middle" class="f-label">表现 / 变装</text><rect x="330" y="110" width="150" height="190" rx="8" fill="rgba(103,86,168,.08)" stroke="var(--purple)" stroke-width="2"/><text x="405" y="185" text-anchor="middle" class="f-label">裁判</text><text x="405" y="220" text-anchor="middle" class="f-small">“像不像人？”</text><text x="405" y="355" text-anchor="middle" class="f-label">判断结构</text><text x="280" y="410" text-anchor="middle" class="f-small">测试测量表现，也暴露人类自己的标准</text></svg>`}
  function crackSubject(){return `<svg viewBox="0 0 560 430"><circle cx="280" cy="210" r="145" fill="rgba(216,107,69,.06)" stroke="var(--fine-accent)" stroke-width="2"/><path d="M279 65 L252 145 L300 183 L260 230 L298 282 L265 355" class="f-line"/><text x="280" y="205" text-anchor="middle" class="f-label">主体</text><text x="115" y="112" class="f-small">语言</text><text x="395" y="112" class="f-small">欲望</text><text x="105" y="330" class="f-small">创伤</text><text x="398" y="330" class="f-small">失败</text><text x="280" y="400" text-anchor="middle" class="f-small">裂缝不是未来升级后就会被消除的接口错误</text></svg>`}
  function boundaryGap(){return `<svg viewBox="0 0 560 430"><rect x="70" y="70" width="420" height="290" rx="10" fill="rgba(103,86,168,.05)" stroke="var(--purple)" stroke-width="3"/><path d="M70 218 H225" class="f-line"/><path d="M335 218 H490" class="f-line"/><circle cx="280" cy="218" r="48" fill="none" stroke="var(--fine-accent)" stroke-width="4" stroke-dasharray="18 13"/><text x="280" y="213" text-anchor="middle" class="f-label">缺口</text><text x="280" y="245" text-anchor="middle" class="f-small">不可计算</text><text x="280" y="110" text-anchor="middle" class="f-label">计算体系内部</text><text x="280" y="398" text-anchor="middle" class="f-small">不是“外面还有神秘”，而是形式系统自身存在边界</text></svg>`}
  function omega(){return `<svg viewBox="0 0 560 430"><text x="280" y="145" text-anchor="middle" style="font:900 108px Georgia,serif;fill:var(--fine-accent)">Ω</text><text x="280" y="195" text-anchor="middle" class="f-label">可以定义</text><path d="M95 250 H465" class="f-soft" stroke-dasharray="7 8"/><g style="font:700 20px Consolas,monospace;fill:currentColor;opacity:.6"><text x="105" y="295">0 1 1 0 1 0 0 1 1 0 …</text><text x="105" y="328">1 0 0 1 0 1 1 0 0 1 …</text></g><rect x="205" y="350" width="150" height="50" rx="4" class="f-node"/><text x="280" y="382" text-anchor="middle" class="f-small">不能算法穷尽</text></svg>`}
  function zero(){return `<svg viewBox="0 0 560 430"><circle cx="220" cy="210" r="118" class="f-node"/><circle cx="340" cy="210" r="118" fill="rgba(103,86,168,.08)" stroke="var(--purple)" stroke-width="2"/><text x="220" y="202" text-anchor="middle" style="font:900 84px Georgia,serif;fill:var(--fine-accent)">0</text><text x="220" y="245" text-anchor="middle" class="f-small">缺失被写成符号</text><text x="340" y="202" text-anchor="middle" class="f-label">序列</text><text x="340" y="240" text-anchor="middle" class="f-small">从差异开始计数</text><path d="M270 210 H290" class="f-line"/><text x="280" y="390" text-anchor="middle" class="f-small">“零”让缺失进入可操作的符号秩序</text></svg>`}
  function suture(){return `<svg viewBox="0 0 560 430">${arrow('su')}<g>${[80,180,380,480].map((x,i)=>`<circle cx="${x}" cy="215" r="36" class="f-node"/><text x="${x}" y="222" text-anchor="middle" class="f-label">S${i<2?i+1:i+2}</text>`).join('')}</g><circle cx="280" cy="215" r="38" fill="none" stroke="var(--purple)" stroke-width="3" stroke-dasharray="8 8"/><text x="280" y="222" text-anchor="middle" class="f-label">缺</text><path d="M116 215 H140 M216 215 H240 M320 215 H344 M416 215 H440" class="f-line" marker-end="url(#su)"/><path d="M235 290 Q280 335 325 290" class="f-soft"/><text x="280" y="360" text-anchor="middle" class="f-small">缝合：用一个能指把缺口纳入序列，却不会真正消灭缺口</text></svg>`}
  function automatonTuche(){return `<svg viewBox="0 0 560 430">${arrow('at')}<rect x="40" y="80" width="215" height="270" rx="8" class="f-node"/><rect x="305" y="80" width="215" height="270" rx="8" fill="rgba(103,86,168,.08)" stroke="var(--purple)" stroke-width="2"/><text x="148" y="125" text-anchor="middle" class="f-label">automaton</text><text x="413" y="125" text-anchor="middle" class="f-label">tuché</text><path d="M90 180 C120 150 150 210 180 180 S235 210 205 250 S120 285 88 245" class="f-line" marker-end="url(#at)"/><path d="M350 270 C375 170 420 150 472 210" class="f-soft"/><circle cx="472" cy="210" r="12" fill="var(--fine-accent)"/><text x="148" y="316" text-anchor="middle" class="f-small">符号链的自动重复</text><text x="413" y="316" text-anchor="middle" class="f-small">无法预先保证的遭遇</text></svg>`}
  function blindspot(){return `<svg viewBox="0 0 560 430"><circle cx="280" cy="215" r="150" fill="rgba(216,107,69,.05)" stroke="var(--fine-accent)" stroke-width="2"/><path d="M160 130 Q280 60 400 130 Q280 300 160 130 Z" fill="rgba(103,86,168,.08)" stroke="var(--purple)" stroke-width="2"/><circle cx="280" cy="155" r="42" fill="none" stroke="var(--fine-accent)" stroke-width="4"/><path d="M280 113 A42 42 0 0 1 317 175" stroke="#12141a" stroke-width="9" fill="none"/><text x="280" y="310" text-anchor="middle" class="f-label">盲点</text><text x="280" y="344" text-anchor="middle" class="f-small">不一定只是待修复漏洞</text><text x="280" y="398" text-anchor="middle" class="f-small">系统的可见范围本身由结构规定</text></svg>`}

  const visuals={
    '03-04':outsideInside,'03-05':bigOther,'03-06':bodyAI,
    '04-02':errorLoop,'04-03':socialFailure,'04-04':obedience,'04-05':turingMask,'04-06':crackSubject,
    '05-02':boundaryGap,'05-03':omega,'05-04':zero,'05-05':suture,'05-07':automatonTuche,'05-08':blindspot
  };
  const dark=new Set(['03-01','03-04','03-06','03-08','04-01','04-03','04-05','04-08','05-01','05-03','05-05','05-07','05-09']);
  const warm=new Set(['04-04','04-07']);
  const summaries=new Set(['03-07','04-08','05-09']);

  function enhance(){
    const s=now();const article=stage.querySelector('.slide-shell');
    if(!s||!article||!['03','04','05'].includes(String(s.courseId)))return;
    const c=String(s.courseId),i=String(s.localIndex).padStart(2,'0'),key=`${c}-${i}`;
    if(article.dataset.fineKey===key)return;
    article.dataset.fineKey=key;
    article.classList.add('fine-course',`fine-c${c}-s${i}`);
    if(dark.has(key))article.classList.add('fine-dark');else if(warm.has(key))article.classList.add('fine-warm');else article.classList.add('fine-paper');
    if(summaries.has(key))article.classList.add('fine-summary');
    addKicker(article,palette[c]);
    if(c==='03'&&i==='02'){
      const existing=article.querySelector('.v3-visual');if(existing){existing.classList.add('fine-visual');article.querySelector('.slide-body')?.classList.add('fine-visual-layout');article.querySelector('.v3-copy')?.classList.add('fine-copy')}
    }
    const fn=visuals[key];if(fn)mount(article,fn(),s.title);
    requestAnimationFrame(()=>{try{resizeStage()}catch(_){}});
  }
  let timer=0;const schedule=()=>{clearTimeout(timer);timer=setTimeout(enhance,45)};
  new MutationObserver(schedule).observe(stage,{childList:true,subtree:true});
  document.addEventListener('click',schedule);
  document.addEventListener('keydown',schedule);
  schedule();
})();