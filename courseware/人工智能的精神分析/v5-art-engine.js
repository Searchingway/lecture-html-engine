/* V5 per-slide art-direction renderer. Reads 175 authored design specifications. */
(()=>{
'use strict';
const plans=window.V5_ART_PLANS;
const courses=window.COURSE_DATA||[];
if(!plans||courses.length!==23){throw new Error('V5: 课程设计数据未正确载入');}
const palettes={
 ink:{bg:'#111318',fg:'#F2EEE6',muted:'#C5BEB5',accent:'#E58A68',aux:'#9E8AD6',stroke:'rgba(229,138,104,.18)'},
 slate:{bg:'#242831',fg:'#F5F1EA',muted:'#CBC6BE',accent:'#EDB08D',aux:'#C2B4EF',stroke:'rgba(237,176,141,.18)'},
 paper:{bg:'#F2EEE6',fg:'#18191E',muted:'#655F58',accent:'#BA512E',aux:'#6756A8',stroke:'rgba(186,81,46,.14)'},
 cream:{bg:'#EADFD1',fg:'#252329',muted:'#625850',accent:'#AB4D30',aux:'#594C96',stroke:'rgba(171,77,48,.14)'},
 clay:{bg:'#DBA48E',fg:'#231C1D',muted:'#49312B',accent:'#542524',aux:'#3E326A',stroke:'rgba(84,37,36,.15)'},
 sage:{bg:'#DCE1CA',fg:'#202721',muted:'#50564A',accent:'#674728',aux:'#485C40',stroke:'rgba(72,92,64,.16)'}
};
const grammarDesc={
 cover:'章节海报',question:'主问题版式',thesis:'论点聚焦',contrast:'张力对照',
 compare:'横向比较',diagram:'关系结构',illustration:'图示主导',warning:'误解纠偏',
 matrix:'等权矩阵',map:'知识拓扑',timeline:'时间刻度',process:'步骤与回路',
 quote:'引文构图',summary:'总结索引',open:'开放转场',case:'案例档案',formula:'公式主视觉'
};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const full=[];for(const c of courses){
const specs=plans[c.id];
if(!specs||specs.length!==c.slides.length)throw new Error('V5: 页数不匹配 C'+c.id);
for(let i=0;i<c.slides.length;i++){let s=c.slides[i],p=specs[i],k=c.id+'-'+String(i+1).padStart(2,'0');s.v5Art={...p,id:k,courseTitle:c.title};full.push(s);}
}
if(full.length!==175||new Set(full.map(s=>s.v5Art.id)).size!==175)throw new Error('V5: 非175个唯一页面');

function motifSVG(p,slide){
const motif=p.motif,idx=Number(slide.localIndex),j=idx%5;
const circle=(x,y,r,extra='')=>'<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="none" stroke="currentColor" stroke-width="2.5" '+extra+'/>';
const line=(x,y,a,b,extra='')=>'<path d="M'+x+' '+y+'L'+a+' '+b+'" stroke="currentColor" stroke-width="3" fill="none" '+extra+'/>';
let inner='';
if(/omega|phi|zero|s1|s2|objet|barred|human|kant|law|neq|notall|none|gap/.test(motif)){
const sym=/omega/.test(motif)?'Ω':/phi/.test(motif)?'Φ':/zero/.test(motif)?'0':/barred/.test(motif)?'$':/s1/.test(motif)?'S₁':/s2/.test(motif)?'S₂':/objet/.test(motif)?'a':/human|kant/.test(motif)?'?':/neq|gap/.test(motif)?'≠':'∅';
inner='<text x="265" y="322" text-anchor="middle" font-family="Georgia,serif" font-size="'+(sym.length>1?186:330)+'" font-weight="700" fill="currentColor">'+sym+'</text>'+circle(260,242,199,'stroke-dasharray="9 15"');
}else if(/four|quadrant|whole|pair|two|dual/.test(motif)){
for(let i=0;i<4;i++){let x=70+(i%2)*205,y=66+Math.floor(i/2)*205;inner+='<rect x="'+x+'" y="'+y+'" width="170" height="170" stroke="currentColor" stroke-width="3" fill="none" opacity="'+(.9-i*.12)+'"/>';inner+=line(x+20,y+132,x+148,y+42);}
}else if(/wave|pulse|signal|emotion/.test(motif)){
for(let k=0;k<5;k++)inner+='<path d="M12 '+(82+k*72)+' Q95 '+(10+k*70)+' 173 '+(82+k*72)+' T330 '+(82+k*72)+' T503 '+(82+k*72)+'" stroke="currentColor" stroke-width="'+(k===2?6:2)+'" fill="none"/>';
}else if(/clock|backward|future|timeline|ticks|millennia|scan/.test(motif)){
for(let k=0;k<3;k++)inner+=circle(270,250,70+k*68,k===1?'stroke-dasharray="7 17"':'');
inner+=line(270,250,460,130)+line(270,250,270,90);
}else if(/loop|ribbon|fold|knot|stitch|thread|orbit|return|inside|extimate|open-circle/.test(motif)){
inner='<path d="M55 268 C90 -5 435 20 455 220 C470 430 55 455 75 230 C96 20 400 26 455 250" stroke="currentColor" stroke-width="28" stroke-linecap="round" fill="none" opacity=".7"/>'+circle(266,241,110,'stroke-dasharray="11 16"');
}else if(/brain|network|circuit|social|memory|knowledge|ancestry|birth|child|origin|origins/.test(motif)){
const pts=[[100,100],[255,55],[430,125],[80,295],[245,235],[450,340],[265,440]];
for(let k=0;k<6;k++)inner+=line(...pts[k],...pts[k+1]);for(let k=0;k<pts.length;k++)inner+=circle(pts[k][0],pts[k][1],12+k%3*6);
}else if(/window|frame|surveillance|glass|test|record|david|fairy|object|body/.test(motif)){
for(let k=0;k<3;k++)inner+='<rect x="'+(50+k*46)+'" y="'+(45+k*48)+'" width="'+(400-k*94)+'" height="'+(390-k*92)+'" fill="none" stroke="currentColor" stroke-width="'+(k?3:8)+'"/>';
}else if(/slash|split|unequal|boundary|crack|bar|exception|all/.test(motif)){
for(let k=0;k<7;k++)inner+=line(40+k*82,8,450-k*45,475,'stroke-dasharray="'+(k%2?'20 13':'')+'"');
}else if(/three|columns|six|branches|index|labels|bracket|axis|operator/.test(motif)){
for(let k=0;k<6;k++)inner+='<rect x="'+(50+k*68)+'" y="'+(50+k%3*27)+'" width="38" height="'+(390-k%3*55)+'" stroke="currentColor" fill="none" stroke-width="3"/>';
}else{
for(let k=0;k<7;k++){inner+=circle(265,245,35+k*34,(k%2)?'stroke-dasharray="10 18"':'');}
}
return '<svg viewBox="0 0 530 500" aria-hidden="true" focusable="false"><g transform="translate(0 '+(j-2)*5+')">'+inner+'</g></svg>';
}
function titleSize(s,p){
 const n=Array.from(s.title||'').length;
 let base={cover:103,question:83,open:82,quote:75,thesis:70,formula:62,diagram:64,illustration:63,case:62,warning:65,summary:67,compare:63,contrast:68,timeline:62,process:61,matrix:62,map:70}[p.grammar]||65;
 if(n>26)base-=14;else if(n>19)base-=8;else if(n>14)base-=4;else if(n<9)base+=5;
 return Math.max(47,Math.min(109,base));
}
function apply(){
let article=document.querySelector('#stage .slide-shell');if(!article)return;
let s;try{s=flatSlides[state.globalIndex]}catch(_){return}
if(!s||!s.v5Art||article.dataset.v5Done===s.id)return;
const p=s.v5Art,pal=palettes[p.tone];if(!pal)return;
article.dataset.v5Done=s.id;
article.classList.add('v5-designed','v5-'+p.grammar,'v5-tone-'+p.tone);
article.dataset.v5Id=p.id;
article.dataset.v5Motif=p.motif;
article.style.setProperty('--v5-bg',pal.bg);
article.style.setProperty('--v5-ink',pal.fg);
article.style.setProperty('--v5-muted',pal.muted);
article.style.setProperty('--v5-accent',pal.accent);
article.style.setProperty('--v5-aux',pal.aux);
article.style.setProperty('--v5-stroke',pal.stroke);
article.style.setProperty('--v5-title-size',titleSize(s,p)+'px');
article.style.setProperty('--v5-block-count',String(s.points?.length||0));
const art=document.createElement('div');art.className='v5-art-motif';art.setAttribute('aria-hidden','true');art.innerHTML=motifSVG(p,s);article.appendChild(art);
const folio=document.createElement('div');folio.className='v5-folio';folio.textContent=p.id+' / '+String(full.length).padStart(3,'0');folio.setAttribute('aria-hidden','true');article.appendChild(folio);
const focus=document.createElement('div');focus.className='v5-intent';focus.setAttribute('aria-hidden','true');focus.textContent=grammarDesc[p.grammar]+' · '+p.motif.toUpperCase();article.appendChild(focus);
}
const stage=document.querySelector('#stage');
if(stage)new MutationObserver(()=>queueMicrotask(apply)).observe(stage,{childList:true,subtree:false});
apply();
window.__V5_ART_AUDIT__={pages:full.length,perCourse:courses.map(c=>[c.id,c.slides.length]),directions:full.map(s=>({id:s.v5Art.id,title:s.title,...s.v5Art})),colorThemes:Object.keys(palettes),version:'5.0'};
})();
