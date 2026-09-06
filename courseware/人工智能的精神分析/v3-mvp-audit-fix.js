(()=>{
  const stage=document.querySelector('#stage');
  if(!stage)return;

  const PARALLEL_LAYOUTS=new Set(['layout-compare','layout-matrix','layout-quad','layout-case']);
  const THREE_LAYOUTS=new Set(['layout-triad','layout-cards','layout-summary','layout-timeline','layout-process']);
  const SPECIAL_LAYOUTS=new Set(['layout-chapter','layout-next','layout-terminal','layout-map']);
  const RUNTIME_CLASSES=[
    'mvp-reviewed','mvp-has-visual','mvp-no-visual','mvp-text-split-fallback',
    'mvp-layout-stack','mvp-layout-pair','mvp-layout-grid3','mvp-layout-grid4',
    'mvp-density-sparse','mvp-density-light','mvp-density-normal','mvp-density-dense',
    'mvp-long-blocks','mvp-show-all','mvp-empty-body','mvp-compact','mvp-very-compact'
  ];

  const cleanText=s=>String(s||'').replace(/【[^】]+】/g,'').replace(/\s+/g,'').trim();
  const textLen=el=>[...cleanText(el?.textContent||'')].length;

  function removeRuntimeClasses(article){
    article.classList.remove(...RUNTIME_CLASSES);
  }

  function visualTruthSphere(){
    return `<svg viewBox="0 0 560 430" role="img" aria-label="真理球示意">
      <circle cx="280" cy="214" r="126" fill="rgba(103,86,168,.08)" stroke="var(--purple)" stroke-width="3"/>
      <circle cx="280" cy="214" r="88" fill="none" stroke="var(--orange)" stroke-width="2" stroke-dasharray="8 9"/>
      <text x="280" y="198" text-anchor="middle" class="svg-label">alethosphere</text>
      <text x="280" y="230" text-anchor="middle" class="svg-small">技术知识不断积累与流通的场域</text>
      <g class="svg-small">
        <text x="70" y="95">数据</text><text x="435" y="104">测量</text>
        <text x="54" y="330">存储</text><text x="430" y="336">计算</text>
      </g>
      <path d="M108 112 C145 142 160 160 170 180" class="svg-line"/>
      <path d="M438 120 C405 150 395 162 389 184" class="svg-line"/>
      <path d="M112 316 C150 288 159 274 171 250" class="svg-line"/>
      <path d="M436 318 C402 286 394 270 388 247" class="svg-line"/>
      <text x="280" y="392" text-anchor="middle" class="svg-small">不是“真理本身”，而是科学技术制造的知识环境</text>
    </svg>`;
  }

  function visualNeuralSimulation(){
    return `<svg viewBox="0 0 560 430" role="img" aria-label="神经模拟与主体问题示意">
      <rect x="40" y="64" width="180" height="92" rx="8" class="svg-node"/>
      <text x="130" y="105" text-anchor="middle" class="svg-label">神经活动</text>
      <text x="130" y="133" text-anchor="middle" class="svg-small">连接 · 放电 · 动力学模式</text>
      <rect x="340" y="64" width="180" height="92" rx="8" class="svg-node"/>
      <text x="430" y="105" text-anchor="middle" class="svg-label">可描述结构</text>
      <text x="430" y="133" text-anchor="middle" class="svg-small">模型 · 功能 · 行为</text>
      <path d="M222 110 H336" class="svg-line"/>
      <rect x="126" y="252" width="308" height="105" rx="8" fill="rgba(103,86,168,.07)" stroke="var(--purple)" stroke-width="3" stroke-dasharray="9 8"/>
      <text x="280" y="294" text-anchor="middle" class="svg-label">主体问题 ?</text>
      <text x="280" y="324" text-anchor="middle" class="svg-small">欲望 · 享乐 · “我”的位置不能由上层结构直接推出</text>
      <path d="M280 157 V246" class="svg-soft" stroke-dasharray="7 7"/>
      <text x="280" y="205" text-anchor="middle" class="svg-small">不能直接等号</text>
    </svg>`;
  }

  function injectMeaningfulVisual(article,title){
    if(article.querySelector('.v3-visual,.mvp-visual'))return;
    if(article.classList.contains('layout-chapter')||article.classList.contains('layout-case')||article.classList.contains('layout-formula-step'))return;

    let html='';
    if(/真理球|alethosphere/i.test(title))html=visualTruthSphere();
    else if(/神经模拟|蓝脑/.test(title))html=visualNeuralSimulation();
    if(!html)return;

    const body=article.querySelector('.slide-body');
    if(!body)return;
    let copy=body.querySelector('.v3-copy,.mvp-copy');
    if(!copy){
      copy=document.createElement('div');
      copy.className='mvp-copy';
      [...body.childNodes].filter(n=>!(n.nodeType===1&&n.classList?.contains('ornament'))).forEach(n=>copy.appendChild(n));
      body.prepend(copy);
      body.classList.add('mvp-visual-layout');
    }
    const visual=document.createElement('div');
    visual.className='mvp-visual';
    visual.innerHTML=html;
    body.appendChild(visual);
  }

  function meaningfulVisual(article){
    const visual=article.querySelector('.v3-visual,.mvp-visual');
    if(!visual)return null;
    if(!visual.querySelector('svg,.v3-discourse-rotator')){
      visual.remove();
      return null;
    }
    return visual;
  }

  function decideLayout(article,count,total,maxLen,hasVisual,hasFormula){
    if(hasVisual||hasFormula)return 'stack';
    const cls=article.classList;

    if(count<=1)return 'stack';

    if(count===2){
      if([...PARALLEL_LAYOUTS].some(c=>cls.contains(c)) && maxLen<=145 && total<=250)return 'pair';
      return 'stack';
    }

    if(count===3){
      if([...THREE_LAYOUTS].some(c=>cls.contains(c)) && maxLen<=76 && total<=225)return 'grid3';
      if([...PARALLEL_LAYOUTS].some(c=>cls.contains(c)) && maxLen<=105 && total<=315)return 'pair';
      return 'stack';
    }

    if(count===4){
      if((cls.contains('layout-quad')||cls.contains('layout-matrix')) && maxLen<=62 && total<=235)return 'grid4';
      if(([...PARALLEL_LAYOUTS].some(c=>cls.contains(c))||cls.contains('layout-cards')||cls.contains('layout-summary')) && maxLen<=105 && total<=390)return 'pair';
      return 'stack';
    }

    if(count<=6 && total<=430 && maxLen<=92 && (cls.contains('layout-cards')||cls.contains('layout-summary')||cls.contains('layout-matrix')))return 'pair';
    return 'stack';
  }

  function densityClass(count,total,maxLen,hasVisual,hasFormula){
    if(!hasVisual&&!hasFormula&&count<=2&&total<135)return 'sparse';
    if(total<235&&maxLen<120)return 'light';
    if(total>520||maxLen>195||count>=7)return 'dense';
    return 'normal';
  }

  function tuneTerms(article,count,total,hasVisual,density){
    const box=article.querySelector('.terms');
    if(!box)return;
    box.classList.remove('mvp-terms-inline','mvp-terms-hidden');
    const terms=[...box.querySelectorAll('.term')].filter(el=>getComputedStyle(el).display!=='none');
    const title=cleanText(article.querySelector('.slide-title')?.textContent||'');
    const points=cleanText(article.querySelector('.point-list')?.textContent||'');
    const related=terms.filter(el=>{
      const t=cleanText(el.textContent);
      return t.length>=2&&(title.includes(t)||points.includes(t));
    });
    const hide=hasVisual||density==='sparse'||count<=1||total>450||terms.length<2||related.length===0;
    if(hide)box.classList.add('mvp-terms-hidden');
    else box.classList.add('mvp-terms-inline');
  }

  function tuneReveal(article,count,total,hasVisual,hasFormula){
    if(hasVisual||hasFormula)return;
    if(count<=2&&total<185){
      article.classList.add('mvp-show-all');
      article.querySelectorAll('.point[data-step]').forEach(el=>{
        el.removeAttribute('data-step');
        el.classList.remove('unrevealed');
      });
    }
  }

  function fitOverflow(article){
    requestAnimationFrame(()=>{
      const body=article.querySelector('.slide-body');
      if(!body)return;
      article.classList.remove('mvp-compact','mvp-very-compact');
      if(body.scrollHeight<=body.clientHeight+8)return;
      article.classList.add('mvp-compact');
      article.querySelector('.terms')?.classList.add('mvp-terms-hidden');
      requestAnimationFrame(()=>{
        if(body.scrollHeight>body.clientHeight+8)article.classList.add('mvp-very-compact');
      });
    });
  }

  function classify(){
    const article=stage.querySelector('.slide-shell');
    if(!article)return;
    const title=article.querySelector('.slide-title')?.textContent||'';

    injectMeaningfulVisual(article,title);

    const points=[...article.querySelectorAll('.point')];
    const lens=points.map(p=>textLen(p.querySelector('.v3-point-text')||p));
    const total=lens.reduce((a,b)=>a+b,0);
    const maxLen=Math.max(0,...lens);
    const visual=meaningfulVisual(article);
    const hasVisual=!!visual;
    const hasFormula=!!article.querySelector('.formula');
    const sig=[title,points.length,total,maxLen,hasVisual,hasFormula].join('|');
    if(article.dataset.mvpSig===sig)return;
    article.dataset.mvpSig=sig;

    removeRuntimeClasses(article);
    article.classList.add('mvp-reviewed',hasVisual?'mvp-has-visual':'mvp-no-visual');

    const split=article.classList.contains('layout-split-left')||article.classList.contains('layout-split-right');
    if(split&&!hasVisual)article.classList.add('mvp-text-split-fallback');

    const layout=decideLayout(article,points.length,total,maxLen,hasVisual,hasFormula);
    article.classList.add(`mvp-layout-${layout}`);

    const density=densityClass(points.length,total,maxLen,hasVisual,hasFormula);
    article.classList.add(`mvp-density-${density}`);
    if(maxLen>150)article.classList.add('mvp-long-blocks');

    const isSpecial=[...SPECIAL_LAYOUTS].some(c=>article.classList.contains(c));
    if(points.length===0&&!hasVisual&&!hasFormula&&!isSpecial)article.classList.add('mvp-empty-body');

    tuneTerms(article,points.length,total,hasVisual,density);
    tuneReveal(article,points.length,total,hasVisual,hasFormula);
    fitOverflow(article);

    try{if(typeof resizeStage==='function')requestAnimationFrame(resizeStage)}catch(_){ }
  }

  function auditData(){
    const report={slides:0,sparse:0,dense:0,splitPages:0,forcedGridRisks:0,layouts:{}};
    for(const course of (window.COURSE_DATA||[])){
      for(const s of (course.slides||[])){
        report.slides++;
        const count=(s.points||[]).length;
        const lens=(s.points||[]).map(p=>[...cleanText(p)].length);
        const total=lens.reduce((a,b)=>a+b,0),max=Math.max(0,...lens);
        if(count<=2&&total<135)report.sparse++;
        if(total>520||max>195||count>=7)report.dense++;
        report.layouts[s.layout]=(report.layouts[s.layout]||0)+1;
        if(['split-left','split-right'].includes(s.layout))report.splitPages++;
        if((s.layout==='triad'&&count!==3)||(s.layout==='quad'&&count!==4)||(['cards','summary','compare','matrix'].includes(s.layout)&&count<=1))report.forcedGridRisks++;
      }
    }
    window.__V3_MVP_AUDIT__=report;
    console.info('[V3.2 adaptive layout audit]',report);
  }

  let timer=0;
  const schedule=()=>{
    clearTimeout(timer);
    timer=setTimeout(classify,18);
  };
  new MutationObserver(schedule).observe(stage,{childList:true,subtree:true});
  window.addEventListener('resize',schedule);
  auditData();
  schedule();
})();