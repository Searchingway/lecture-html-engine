/* V4 curriculum extension. Loaded before the existing lecture engine. */
(()=>{
'use strict';
const courses=window.COURSE_DATA||[], key=s=>s.courseId+'-'+String(s.localIndex).padStart(2,'0');
const specials=new Map([
['12-04','sex'],['12-05','sex'],['12-06','sex'],['12-08','sex'],['13-02','sex'],['13-03','sex'],['13-05','sex'],['13-09','sex'],
['15-11','discourse'],['15-12','discourse'],['15-13','discourse'],['15-14','discourse'],['15-15','discourse'],
['10-05','gaze'],['16-02','knot'],['23-09','closing'],['23-10','return']
]);
const ds={
'15-11':['主人辞说','S₁','S₂','$','a'],
'15-12':['大学辞说','S₂','a','S₁','$'],
'15-13':['癔症辞说','$','S₁','a','S₂'],
'15-14':['分析家辞说','a','$','S₂','S₁']
};
for(const c of courses)for(const s of c.slides){
 const k=key(s),t=specials.get(k);s.v4Kind=t;
 const points=(s.points||[]).map(p=>p.replace(/^【[^】]+】/,''));
 s.speakerNotes=['教学目标：'+s.goal,'问题入口：'+s.title,...points.map((p,i)=>'讲解'+(i+1)+'：'+p),'易错点：'+s.pitfall,'来源范围：'+s.source+'（须与原书PDF逐页校对）','转场：'+s.bridge].join('\n\n');
 if(t==='sex'||t==='discourse')s.formula=' '; // dedicated formula surface, retains staged-reveal behavior
}
const highlight=(s,i)=>s.localIndex===i?' v4-highlight':'';
function sex(s){
const l=['∃x ¬Φx','∀x Φx','¬∃x ¬Φx','¬∀x Φx'],active={'12-04':[0],'12-05':[1],'12-06':[0,1],'12-08':[0,1],'13-02':[2],'13-03':[3],'13-05':[2,3],'13-09':[0,1,2,3]}[key(s)]||[];
const rule=(i,sub)=>'<div class="v4-rule'+(active.includes(i)?' v4-highlight':'')+'"><span>'+l[i]+'</span><small>'+sub+'</small></div>';
return '<div class="v4-diagram"><header>SEXUATION · 性化公式 <small>结构位置不等同生理性别</small></header><div class="v4-columns"><section><h3>男性侧 · 例外与所有</h3>'+rule(0,'存在例外')+rule(1,'所有受到阳具功能限制')+'</section><section><h3>女性侧 · 无例外与非全部</h3>'+rule(2,'不存在例外')+rule(3,'不能总体化为全部')+'</section></div><footer>教学性结构重构：不能直接用普通一阶逻辑等价式取代拉康的论证；请对照原书图 4.1。</footer></div>';
}
function discourse(s){
 const key0=key(s),values=ds[key0]||ds['15-11'];
 const tile=([name,a,b,c,d])=>'<section class="v4-discourse"><h3>'+name+'</h3><div class="v4-four"><div><small>代理者</small>'+a+'</div><div><small>大他者</small>'+b+'</div><div><small>真理</small>'+c+'</div><div><small>产品</small>'+d+'</div></div><p>代理者 → 大他者；下层是真理与产品</p></section>';
 return '<div class="v4-diagram"><header>FOUR DISCOURSES · 四个位置固定</header><div class="v4-discourses">'+(key0==='15-15'?Object.values(ds).map(tile).join(''):tile(values))+'</div><footer>横杠划分显在位置与下层；四种辞说中变的是元素，不是位置。</footer></div>';
}
function other(s){
switch(s.v4Kind){
case 'gaze':return '<div class="v4-diagram v4-symbol"><header>GAZE · 目光</header><p>我看见 <b>≠</b> 我占据观看的全部位置</p><small>目光并非眼睛或摄像头，而是视觉场中的结构性位置。</small></div>';
case 'knot':return '<div class="v4-diagram v4-symbol"><header>SINTHOME · 扭结</header><p>人工智能 · 性的非关系 · 抽灵机</p><small>性机器人作为待阐明的结构性扭结，不是三个简单集合的交集。</small></div>';
case 'closing':return '<div class="v4-diagram v4-symbol"><header>BETWEEN DIGITS AND ANXIETY</header><p>数元 <b>≠</b> 焦虑</p><small>不把这一张力简化为机器不能成为主体的定理。</small></div>';
case 'return':return '<div class="v4-diagram v4-symbol"><header>THE QUESTION REMAINS OPEN</header><p>蛇妖　←　人是什么？　→　大卫</p><small>一种追索与一种等待，结论仍保持为问题。</small></div>';
}
return '';
}
function patch(){
const a=document.querySelector('#stage .slide-shell');if(!a)return;
let s;try{s=flatSlides[state.globalIndex]}catch(_){return}
if(!s?.v4Kind||a.dataset.v4Key===s.id)return;
a.dataset.v4Key=s.id;a.classList.add('v4-curated');
const html=s.v4Kind==='sex'?sex(s):s.v4Kind==='discourse'?discourse(s):other(s);
const f=a.querySelector('.formula');if(f){f.innerHTML=html;f.classList.add('v4-formula')}else{
const body=a.querySelector('.slide-body');if(!body)return;
const wrap=document.createElement('div');wrap.className='v4-inset';wrap.innerHTML=html;body.appendChild(wrap);}
}
const stage=document.querySelector('#stage');if(stage)new MutationObserver(()=>queueMicrotask(patch)).observe(stage,{childList:true,subtree:false});
patch();
window.__V4_CONFIG__={enhanced:specials.size,lectures:courses.length};
})();