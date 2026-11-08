/* Small, bounded learning models. No full assignment JSON handlers are supplied. */
'use strict';
const sections=window.A4_SECTIONS;
let lang='RU', topic='start', state={};
const $=id=>document.getElementById(id);
const tr=(en,ru)=>(lang==='EN'?en:ru).replace(/([A-Za-zА-Яа-яЁё]{2,})(?=\d)/g,'$1 ').replace(/(\d)(?=[A-Za-zА-Яа-яЁё]{2,})/g,'$1 ');
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function feedback(text,ok=true){const el=$('feedback');el.textContent=text;el.classList.toggle('bad',!ok);}
function table(headers,rows){return '<div class="scroll"><table><thead><tr>'+headers.map(x=>'<th scope="col">'+esc(x)+'</th>').join('')+'</tr></thead><tbody>'+rows.map(r=>'<tr>'+r.map(x=>'<td>'+esc(x)+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>';}
function answer(prompt,placeholder=''){
 return `<p class="prompt" id="answerLabel">${esc(prompt)}</p><div class="answer-row"><input id="answer" aria-labelledby="answerLabel" placeholder="${esc(placeholder)}" autocomplete="off"><button id="check">${tr('Check','Проверить')}</button><button id="explain">${tr('Show reasoning','Показать разбор')}</button></div><div id="feedback" class="feedback" role="status" aria-live="polite"></div>`;
}
function parseAnswer(){try{return JSON.parse($('answer').value);}catch{return undefined;}}
function equal(a,b){return JSON.stringify(a)===JSON.stringify(b);}
function bindAnswer(expected,reason,type='json'){
 const check=()=>{
  const raw=$('answer').value;
  const value=type==='string'?raw:parseAnswer();
  if(type==='json' && value===undefined){feedback(tr('Enter a valid JSON value, for example [0,2].','Введите корректное JSON-значение, например [0,2].'),false);return;}
  const ok=type==='custom'?expected(raw):equal(value,expected);
  feedback(ok?tr('Correct. ','Верно. ')+reason:tr('This answer needs another look. ','Проверьте ответ ещё раз. ')+reason,ok);
 };
 $('check').onclick=check;
 $('answer').onkeydown=e=>{if(e.key==='Enter')check();};
 $('explain').onclick=()=>feedback(reason);
}
function renderNav(){
 const q=$('search').value.toLocaleLowerCase();
 const visible=sections.filter(s=>(s.title[lang]+' '+s.lead[lang]+' '+s.body[lang].replace(/<[^>]+>/g,' ')).toLocaleLowerCase().includes(q));
 $('nav').innerHTML=visible.map(s=>`<a href="#${s.id}" data-topic="${s.id}" class="${topic===s.id?'current':''}"${topic===s.id?' aria-current="page"':''}>${esc(s.title[lang])}</a>`).join('') || `<span class="no-result">${tr('No matching topics','Ничего не найдено')}</span>`;
}
function render(){
 const s=sections.find(x=>x.id===topic)||sections[0];topic=s.id;
 document.documentElement.lang=lang==='EN'?'en':'ru';
 document.title='A4 · '+s.title[lang];
 $('searchLabel').textContent=tr('Explore the lesson','Темы урока');
 $('search').placeholder=tr('Search topics…','Поиск по темам…');
 $('asideNote').textContent=tr('Weeks 8–10 · Dynamic programming and string search.','Недели 8–10 · Динамическое программирование и поиск строк.');
 $('eyebrow').textContent='Assignment 4';
 $('title').textContent=s.title[lang];$('lead').textContent=s.lead[lang];$('article').innerHTML=s.body[lang];
 $('downloadsTitle').textContent=tr('Start the assignment','Начать задание');
 $('downloads').innerHTML='<div class="download-links"><a href="https://github.com/RZhaniya/daa-assignment-4-archive">'+esc(tr('Assignment and instructions','Задание и инструкции'))+' ↗</a><a href="https://github.com/RZhaniya/daa-assignment-4-archive/generate">'+esc(tr('Create your repository','Создать репозиторий'))+' ↗</a></div>';
 const idx=sections.indexOf(s);$('position').textContent=`${idx+1} / ${sections.length}`;
 $('prev').textContent=tr('← Previous','← Назад');$('next').textContent=tr('Next →','Далее →');
 $('prev').disabled=idx===0;$('next').disabled=idx===sections.length-1;
 $('prev').onclick=()=>go(sections[idx-1].id);$('next').onclick=()=>go(sections[idx+1].id);
 $('footer').textContent='Design and Analysis of Algorithms';
 document.querySelectorAll('[data-lang]').forEach(b=>{b.setAttribute('aria-pressed',String(b.dataset.lang===lang));b.onclick=()=>{lang=b.dataset.lang;render();};});
 renderNav();$('lab').hidden=!s.lab;
 if(s.lab){$('lab').innerHTML=`<div class="label">${tr('Predict → check → explain','Прогноз → проверка → разбор')}</div><h2 id="labHeading">${tr('Try a small example','Разберите малый пример')}</h2><div id="model"></div>`;renderLab(s.lab);}
}
function go(id){if(!sections.some(s=>s.id===id))id='start';if(topic!==id)state={};topic=id;if(location.hash!=='#'+id)history.replaceState(null,'','#'+id);render();}
function renderLab(id){
 const m=$('model');
 if(id==='lcs'){
  const a='ABCD',b='ACD',dp=[[0,0,0,0],[0,1,1,1],[0,1,1,1],[0,1,2,2],[0,1,2,3]];
  state.step=state.step??0;
  let rows=[];
  for(let i=0;i<=a.length;i++)rows.push([i===0?'ε':a[i-1],...dp[i].map((v,j)=>i===0||j===0||((i-1)*b.length+j)<=state.step?v:'·')]);
  m.innerHTML=`<p><code>a="ABCD", b="ACD"</code></p>`+table(['i / j','ε',...b],rows)+`<div class="controls"><button id="step">${tr('Reveal next cell','Следующая ячейка')}</button><button id="resetModel">${tr('Reset','Сброс')}</button><span>${state.step}/12</span></div>`+answer(tr('Enter one optimal common subsequence.','Введите одну оптимальную общую подпоследовательность.'),'ACD');
  $('step').disabled=state.step===12;$('step').onclick=()=>{state.step++;renderLab(id);};$('resetModel').onclick=()=>{state.step=0;renderLab(id);};
  bindAnswer('ACD',tr('The optimum is 3. A,C,D occur in order in both strings. B cannot be used because the second string has no B.','Оптимум — 3. A,C,D идут в нужном порядке в обеих строках. B использовать нельзя: во второй строке его нет.'),'string');
 }
 if(id==='merge'){
  state.order=state.order??'left';
  const left=state.order==='left';
  m.innerHTML='<p><code>sizes=[2,3,4]</code></p><div class="diagram"><span class="block">[0,0] · 2</span><span class="block">[1,1] · 3</span><span class="block">[2,2] · 4</span></div>'+`<div class="controls"><label>${tr('First merge','Первое слияние')}<select id="order"><option value="left" ${left?'selected':''}>[0,0] + [1,1]</option><option value="right" ${!left?'selected':''}>[1,1] + [2,2]</option></select></label></div>`+table([tr('Step','Шаг'),tr('Current blocks after merge','Текущие блоки после слияния'),tr('Cost','Стоимость')],left?[[1,'[0,1], [2,2]',5],[2,'[0,2]',9]]:[[1,'[0,0], [1,2]',7],[2,'[0,2]',9]])+answer(tr('What is the total cost of this plan?','Какова общая стоимость этого плана?'),'14');
  $('order').onchange=e=>{state.order=e.target.value;renderLab(id);};
  bindAnswer(left?14:16,tr('The left-first plan costs 5+9=14; right-first costs 7+9=16. The last merge always joins two existing adjacent intervals.','План слева стоит 5+9=14, справа — 7+9=16. Последнее слияние соединяет два существующих соседних интервала.'));
 }
 if(id==='tree'){
  state.selected=state.selected??[];
  const weights=[4,9,6,-2,5],edges=[[0,1],[1,2],[1,3],[3,4]];
  m.innerHTML='<p><code>weights=[4,9,6,-2,5]</code></p><div class="tree-edges">0 — 1 — 2\n    │\n    3 — 4</div><div class="checks">'+weights.map((w,i)=>`<label><input type="checkbox" data-vertex="${i}" ${state.selected.includes(i)?'checked':''}>${i} (${w})</label>`).join('')+`</div><p class="prompt">${tr('Select a maximum-weight independent set.','Выберите независимое множество максимального веса.')}</p><div class="controls"><button id="checkTree">${tr('Check selection','Проверить выбор')}</button><button id="explain">${tr('Show reasoning','Показать разбор')}</button><button id="resetModel">${tr('Reset','Сброс')}</button></div><div id="feedback" class="feedback" role="status" aria-live="polite"></div>`;
  document.querySelectorAll('[data-vertex]').forEach(b=>b.onchange=()=>{state.selected=Array.from(document.querySelectorAll('[data-vertex]:checked')).map(x=>Number(x.dataset.vertex));});
  const reason=tr('An optimum is {0,2,4}, weight15. At root0: take=15, skip=14. Negative vertex3 can be skipped while vertex4 is selected.','Оптимум: {0,2,4}, вес 15. В корне0: take=15, skip=14. Отрицательную вершину3 можно пропустить и выбрать вершину4.');
  $('checkTree').onclick=()=>{const s=state.selected,conflict=edges.find(([u,v])=>s.includes(u)&&s.includes(v));const sum=s.reduce((t,v)=>t+weights[v],0);if(conflict)feedback(tr('Adjacent vertices selected: ','Выбраны соседние вершины: ')+conflict.join('—'),false);else feedback(tr('Valid independent set. Weight: ','Допустимый независимый набор. Вес: ')+sum+'. '+(sum===15?tr('Optimal.','Оптимально.'):tr('A better set exists.','Есть набор лучше.')),sum===15);};
  $('explain').onclick=()=>feedback(reason);$('resetModel').onclick=()=>{state.selected=[];renderLab(id);};
 }
 if(id==='naive'){
  const cases=[['aaaaa','aaa',[0,1,2]],['ab','',[0,1,2]],['ab','abc',[]]];
  state.case=state.case??0;const [text,pattern,expected]=cases[state.case];
  m.innerHTML=`<div class="controls"><label>${tr('Case','Случай')}<select id="case">${cases.map(([t,p],i)=>`<option value="${i}" ${i===state.case?'selected':''}>${esc(JSON.stringify(t))} / ${esc(JSON.stringify(p))}</option>`).join('')}</select></label></div><p><code>text=${esc(JSON.stringify(text))}, pattern=${esc(JSON.stringify(pattern))}</code></p>`+answer(tr('List all starting positions as a JSON array.','Все начальные позиции в виде JSON-массива.'),'[0,1,2]');
  $('case').onchange=e=>{state.case=Number(e.target.value);renderLab(id);};
  bindAnswer(expected,tr('For this input the starts are ','Для этого входа старты: ')+JSON.stringify(expected)+'. '+tr('Empty patterns match boundaries, including the final one; overlaps count.','Пустой шаблон совпадает на границах, включая последнюю; перекрытия учитываются.'));
 }
 if(id==='kmp'){
  state.mode=state.mode??'pi';const piMode=state.mode==='pi';
  m.innerHTML=`<div class="controls"><label>${tr('Question','Вопрос')}<select id="mode"><option value="pi" ${piMode?'selected':''}>pi[5]</option><option value="fallback" ${!piMode?'selected':''}>${tr('After a full match','После полного совпадения')}</option></select></label></div>`+(piMode?'<p><code>pattern="ababaca"</code></p>'+table(['i',0,1,2,3,4,5,6],[['char','a','b','a','b','a','c','a'],['pi',0,0,1,2,3,'?',1]]):'<p><code>text="abababa", pattern="aba", pi=[0,0,1]</code></p><p>'+tr('The first full match ends at text index2. What should j be before scanning index3?','Первое полное совпадение заканчивается на индексе2 текста. Чему должно равняться j перед чтением индекса3?')+'</p>')+answer(piMode?tr('What is pi[5]?','Чему равно pi[5]?'):tr('Enter the new j.','Введите новое j.'),'0');
  $('mode').onchange=e=>{state.mode=e.target.value;renderLab(id);};
  bindAnswer(piMode?0:1,piMode?tr('In "ababac", c occurs for the first time at the final position. Every nonempty suffix ends in c, but no proper prefix can end in c. There is no nonempty border, so pi[5]=0.','В "ababac" символ c впервые встречается в конце. Любой непустой суффикс заканчивается на c, но ни один собственный префикс не может заканчиваться на c. Непустой границы нет, поэтому pi[5]=0.'):tr('Use pi[2]=1. The final a can begin the next match; setting j=0 would lose an overlap.','Используйте pi[2]=1. Последний a может начать следующее совпадение; j=0 потерял бы перекрытие.'));
 }
 if(id==='rk'){
  m.innerHTML='<p><code>text="abdj", pattern="ab", base=31, mod=101</code></p>'+table([tr('Start','Начало'),tr('Window','Окно'),'hash'],[[0,'ab',75],[1,'bd',7],[2,'dj',75]])+answer(tr('Which starts are actual exact matches? JSON array.','Какие старты — точные совпадения? JSON-массив.'),'[0]');
  bindAnswer([0],tr('ab: (97×31+98) mod101=75. dj: (100×31+106) mod101=75. Only the window at0 equals the pattern.','ab: (97×31+98) mod101=75. dj: (100×31+106) mod101=75. Только окно0 равно шаблону.'));
 }
 if(id==='suffix'){
  state.mode=state.mode??'order';const mode=state.mode;
  const sa=[5,3,1,0,4,2],lcp=[0,1,3,0,0,2];
  m.innerHTML=`<div class="controls"><label>${tr('Question','Вопрос')}<select id="mode"><option value="order" ${mode==='order'?'selected':''}>SA</option><option value="lcp" ${mode==='lcp'?'selected':''}>LCP</option><option value="repeat" ${mode==='repeat'?'selected':''}>${tr('Longest repeat','Самый длинный повтор')}</option></select></label></div><p><code>text="banana"</code></p>`+table([tr('Start','Начало'),tr('Suffix','Суффикс')],(mode==='order'?[0,1,2,3,4,5]:sa).map(i=>[i,'banana'.slice(i)]))+answer(mode==='order'?tr('Enter sa as a JSON array.','Введите sa как JSON-массив.'):mode==='lcp'?tr('Enter lcp, comparing each suffix to its predecessor.','Введите lcp: каждый суффикс сравнивается с предыдущим.'):tr('Enter a longest repeated substring.','Введите самую длинную повторяющуюся подстроку.'),mode==='repeat'?'ana':'[5,3,1,0,4,2]');
  $('mode').onchange=e=>{state.mode=e.target.value;renderLab(id);};
  bindAnswer(mode==='order'?sa:mode==='lcp'?lcp:'ana',tr('sa=[5,3,1,0,4,2], lcp=[0,1,3,0,0,2]. "ana" occurs at1 and3; overlapping starts are allowed. No added sentinel is included.','sa=[5,3,1,0,4,2], lcp=[0,1,3,0,0,2]. "ana" встречается с1 и3; перекрытия разрешены. Добавленного sentinel в ответе нет.'),mode==='repeat'?'string':'json');
 }
 if(id==='aho'){
  const texts=['sheshe','hehe',''];const values=[[2,2,2],[2,0,2],[0,0,0]];
  state.case=state.case??0;
  m.innerHTML='<p><code>patterns=["he","she","he"]</code></p><div class="tree-edges">ε → h → he\nε → s → sh → she\nFailure: she → he → ε</div>'+`<div class="controls"><label>${tr('Independent text','Независимый текст')}<select id="case">${texts.map((t,i)=>`<option value="${i}" ${i===state.case?'selected':''}>${esc(JSON.stringify(t))}</option>`).join('')}</select></label></div>`+answer(tr('Counts in original dictionary order? JSON array.','Счётчики в исходном порядке словаря? JSON-массив.'),'[2,2,2]')+'<small>'+tr('Each selected text starts from the root with zero counts. The duplicate he occupies a second output column.','Каждый выбранный текст начинается из корня с нулевыми счётчиками. Дубликат he занимает отдельный столбец.')+'</small>';
  $('case').onchange=e=>{state.case=Number(e.target.value);renderLab(id);};
  bindAnswer(values[state.case],tr('For this text: ','Для этого текста: ')+JSON.stringify(values[state.case])+'. '+tr('he is a suffix of she. The duplicate he has the same count; a new text never accumulates the old counts.','he — суффикс she. Дубликат he получает тот же счётчик; новый текст не накапливает старые счётчики.'));
 }
}
document.addEventListener('click',e=>{const link=e.target.closest('[data-topic]');if(link){e.preventDefault();go(link.dataset.topic);}});
document.querySelector('.skip').onclick=e=>{e.preventDefault();$('main').focus();$('main').scrollIntoView({block:'start'});};
$('search').oninput=renderNav;
window.onhashchange=()=>go(location.hash.slice(1));
go(location.hash.slice(1)||'start');
