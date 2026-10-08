/* Browser-level visual audit of the complete 175-slide art direction.
 * Run: npm install --no-save playwright && npx playwright install chromium
 *      python3 -m http.server 8765 &
 *      node tools/v5-visual-audit.mjs
 */
import { chromium } from 'playwright';
import { mkdir,writeFile } from 'node:fs/promises';
const location='http://127.0.0.1:8765/courseware/%E4%BA%BA%E5%B7%A5%E6%99%BA%E8%83%BD%E7%9A%84%E7%B2%BE%E7%A5%9E%E5%88%86%E6%9E%90/';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:1920,height:1080},deviceScaleFactor:1});
const errors=[],rows=[];
page.on('pageerror',e=>errors.push(String(e)));
page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
await mkdir('artifacts/v5-screenshots',{recursive:true});
try{
  await page.goto(location,{waitUntil:'domcontentloaded',timeout:30000});
  await page.waitForFunction(()=>window.__V5_ART_AUDIT__?.pages===175,{timeout:30000});
  const audit=await page.evaluate(()=>window.__V5_ART_AUDIT__);
  if(audit.directions.length!==175)throw Error('V5 directions count !=175');
  for(let i=0;i<audit.directions.length;i++){
    const expected=audit.directions[i];
    await page.evaluate(n=>goToSlide(n,99),i);
    await page.waitForFunction(k=>document.querySelector('#stage .slide-shell.v5-designed')?.dataset.v5Id===k,expected.id,{timeout:12000});
    await page.waitForTimeout(85); // allow the legacy 55 ms art/detail and overflow auditors to settle
    const metrics=await page.evaluate(()=>{
      const slide=document.querySelector('#stage .slide-shell');
      const body=slide.querySelector('.slide-body'),title=slide.querySelector('.slide-title');
      const bbox=body.getBoundingClientRect();
      const visual=!!slide.querySelector('.fine-visual,.v3-visual,.mvp-visual,.v4-diagram,.v4-inset');
      return {id:slide.dataset.v5Id,title:title?.textContent||'',
        tone:getComputedStyle(slide).backgroundColor,titleSize:getComputedStyle(title).fontSize,
        bodyOverflow:Math.round(body.scrollHeight-body.clientHeight),
        titleOverflow:Math.round(title.scrollWidth-title.clientWidth),
        motif:!!slide.querySelector('.v5-art-motif svg'),
        visual,
        stageWidth:Math.round(bbox.width),pageVisible:slide.getBoundingClientRect().width>0};
    });
    rows.push(metrics);
    // All pages get a screenshot; page IDs are stable for before/after comparisons.
    await page.locator('#stage').screenshot({path:'artifacts/v5-screenshots/'+expected.id+'.png',animations:'disabled'});
  }
  const hard=rows.filter(r=>!r.motif||!r.pageVisible||r.title!==audit.directions.find(x=>x.id===r.id)?.title);
  const issues=rows.filter(r=>r.bodyOverflow>20||r.titleOverflow>3);
  const summary={count:rows.length,missingArt:hard.length,possibleOverflow:issues.length,consoleErrors:errors.length,hard,issues,errors:errors.slice(0,30)};
  await writeFile('artifacts/v5-audit.json',JSON.stringify({summary,rows},null,2),'utf8');
  await writeFile('artifacts/v5-audit.md',
    '# V5 视觉审核\n\n总页数：'+rows.length+'；未应用美术：'+hard.length+'；疑似溢出：'+issues.length+'；控制台错误：'+errors.length+'。\n\n'+
    '| 页 ID | 标题 | 背景 RGB | 标题字号 | 溢出 px |\n|---|---|---|---|---:|\n'+
    rows.map(r=>'| '+r.id+' | '+r.title.replace(/\|/g,'／')+' | '+r.tone+' | '+r.titleSize+' | '+r.bodyOverflow+' |').join('\n')+'\n','utf8');
  console.log(JSON.stringify(summary,null,2));
  if(hard.length)process.exitCode=1;
}catch(e){console.error(e);process.exitCode=1;}
finally{await browser.close()}
