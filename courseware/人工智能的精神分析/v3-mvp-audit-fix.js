(()=>{
  const stage=document.querySelector('#stage');
  if(!stage)return;

  const GRID_LAYOUTS=['layout-triad','layout-quad','layout-cards','layout-summary','layout-compare','layout-matrix','layout-timeline','layout-process','layout-split-left','layout-split-right'];
  const SPECIAL_LAYOUTS=['layout-chapter','layout-next','layout-terminal','layout-map'];

  function textLen(el){return [...String(el?.textContent||'').replace(/\s+/g,'')].length}
  function cleanClasses(article){
    [...article.classList].filter(c=>c.startsWith('mvp-')).forEach(c=>article.classList.remove(c));
  }
  function validVisual(article){
    const visual=article.querySelector('.v3-visual');
    if(!visual)return null;
    const meaningful=!!visual.querySelector('svg,.v3-discourse-rotator');
    if(!meaningful){visual.remove();return null}
    return visual;
  }
  function chooseColumns(count,total,maxLen,hasVisual,hasFormula){
    if(hasVisual||hasFormula)return 1;
    if(count<=1)return 1;
    if(count===2)return (maxLen<=110&&total<=190)?2:1;
    if(count===3){
      if(maxLen<=78&&total<=220)return 3;
      return total<=330?2:1;
    }
    if(count===4){
      if(maxLen<=58&&total<=210)return 4;
      return total<=420?2:1;
    }
    if(count<=6&&maxLen<=82&&total<=420)return 2;
    return 1;
  }
  function densityClass(count,total,maxLen,hasVisual,hasFormula){
    if(!hasVisual&&!hasFormula&&count<=2&&total<110)return 'mvp-density-sparse';
    if(total<220)return 'mvp-density-light';
    if(total>560||maxLen>210||count>=7)return 'mvp-density-dense';
    return 'mvp-density-normal';
  }
  function tuneTerms(article,count,total,hasVisual){
    const box=article.querySelector('.terms');
    if(!box)return;
    box.classList.remove('mvp-terms-inline','mvp-terms-hidden');
    const terms=[...box.querySelectorAll('.term')].filter(el=>getComputedStyle(el).display!=='none');
    const hide=terms.length<=1||count<=1||total>430||(!hasVisual&&count<=2&&total<150);
    if(hide){box.classList.add('mvp-terms-hidden');return}
    box.classList.add('mvp-terms-inline');
  }
  function tuneReveal(article,count,total,hasVisual,hasFormula){
    if(hasVisual||hasFormula||count>2||total>=150)return;
    article.classList.add('mvp-show-all');
    article.querySelectorAll('.point[data-step]').forEach(el=>{
      el.removeAttribute('data-step');
      el.classList.remove('unrevealed');
    });
  }
  function fitOverflow(article){
    article.classList.remove('mvp-compact','mvp-very-compact');
    requestAnimationFrame(()=>{
      const body=article.querySelector('.slide-body');
      if(!body)return;
      const overflow=body.scrollHeight>body.clientHeight+6;
      if(!overflow)return;
      article.classList.add('mvp-compact');
      article.querySelector('.terms')?.classList.add('mvp-terms-hidden');
      requestAnimationFrame(()=>{
        if(body.scrollHeight>body.clientHeight+6)article.classList.add('mvp-very-compact');
      });
    });
  }
  function classify(){
    const article=stage.querySelector('.slide-shell');
    if(!article)return;
    const points=[...article.querySelectorAll('.point')];
    const texts=points.map(p=>textLen(p.querySelector('.v3-point-text')||p));
    const total=texts.reduce((a,b)=>a+b,0);
    const maxLen=Math.max(0,...texts);
    const visual=validVisual(article);
    const hasVisual=!!visual;
    const hasFormula=!!article.querySelector('.formula');
    const sig=[article.querySelector('.slide-title')?.textContent||'',points.length,total,maxLen,hasVisual,hasFormula].join('|');
    if(article.dataset.mvpSig===sig)return;
    article.dataset.mvpSig=sig;
    cleanClasses(article);
    article.classList.add('mvp-reviewed');
    article.classList.add(hasVisual?'mvp-has-visual':'mvp-no-visual');

    const isSplit=article.classList.contains('layout-split-left')||article.classList.contains('layout-split-right');
    if(isSplit&&!hasVisual)article.classList.add('mvp-text-split-fallback');

    const cols=chooseColumns(points.length,total,maxLen,hasVisual,hasFormula);
    article.classList.add(`mvp-cols-${cols}`);
    article.classList.add(densityClass(points.length,total,maxLen,hasVisual,hasFormula));
    if(maxLen>150)article.classList.add('mvp-long-blocks');
    if(points.length===0&&!hasVisual&&!hasFormula&&!SPECIAL_LAYOUTS.some(c=>article.classList.contains(c)))article.classList.add('mvp-empty-body');

    tuneTerms(article,points.length,total,hasVisual);
    tuneReveal(article,points.length,total,hasVisual,hasFormula);
    fitOverflow(article);
  }

  function auditData(){
    const report={slides:0,sparse:0,dense:0,splitWithoutPlannedVisual:0,gridMismatch:0,layouts:{}};
    for(const course of (window.COURSE_DATA||[]))for(const s of (course.slides||[])){
      report.slides++;
      const count=(s.points||[]).length;
      const lens=(s.points||[]).map(p=>[...String(p).replace(/【[^】]+】/g,'').replace(/\s+/g,'')].length);
      const total=lens.reduce((a,b)=>a+b,0),max=Math.max(0,...lens);
      if(count<=2&&total<110)report.sparse++;
      if(total>560||max>210||count>=7)report.dense++;
      report.layouts[s.layout]=(report.layouts[s.layout]||0)+1;
      const expectsGrid=['triad','quad','cards','summary','compare','matrix','timeline','process'].includes(s.layout);
      if(expectsGrid&&((s.layout==='triad'&&count!==3)||(s.layout==='quad'&&count!==4)||(count<=1)))report.gridMismatch++;
      if(['split-left','split-right'].includes(s.layout))report.splitWithoutPlannedVisual++;
    }
    window.__V3_MVP_AUDIT__=report;
    console.info('[V3 MVP layout audit]',report);
  }

  let timer=0;
  const schedule=()=>{clearTimeout(timer);timer=setTimeout(classify,0)};
  new MutationObserver(schedule).observe(stage,{childList:true,subtree:true});
  window.addEventListener('resize',schedule);
  auditData();
  schedule();
})();
