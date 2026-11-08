import {playerControls,attachPlayer} from './video-player.mjs';
import {renderJavaGuide} from './java-guide.mjs';
import {lecture} from './lecture-content.mjs';
import {lis,lcs,matrixChain,knapsack,treeIndependent,isSubsequence} from './dp-core.mjs';
const $=id=>document.getElementById(id),esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let saved={};try{saved=JSON.parse(localStorage.getItem('daa-week8-lecture')||'{}');}catch{}
const S={lang:saved.lang==='EN'?'EN':'RU',inputs:saved.inputs||{},written:{}};
const tr=(en,ru)=>S.lang==='EN'?en:ru;
let topic='start',model=null,current=0,unlocked=false,activePlayer=null;
const routes=[['start','Dynamic programming','Динамическое программирование'],['basics','Principles of DP','Основы DP'],['lis','Increasing subsequences','Возрастающие подпоследовательности'],['lcs','Common subsequences','Общие подпоследовательности'],['knapsack','0/1 knapsack','Рюкзак 0/1'],['matrix','Matrix-chain multiplication','Цепочки матриц'],['tree','Dynamic programming on trees','DP на деревьях'],['exercises','Problems and solutions','Задачи и разбор'],['java','Java examples','Примеры на Java'],['resources','Materials and references','Материалы и литература']];
function save(){try{localStorage.setItem('daa-week8-lecture',JSON.stringify({lang:S.lang,inputs:S.inputs}));}catch{}}
function record(){}
function feedback(text,ok=null){const e=$('feedback');if(e){e.textContent=text;e.className='feedback'+(ok===true?' good':ok===false?' bad':'');}}
function table(headers,rows,active=null){return '<div class="scroll"><table><thead><tr>'+headers.map(v=>'<th scope="col">'+esc(v)+'</th>').join('')+'</tr></thead><tbody>'+rows.map((r,i)=>'<tr>'+r.map((v,j)=>`<${j===0?'th scope="row"':'td'}${active&&active[0]===i&&active[1]===j?' class="active"':''}>${esc(v)}</${j===0?'th':'td'}>`).join('')+'</tr>').join('')+'</tbody></table></div>';}
function links(){return `<div class="links"><a href="materials/Week8_Dynamic_Programming_EN.pptx" download>${tr('Lecture slides (English)','Презентация (English)')}</a><a href="materials/Week8_Dynamic_Programming_RU.pptx" download>${tr('Lecture slides (Russian)','Презентация (Русский)')}</a><a href="materials/Lecture_Notes_EN_RU.html">${tr('Lecture notes','Конспект лекции')}</a><a href="materials/Student_Workbook_EN_RU.md" download>${tr('Problems','Задачи')}</a><a href="materials/Week8Examples.java" download>${tr('Java examples','Примеры на Java')}</a></div>`;}
function nav(){ $('nav').innerHTML=routes.map(([id,en,ru])=>`<a href="#${id}"${topic===id?' aria-current="page"':''}>${esc(tr(en,ru))}</a>`).join(''); }
function lectureChapter(id){
 const chapter=lecture[id];if(!chapter)return '';
 let out=S.lang==='RU'?chapter.ru.map(v=>`<p>${esc(v)}</p>`).join(''):chapter.slides.map(d=>`<h2>${esc(d.title)}</h2><p>${esc(d.notes)}</p>`).join('');
 for(const d of chapter.slides){
  if(d.table&&d.number!==34)out+=`<h3>${esc(S.lang==='RU'?d.title_ru:d.title)}</h3>`+table((S.lang==='RU'?d.table_ru:d.table)[0],(S.lang==='RU'?d.table_ru:d.table).slice(1));
  if(d.code)out+=`<h3>${tr('Java','Java')}</h3><pre><code>${esc(d.code)}</code></pre>`;
 }
 return '<article class="lecture-text">'+out+'</article>';
}
$('en').onclick=()=>{S.lang='EN';save();render();};$('ru').onclick=()=>{S.lang='RU';save();render();};
function render(){
 if(activePlayer){activePlayer.dispose();activePlayer=null;}
 document.documentElement.lang=S.lang.toLowerCase();document.title=tr('Week 8 · Dynamic Programming','Неделя 8 · Динамическое программирование');
 $('ru').setAttribute('aria-pressed',String(S.lang==='RU'));$('en').setAttribute('aria-pressed',String(S.lang==='EN'));
 $('routeLabel').textContent=tr('Lecture 8','Лекция 8');
 $('kicker').textContent=tr('Design and Analysis of Algorithms','Проектирование и анализ алгоритмов');
 $('footer').textContent=tr('Design and Analysis of Algorithms · Dynamic Programming','Проектирование и анализ алгоритмов · Динамическое программирование');
 nav();$('workspace').hidden=true;$('workspace').innerHTML='';$('content').innerHTML='';
 const route=routes.find(x=>x[0]===topic)||routes[0];$('title').textContent=tr(route[1],route[2]);$('lead').textContent='';
 if(['lis','lcs','knapsack','matrix','tree'].includes(topic)){renderLab(topic);return;}
 if(topic==='start')renderStart();
 if(topic==='basics')$('content').innerHTML=lectureChapter('basics');
 if(topic==='exercises')renderQuestions();
 if(topic==='resources')renderResources();
 if(topic==='java')renderJavaGuide($('content'),S.lang);
}
function renderStart(){
 $('title').textContent=tr('Dynamic programming','Динамическое программирование');
 $('lead').textContent=tr('Subsequences, interval problems and dynamic programming on trees.','Подпоследовательности, интервальные задачи и динамическое программирование на деревьях.');
 $('content').innerHTML=`<p>${tr('Dynamic programming computes answers to subproblems and reuses them when solving larger problems. The structure of the input determines the state: an index or a pair of prefixes for subsequences, an interval for partitioning, and a subtree with a boundary condition for trees.','Динамическое программирование вычисляет ответы на подзадачи и использует их при решении более крупных задач. Состояние зависит от структуры входных данных: индекс или пара префиксов для подпоследовательностей, интервал для разбиения, поддерево с условием на корневую вершину для деревьев.')}</p><h2>${tr('Lecture topics','Темы лекции')}</h2><ul>${routes.slice(1,7).map(([id,en,ru])=>`<li><a href="#${id}">${esc(tr(en,ru))}</a></li>`).join('')}</ul><h2>${tr('Video lecture','Видеолекция')}</h2><video id="lessonVideo" controls preload="metadata" poster="media/Poster.jpg"><source src="media/Week8_Dynamic_Programming_EN.mp4" type="video/mp4"><track kind="captions" srclang="en" label="English" src="media/Subtitles_EN.vtt" default></video>${playerControls(tr)}<div class="links"><a href="media/Week8_Dynamic_Programming_EN.mp4" download>${tr('Download video','Скачать видео')}</a><a href="#basics">${tr('Lecture text','Текст лекции')}</a></div><details><summary>${tr('Chapters','Разделы видео')}</summary><div class="chapters" id="chapters"></div></details><h2 id="transcript">${tr('Principles of dynamic programming','Основы динамического программирования')}</h2>${lectureChapter('basics')}`;
 activePlayer=attachPlayer($('lessonVideo'),tr);
 fetch('media/chapters.json').then(r=>r.json()).then(chapters=>{const box=$('chapters');if(!box)return;box.innerHTML=chapters.map(c=>`<button data-seek="${c.start}">${esc(c.stamp+' '+(S.lang==='RU'?c.ru:c.title))}</button>`).join('');box.querySelectorAll('button').forEach(b=>b.onclick=()=>activePlayer?.seek(Number(b.dataset.seek)));}).catch(()=>{});
}
const definitions={
 lis:{lead:['A strictly increasing subsequence can skip positions. Predict the length ending at each index.','Строго возрастающая подпоследовательность может пропускать позиции. Предскажите длину для каждого конечного индекса.'],formula:'dp[i] = max({1} ∪ {dp[j]+1 : j<i and a[j]<a[i]})',task:['Reconstruct one optimal list of input indices (zero-based). Test [3,3,3] and a decreasing array. Code the O(n²) recurrence in Java.','Восстановите оптимальные индексы элементов (нумерация с 0). Проверьте [3,3,3] и убывающий массив. Напишите переход O(n²) на Java.']},
 lcs:{lead:['L[i][j] compares prefixes of lengths i and j. Predict one cell at a time.','L[i][j] сравнивает префиксы длины i и j. Предсказывайте по одной ячейке.'],formula:'match: L[i][j] = 1 + L[i−1][j−1]\nmismatch: max(L[i−1][j], L[i][j−1])\nL[0][j] = L[i][0] = 0',task:['Reconstruct any longest common subsequence. Test an empty input, repeated characters and no matches. Implement the full table in Java.','Восстановите любую НОП. Проверьте пустой ввод, повтор символов и отсутствие совпадений. Реализуйте полную таблицу на Java.']},
 knapsack:{lead:['Each item can be taken once. Prefix rows preserve that restriction.','Каждый предмет можно взять один раз. Строки префиксов сохраняют это ограничение.'],formula:'K[i][c] = max(skip, take if it fits)\nskip = K[i−1][c]\ntake = value[i−1] + K[i−1][c−weight[i−1]]',task:['Enter optimal item indices (zero-based). Explain why ascending capacity is wrong for one item of weight 2, value 3 and capacity 4. Implement the descending loop in Java.','Введите индексы оптимальных предметов (с 0). Объясните ошибку прямого цикла для одного предмета веса 2, ценности 3 и вместимости 4. Реализуйте убывающий цикл на Java.']},
 matrix:{lead:['The matrix order is fixed. Try each split of the interval, then select the cheapest.','Порядок матриц фиксирован. Проверьте каждое разбиение интервала и выберите минимум.'],formula:'M[i][j] = min(M[i][k] + M[k+1][j] + p[i−1]p[k]p[j])\ni ≤ k < j; M[i][i] = 0',task:['For the current dimensions, enter the best final split k. Reconstruct the complete parenthesization. Implement increasing interval lengths in Java.','Для текущих размеров введите лучшее последнее разбиение k. Восстановите полную расстановку скобок. Реализуйте рост длины интервала на Java.']},
 tree:{lead:['Select nodes with no selected adjacent pair. Edges: 0–1, 0–2, 1–3, 1–4.','Выберите вершины без выбранных соседних пар. Рёбра: 0–1, 0–2, 1–3, 1–4.'],formula:'take[u] = weight[u] + sum(skip[child])\nskip[u] = sum(max(take[child], skip[child]))\nA leaf: take = weight; skip = 0',task:['Enter one optimal set of node IDs. Test negative weights and explain why one state per subtree loses information. Implement combination in reverse traversal order.','Введите оптимальные номера вершин. Проверьте отрицательные веса и объясните, почему одного состояния поддерева недостаточно. Реализуйте объединение в обратном порядке обхода.']}
};
function field(id,label,value){return `<div class="field"><label for="${id}">${esc(label)}</label><input id="${id}" value="${esc(value)}" autocomplete="off"></div>`;}
function renderLab(id){
 const d=definitions[id];$('lead').textContent=tr(...d.lead);$('content').innerHTML=lectureChapter(id)+`<h2>${tr('Worked example','Разбор примера')}</h2><div class="formula">${esc(d.formula)}</div><p>${esc(tr(...d.task))}</p>`;
 const prior=S.inputs[id]||{};let fields='';
 if(id==='lis')fields=field('arr',tr('Integer array, up to 12 entries (JSON)','Массив целых, до 12 элементов (JSON)'),prior.arr??'[3,1,2,5,4]');
 if(id==='lcs')fields=field('a',tr('String A (Latin letters, up to 8)','Строка A (латинские буквы, до 8)'),prior.a??'ABCDE')+field('b',tr('String B (up to 8)','Строка B (до 8)'),prior.b??'ACE');
 if(id==='matrix')fields=field('dims',tr('Dimensions, 2–7 positive integers','Размеры, 2–7 положительных целых'),prior.dims??'[40,20,30,10,30]');
 if(id==='knapsack')fields=field('weights',tr('Weights, 1–5 positive integers','Веса, 1–5 положительных целых'),prior.weights??'[2,3,4]')+field('values',tr('Values, same length','Ценности, столько же элементов'),prior.values??'[3,4,5]')+field('cap',tr('Capacity, integer 0–12','Вместимость, целое 0–12'),prior.cap??'5');
 if(id==='tree')fields=field('weights',tr('Five node weights, IDs 0–4','Пять весов вершин, номера 0–4'),prior.weights??'[5,3,4,6,1]');
 $('workspace').hidden=false;$('workspace').innerHTML=`<div class="row">${fields}<button class="primary" id="load">${tr('Load example','Загрузить пример')}</button></div><div id="inputError" role="alert"></div><div id="visual"></div><div class="prediction"><h2 id="predictionTitle"></h2><div class="row"><div><label for="guess" id="guessLabel"></label><input id="guess" class="short" inputmode="numeric"></div><button id="checkStep" class="primary">${tr('Check prediction','Проверить прогноз')}</button><button id="reveal">${tr('Show this step','Показать этот шаг')}</button><button id="next" disabled>${tr('Next state','Следующее состояние')}</button><button id="restart">${tr('Restart trace','Начать трассировку заново')}</button></div><div id="feedback" class="feedback" role="status" aria-live="polite"></div></div><div id="outcome" class="outcome" aria-live="polite"></div><div class="task"><label id="solutionLabel" for="solution"></label><input id="solution" autocomplete="off"><button id="checkSolution">${tr('Check solution','Проверить решение')}</button><p id="solutionFeedback" role="status" aria-live="polite"></p></div><details><summary>${tr('Further problems','Дополнительные задачи')}</summary><p>${tr('LIS: compare O(n²) and O(n log n). LCS: compress to two rows for the length. Matrix chain: compare every parenthesization for n ≤ 6. Tree DP: compare with exhaustive subsets for n ≤ 12. Document which output the optimization still supports.','НВП: сравните O(n²) и O(n log n). НОП: сожмите до двух строк для длины. Цепочка матриц: сравните все скобки при n ≤ 6. DP дерева: сравните с перебором при n ≤ 12. Укажите, какой результат сохраняет оптимизация.')}</p></details>`;
 $('load').onclick=()=>loadModel(id);$('restart').onclick=()=>{current=0;unlocked=false;paintTrace();};
 $('checkStep').onclick=()=>{const raw=$('guess').value.trim(),ev=model?.events[current];if(!ev)return;if(!/^-?\d+$/.test(raw)){feedback(tr('Enter an integer.','Введите целое число.'),false);return;}const value=Number(raw),ok=value===ev.value;record(`${id}:step:${current}:${JSON.stringify(S.inputs[id])}`,{correct:ok,prediction:value,expected:ev.value,at:new Date().toISOString()});if(ok){unlocked=true;feedback(tr('Correct. ','Верно. ')+(S.lang==='EN'?ev.whyEN:ev.whyRU),true);$('next').disabled=false;paintVisual(true);}else feedback(tr('Try again. Read the state meaning and use only completed dependencies.','Попробуйте ещё раз. Уточните смысл состояния и используйте только готовые зависимости.'),false);};
 $('guess').onkeydown=e=>{if(e.key==='Enter')$('checkStep').click();};
 $('reveal').onclick=()=>{const ev=model?.events[current];if(!ev)return;unlocked=true;record(`${id}:reveal:${current}:${JSON.stringify(S.inputs[id])}`,{revealed:true,expected:ev.value});feedback((S.lang==='EN'?ev.whyEN:ev.whyRU),null);$('next').disabled=false;paintVisual(true);};
 $('next').onclick=()=>{if(!unlocked)return;current++;unlocked=false;paintTrace();};
 $('checkSolution').onclick=()=>checkSolution(id);
 loadModel(id);
}
function readArray(id,min,max,low,high){let a;try{a=JSON.parse($(id).value);}catch{throw Error(tr('Use a JSON array, for example [3,1,2].','Введите JSON-массив, например [3,1,2].'));}if(!Array.isArray(a)||a.length<min||a.length>max||a.some(v=>!Number.isInteger(v)||v<low||v>high))throw Error(tr(`Expected ${min}–${max} integers from ${low} to ${high}.`,`Нужно ${min}–${max} целых чисел от ${low} до ${high}.`));return a;}
function loadModel(id){
 try{
  let input={};
  if(id==='lis'){const a=readArray('arr',0,12,-100,100);input={arr:$('arr').value};model={...lis(a),a};}
  if(id==='lcs'){const a=$('a').value,b=$('b').value;if(!/^[A-Za-z]{0,8}$/.test(a)||!/^[A-Za-z]{0,8}$/.test(b))throw Error(tr('Use 0–8 Latin letters in each input.','Введите от 0 до 8 латинских букв в каждой строке.'));input={a,b};model={...lcs(a,b),a,b};}
  if(id==='matrix'){const p=readArray('dims',2,7,1,200);input={dims:$('dims').value};model={...matrixChain(p),p};}
  if(id==='knapsack'){const weights=readArray('weights',1,5,1,12),values=readArray('values',1,5,0,100),W=Number($('cap').value);if(weights.length!==values.length||!/^\d+$/.test($('cap').value)||!Number.isInteger(W)||W<0||W>12)throw Error(tr('Equal array lengths and capacity 0–12 are required.','Нужны массивы одинаковой длины и вместимость 0–12.'));input={weights:$('weights').value,values:$('values').value,cap:String(W)};model={...knapsack(weights,values,W),weights,values,W};}
  if(id==='tree'){const weights=readArray('weights',5,5,-30,30),edges=[[0,1],[0,2],[1,3],[1,4]];input={weights:$('weights').value};model={...treeIndependent(weights,edges),weights,edges};}
  S.inputs[id]=input;save();$('inputError').textContent='';current=0;unlocked=false;paintTrace();
 }catch(e){model=null;$('inputError').textContent=e.message;$('visual').innerHTML='';$('predictionTitle').textContent=tr('Fix the input to start.','Исправьте входные данные.');$('checkStep').disabled=true;$('reveal').disabled=true;$('next').disabled=true;$('checkSolution').disabled=true;$('outcome').textContent='';}
}
function paintTrace(){
 const done=current>=model.events.length,ev=model.events[current];$('guess').value='';$('next').disabled=true;$('checkStep').disabled=done;$('reveal').disabled=done;$('checkSolution').disabled=false;
 $('predictionTitle').textContent=done?tr('Trace complete','Трассировка завершена'):tr(`State ${current+1} of ${model.events.length}: ${ev.label}`,`Состояние ${current+1} из ${model.events.length}: ${ev.label}`);
 $('guessLabel').textContent=tr('Predict the integer value','Предскажите целое значение');feedback(done?tr('Now reconstruct a solution and explain one transition.','Теперь восстановите решение и объясните один переход.'):tr('Predict before showing the next state.','Сделайте прогноз до открытия следующего состояния.'));
 $('outcome').textContent=done?tr(`Optimal value: ${model.value}`,`Оптимальное значение: ${model.value}`):'';
 $('solutionLabel').textContent=topic==='lcs'?tr('One optimal common subsequence (case-sensitive)','Одна НОП (регистр учитывается)'):topic==='matrix'?tr('Best final split k (one matrix: enter 0)','Лучшее последнее разбиение k (одна матрица: 0)'):tr('Optimal indices as JSON, for example [0,3,4]','Оптимальные индексы в JSON, например [0,3,4]');
 $('solution').placeholder=topic==='lcs'?'ACE':topic==='matrix'?'3':'[0,3,4]';$('solutionFeedback').textContent='';paintVisual(false);
}
function paintVisual(revealCurrent){
 const idx=Math.min(current-(revealCurrent?0:1),model.events.length-1),ev=idx>=0?model.events[idx]:null,next=model.events[current];let html='';
 if(topic==='lis'){
  const values=model.a.map((_,i)=>ev&&i<=ev.i?ev.dp[i]:'?');html=table([tr('Index','Индекс'),...model.a.map((_,i)=>i)],[[tr('Value','Значение'),...model.a],['dp',...values],['parent',...model.a.map((_,i)=>ev&&i<=ev.i?ev.parent[i]:'?')]]);
 }else if(topic==='tree'){
  const seen=new Set(model.events.slice(0,idx+1).map(e=>e.u));
  const pos=[[300,48],[180,140],[420,140],[100,235],[260,235]];
  html=`<svg viewBox="0 0 600 280" role="img" aria-label="${tr('Weighted rooted tree: root 0, children 1 and 2, nodes 3 and 4 below 1.','Взвешенное дерево: корень 0, дети 1 и 2, вершины 3 и 4 под вершиной 1.')}"><g stroke="#9ab0bf" stroke-width="2">${model.edges.map(([u,v])=>`<line x1="${pos[u][0]}" y1="${pos[u][1]}" x2="${pos[v][0]}" y2="${pos[v][1]}"/>`).join('')}</g>${pos.map(([x,y],u)=>`<g><circle cx="${x}" cy="${y}" r="29" fill="${next?.u===u?'#f5d3e2':'#edf3f7'}" stroke="#a44270" stroke-width="2"/><text x="${x}" y="${y+5}" text-anchor="middle" font-family="Arial" font-size="19" fill="#173247">${u}</text><text x="${x+38}" y="${y+5}" font-family="Arial" font-size="17" fill="#526d7e">w=${model.weights[u]}</text></g>`).join('')}</svg>`;
  html+=table([tr('Node','Вершина'),tr('Weight','Вес'),'take','skip'],model.weights.map((w,u)=>[u,w,seen.has(u)?ev.take[u]:'?',seen.has(u)?ev.skip[u]:'?']),next?[next.u,2]:null);
 }else if(topic==='matrix'){
  const n=model.p.length-1;html='<p>'+model.p.slice(0,-1).map((v,i)=>`A${i+1}: ${v} × ${model.p[i+1]}`).join(' &nbsp; ')+'</p>';
  const seen=new Set(model.events.slice(0,idx+1).map(e=>`${e.i},${e.j}`));html+=table(['i \\ j',...Array.from({length:n},(_,i)=>i+1)],Array.from({length:n},(_,r)=>[r+1,...Array.from({length:n},(_,c)=>r>c?'—':r===c?0:seen.has(`${r+1},${c+1}`)?ev.dp[r+1][c+1]:'?')]),next?[next.i-1,next.j]:null);
 }else{
  const a=topic==='lcs'?model.a:Array.from({length:model.weights.length},(_,i)=>`${i+1}: w=${model.weights[i]},v=${model.values[i]}`),b=topic==='lcs'?model.b:Array.from({length:model.W+1},(_,c)=>c);
  const rows=Array.from({length:a.length+1},(_,i)=>[i===0?'∅':a[i-1],...Array.from({length:b.length+(topic==='lcs'?1:0)},(_,j)=>{
   const boundary=i===0||(topic==='lcs'&&j===0);if(boundary)return 0;
   const rank=topic==='lcs'?(i-1)*model.b.length+j-1:(i-1)*(model.W+1)+j;
   return rank<=idx?model.events[rank]?.value:'?';
  })]);
  html=table([topic==='lcs'?'A \\ B':tr('Items','Предметы'),...(topic==='lcs'?['∅',...b]:b)],rows,next?[next.i,next.j+1]:null);
 }
 $('visual').innerHTML=html;
}
function checkSolution(id){
 if(!model)return;const raw=$('solution').value;let valid=false,detail='';
 if(id==='lcs'){valid=raw.length===model.value&&isSubsequence(raw,model.a)&&isSubsequence(raw,model.b);detail=tr(`One optimum is ${model.sequence||'the empty string'}, length ${model.value}.`,`Один оптимум: ${model.sequence||'пустая строка'}, длина ${model.value}.`);}
 else if(id==='matrix'){const k=Number(raw);valid=/^\d+$/.test(raw)&&Number.isInteger(k)&&(model.p.length===2?k===0: k>=1&&k<model.p.length-1&&model.dp[1][k]+model.dp[k+1][model.p.length-1]+model.p[0]*model.p[k]*model.p.at(-1)===model.value);detail=tr(`Minimum ${model.value}. One optimum: ${model.expression}.`,`Минимум ${model.value}. Один вариант: ${model.expression}.`);}
 else{
  let a;try{a=JSON.parse(raw);}catch{}const n=id==='lis'?model.a.length:model.weights.length;
  valid=Array.isArray(a)&&a.every(v=>Number.isInteger(v)&&v>=0&&v<n)&&new Set(a).size===a.length;
  if(valid&&id==='lis')valid=a.length===model.value&&a.every((x,i)=>i===0||(a[i-1]<x&&model.a[a[i-1]]<model.a[x]));
  if(valid&&id==='knapsack')valid=a.reduce((s,i)=>s+model.weights[i],0)<=model.W&&a.reduce((s,i)=>s+model.values[i],0)===model.value;
  if(valid&&id==='tree')valid=model.edges.every(([u,v])=>!a.includes(u)||!a.includes(v))&&a.reduce((s,i)=>s+model.weights[i],0)===model.value;
  detail=tr(`One optimum uses indices ${JSON.stringify(model.indices||model.selected)}. Value ${model.value}.`,`Один оптимум использует индексы ${JSON.stringify(model.indices||model.selected)}. Значение ${model.value}.`);
 }
 record(`${id}:solution:${JSON.stringify(S.inputs[id])}`,{correct:valid,answer:raw,at:new Date().toISOString()});
 $('solutionFeedback').textContent=valid?tr('Correct. ','Верно. ')+detail:tr('Check feasibility and optimal value. Try again before revealing steps.','Проверьте допустимость и оптимальность. Попробуйте ещё раз до открытия шагов.');
}
const questions={
 diagnosis:[
  {en:'In LIS, dp[i] describes an answer ending exactly at i. For [3,1,2], what is dp[2]?',ru:'В НВП dp[i] заканчивается именно в i. Чему равно dp[2] для [3,1,2]?',answer:'2',whyEN:'The subsequence [1,2] ends at index 2.',whyRU:'Подпоследовательность [1,2] заканчивается в индексе 2.'},
  {en:'How many indices describe an LCS prefix-pair state?',ru:'Сколько индексов задаёт пару префиксов в состоянии НОП?',answer:'2',whyEN:'One prefix length for each string.',whyRU:'По одной длине префикса для каждой строки.'},
  {en:'How many states per node does tree independent set use here?',ru:'Сколько состояний на вершину используется в задаче о независимом множестве?',answer:'2',whyEN:'Take and skip retain the boundary decision.',whyRU:'Take и skip сохраняют решение на границе поддерева.'}
 ],exit:[
  {en:'Transfer: stick length 10, required cuts [4,7]. A cut costs its current segment length. What is the minimum total cost?',ru:'Новая задача: палка длины 10, разрезы [4,7]. Разрез стоит длину текущего сегмента. Какова минимальная сумма?',answer:'16',whyEN:'Cut at 4 first: 10 + 6 = 16. Cutting at 7 first costs 17.',whyRU:'Сначала 4: 10 + 6 = 16. Сначала 7: 17.'},
  {en:'One 0/1 item, weight 2, value 3, capacity 4. What is the optimum?',ru:'Один предмет 0/1: вес 2, ценность 3, вместимость 4. Чему равен оптимум?',answer:'3',whyEN:'The item exists once. An ascending compressed loop would incorrectly give 6.',whyRU:'Предмет существует один раз. Прямой сжатый цикл ошибочно дал бы 6.'},
  {en:'LIS of [5,4,3,2,1]: enter the length.',ru:'НВП для [5,4,3,2,1]: введите длину.',answer:'1',whyEN:'Every nonempty strictly increasing subsequence here has one element.',whyRU:'Строго возрастающая непустая подпоследовательность здесь содержит один элемент.'},
  {en:'Tree weights [-5,-3,-4,-6,-1], same edges, empty selection allowed. What is the optimum?',ru:'Веса дерева [-5,-3,-4,-6,-1], те же рёбра, пустое множество разрешено. Чему равен оптимум?',answer:'0',whyEN:'Selecting no nodes is legal and has weight 0.',whyRU:'Пустое множество допустимо и имеет вес 0.'}
 ]};
function renderQuestions(){
 $('content').innerHTML=lectureChapter('exercises')+'<h2>'+tr('Questions','Вопросы')+'</h2>'+questions.exit.map((q,i)=>`<section class="task"><label for="q${i}">${esc(tr(q.en,q.ru))}</label><input id="q${i}" class="short"><button data-checkq="${i}">${tr('Check','Проверить')}</button><p id="qf${i}" role="status"></p></section>`).join('');
 document.querySelectorAll('[data-checkq]').forEach(b=>b.onclick=()=>{const i=Number(b.dataset.checkq),q=questions.exit[i],ok=$('q'+i).value.trim()===q.answer;$('qf'+i).textContent=ok?tr(q.whyEN,q.whyRU):tr('Review the recurrence and try again.','Проверьте переход и попробуйте ещё раз.');});
}
function renderResources(){
 $('lead').textContent=tr('Lecture materials and references.','Материалы лекции и литература.');
 $('content').innerHTML=`${links()}<h2>YouTube · English</h2><ul><li><a href="https://www.youtube.com/watch?v=KLBCUx1is2c" target="_blank" rel="noopener">MIT OpenCourseWare: Dynamic Programming, Part 2: LCS, LIS, Coins</a> — ${tr('LCS, LIS and a second derivation of the states.','LCS, LIS и дополнительный вывод состояний.')} <a href="https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/resources/lecture-16-dynamic-programming-part-2-lcs-lis-coins/">MIT OCW</a></li><li><a href="https://www.youtube.com/watch?v=_WncuhSJZyA" target="_blank" rel="noopener">Abdul Bari: Matrix Chain Multiplication using Dynamic Programming Formula</a> — ${tr('Matrix-chain recurrence and table.','Переход и таблица матричной цепочки.')}</li></ul><h2>YouTube · Русский</h2><ul><li><a href="https://www.youtube.com/watch?v=-yiKNcjcK0Y" target="_blank" rel="noopener">Фоксфорд: Наибольшая общая подпоследовательность</a> — ${tr('Russian introduction to LCS.','Введение в НОП.')}</li><li><a href="https://www.youtube.com/watch?v=bKrRqJID_Dw" target="_blank" rel="noopener">Игорь Клейнер: Динамическое программирование 8-1, Независимое множество вершин</a> — ${tr('Graphs, trees and independent sets.','Графы, деревья и независимые множества.')}</li></ul><h2>CLRS · 4th edition, 2022</h2><ul><li>§14.1: ${tr('Rod cutting and memoization','Разрезание стержня и мемоизация')}, pp. 363–372</li><li>§14.2: ${tr('Matrix-chain multiplication','Цепочки матриц')}, pp. 373–381</li><li>§14.3: ${tr('Elements of dynamic programming','Элементы DP')}, pp. 382–392</li><li>§14.4: ${tr('Longest common subsequence','Наибольшая общая подпоследовательность')}, pp. 393–399</li><li>Problem 14-6: ${tr('Planning a company party','Праздник компании')}, p. 411</li></ul>`;
}
function go(){const id=location.hash.slice(1);const next=routes.some(r=>r[0]===id)?id:'start';topic=next;model=null;current=0;render();}
window.addEventListener('hashchange',go);go();
