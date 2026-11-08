export function formatTime(value){const s=Math.max(0,Math.floor(value||0));return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;}
export function parseTime(text){const parts=text.trim().split(':');if(parts.length>3||!parts.every(x=>/^\d+$/.test(x)))return null;if(parts.length>1&&parts.slice(1).some(x=>Number(x)>59))return null;return parts.reduce((sum,x)=>sum*60+Number(x),0);}
export function playerControls(tr){return `<div class="video-tools"><div class="seek-row"><label for="videoSeek">${tr('Playback position','Позиция воспроизведения')}</label><output id="videoClock">0:00</output><input id="videoSeek" type="range" min="0" max="1" value="0" step="1" aria-label="${tr('Seek video','Перемотка видео')}"></div><div class="row"><button id="videoBack" type="button">−10 ${tr('s','с')}</button><button id="videoForward" type="button">+10 ${tr('s','с')}</button><div><label for="videoTime">${tr('Go to (mm:ss)','Перейти к (мм:сс)')}</label><input id="videoTime" class="short" value="0:00" inputmode="numeric" placeholder="15:00"></div><button id="videoGo" type="button">${tr('Go','Перейти')}</button><div><label for="videoSpeed">${tr('Speed','Скорость')}</label><select id="videoSpeed"><option value="0.75">0.75×</option><option selected value="1">1×</option><option value="1.25">1.25×</option><option value="1.5">1.5×</option><option value="2">2×</option></select></div></div><p id="videoStatus" role="status" aria-live="polite"></p></div>`;}
export function attachPlayer(video,tr){
 const $=id=>document.getElementById(id),slider=$('videoSeek'),status=$('videoStatus'),abort=new AbortController();let blobURL=null,loading=null,disposed=false,scrubbing=false;
 const source=video.querySelector('source').src;
 function paint(){if(disposed)return;const duration=Number.isFinite(video.duration)?video.duration:0;if(duration)slider.max=String(Math.floor(duration));if(!scrubbing){slider.value=String(Math.floor(video.currentTime||0));$('videoClock').textContent=formatTime(video.currentTime)+' / '+formatTime(duration);}}
 video.addEventListener('loadedmetadata',paint);video.addEventListener('timeupdate',paint);video.addEventListener('durationchange',paint);
 async function bufferedFile(){
  if(blobURL)return;if(loading)return loading;
  loading=(async()=>{status.textContent=tr('Loading video…','Загрузка видео…');const response=await fetch(source,{signal:abort.signal});if(!response.ok)throw Error('fetch');const blob=await response.blob();if(disposed)return;blobURL=URL.createObjectURL(blob);video.src=blobURL;video.load();await new Promise((resolve,reject)=>{video.addEventListener('loadedmetadata',resolve,{once:true});video.addEventListener('error',reject,{once:true});});})();
  try{await loading;}finally{loading=null;}
 }
 async function seek(seconds){
  if(seconds===null||!Number.isFinite(seconds)){status.textContent=tr('Enter a time such as 15:00.','Введите время, например 15:00.');return;}
  const wasPlaying=!video.paused;
  try{
   if(!Number.isFinite(video.duration))await new Promise(resolve=>video.addEventListener('loadedmetadata',resolve,{once:true}));
   const target=Math.max(0,Math.min(seconds,video.duration-.05));
   let available=false;for(let i=0;i<video.seekable.length;i++)if(target>=video.seekable.start(i)&&target<=video.seekable.end(i))available=true;
   if(!available)await bufferedFile();if(disposed)return;
   video.currentTime=target;video.playbackRate=Number($('videoSpeed').value);$('videoTime').value=formatTime(target);status.textContent='';if(wasPlaying)await video.play();paint();
  }catch(e){if(!disposed)status.textContent=tr('Video could not be loaded. Try again or download the file.','Не удалось загрузить видео. Повторите попытку или скачайте файл.');}
 }
 slider.addEventListener('input',()=>{scrubbing=true;$('videoClock').textContent=formatTime(Number(slider.value))+' / '+formatTime(video.duration);});slider.addEventListener('change',()=>{const target=Number(slider.value);scrubbing=false;seek(target);});
 $('videoGo').onclick=()=>seek(parseTime($('videoTime').value));$('videoTime').onkeydown=e=>{if(e.key==='Enter')$('videoGo').click();};
 $('videoBack').onclick=()=>seek(video.currentTime-10);$('videoForward').onclick=()=>seek(video.currentTime+10);$('videoSpeed').onchange=e=>video.playbackRate=Number(e.target.value);
 paint();return {seek,dispose(){disposed=true;abort.abort();video.pause();if(blobURL)URL.revokeObjectURL(blobURL);}};
}
