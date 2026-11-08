'use strict';
const paper=window.A4_PRACTICE;
const count=paper.questions.length,pages=Math.ceil(count/5);
const $=id=>document.getElementById(id);
const escapeHTML=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let page=0,answers=paper.questions.map(()=>[]),deadline=0,finished=false,timer;
function grade(q,chosen){
 const correct=q.options.map((o,i)=>o.correct?i:-1).filter(i=>i>=0);
 const c=chosen.filter(i=>correct.includes(i)).length,w=chosen.length-c;
 if(q.type==='single')return chosen.length===1&&c===1?1:0;
 return Math.max(0,c/correct.length-w/(2*correct.length));
}
function draw(){
 $('page').textContent=`Page ${page+1} / ${pages}`;
 $('back').disabled=page===0;$('forward').disabled=page===pages-1;
 $('progress').textContent=`${answers.filter(x=>x.length).length} / ${count} answered`;
 $('questions').innerHTML=paper.questions.slice(page*5,page*5+5).map((q,j)=>{
  const qi=page*5+j,chosen=answers[qi],score=grade(q,chosen);
  return `<section class="practice-card ${finished?(score===1?'correct':score>0?'partial':'incorrect'):''}"><fieldset><legend>${qi+1}. ${escapeHTML(q.topic)} · ${q.type==='single'?'Choose one':'Select all that apply'}</legend><p>${escapeHTML(q.stem)}</p>`+q.options.map((o,oi)=>`<label><input type="${q.type==='single'?'radio':'checkbox'}" name="q${qi}" data-q="${qi}" value="${oi}" ${chosen.includes(oi)?'checked':''} ${finished?'disabled':''}><span>${String.fromCharCode(65+oi)}. ${escapeHTML(o.text)}</span></label>`+(finished?`<div class="option-reason"><strong>${o.correct?'True':'False'}:</strong> ${escapeHTML(o.explanation)}</div>`:'')).join('')+(finished?`<p><strong>Question score: ${score.toFixed(2)} / 1</strong></p>`:'')+'</fieldset></section>';
 }).join('');
 document.querySelectorAll('[data-q]').forEach(el=>el.onchange=()=>{
  const qi=Number(el.dataset.q);
  answers[qi]=Array.from(document.querySelectorAll(`[data-q="${qi}"]:checked`)).map(x=>Number(x.value));
  $('progress').textContent=`${answers.filter(x=>x.length).length} / ${count} answered`;
 });
}
function tick(){
 const remain=Math.max(0,Math.ceil((deadline-Date.now())/1000));
 $('time').textContent=`${String(Math.floor(remain/60)).padStart(2,'0')}:${String(remain%60).padStart(2,'0')}`;
 if(remain===0&&!finished)submit(true);
}
function submit(expired=false){
 if(finished)return;finished=true;clearInterval(timer);
 const raw=paper.questions.reduce((s,q,i)=>s+grade(q,answers[i]),0);
 $('summary').className='score';$('summary').textContent=`${expired?'Time expired. ':''}Practice result: ${raw.toFixed(2)} / ${count} raw → ${(raw/count*paper.grade_max).toFixed(2)} / 50. This is not an official grade. Review all three pages for explanations.`;
 $('submit').disabled=true;$('restart').hidden=false;draw();
}
function start(){
 clearInterval(timer);page=0;answers=paper.questions.map(()=>[]);finished=false;deadline=Date.now()+paper.minutes*60000;
 $('intro').hidden=true;$('attempt').hidden=false;$('submit').disabled=false;$('restart').hidden=true;$('summary').textContent='';$('summary').className='';
 draw();tick();timer=setInterval(tick,1000);
}
$('start').onclick=start;$('restart').onclick=start;$('submit').onclick=()=>submit();
$('back').onclick=()=>{page--;draw();$('questions').scrollIntoView({block:'start'});};
$('forward').onclick=()=>{page++;draw();$('questions').scrollIntoView({block:'start'});};
document.addEventListener('visibilitychange',()=>{if(!finished&&deadline)tick();});
