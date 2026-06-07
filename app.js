const canvas=document.getElementById('game');
const ctx=canvas.getContext('2d');
const hud=document.getElementById('hud');
let keys={},pulse=0;
const player={x:600,y:310,r:16,vx:0,vy:0};
let shards=[];
function seed(){
  shards=[];
  for(let i=0;i<25;i++)shards.push({x:40+Math.random()*1120,y:45+Math.random()*530,r:5+Math.random()*5,a:1,t:Math.random()*6});
  player.x=600;player.y=310;player.vx=0;player.vy=0;pulse=0;
}
function dir(d,on=true){
  if(d==='up')keys.ArrowUp=on;
  if(d==='down')keys.ArrowDown=on;
  if(d==='left')keys.ArrowLeft=on;
  if(d==='right')keys.ArrowRight=on;
  if(d==='stop'){keys={};player.vx=player.vy=0;}
}
document.addEventListener('keydown',e=>{keys[e.key]=1;if(e.key===' ')pulse=18;});
document.addEventListener('keyup',e=>keys[e.key]=0);
document.querySelectorAll('[data-dir]').forEach(b=>{
  b.addEventListener('pointerdown',()=>dir(b.dataset.dir,1));
  b.addEventListener('pointerup',()=>dir(b.dataset.dir,0));
  b.addEventListener('pointerleave',()=>dir(b.dataset.dir,0));
});
document.getElementById('pulseBtn').onclick=()=>pulse=18;
document.getElementById('resetBtn').onclick=seed;
function frame(){
  ctx.fillStyle='#050403';ctx.fillRect(0,0,1200,620);
  for(let i=0;i<80;i++){ctx.fillStyle='rgba(127,215,255,.035)';ctx.fillRect(Math.random()*1200,Math.random()*620,2,2);}
  const ax=(keys.d||keys.ArrowRight?1:0)-(keys.a||keys.ArrowLeft?1:0);
  const ay=(keys.s||keys.ArrowDown?1:0)-(keys.w||keys.ArrowUp?1:0);
  player.vx=(player.vx+ax*.7)*.86;player.vy=(player.vy+ay*.7)*.86;
  player.x=Math.max(18,Math.min(1182,player.x+player.vx));
  player.y=Math.max(18,Math.min(602,player.y+player.vy));
  let got=0;
  shards.forEach(s=>{
    if(!s.a){got++;return;}
    s.t+=.05;
    const glow=6+Math.sin(s.t)*4;
    ctx.beginPath();ctx.arc(s.x,s.y,s.r+glow,0,Math.PI*2);ctx.fillStyle='rgba(202,169,107,.08)';ctx.fill();
    ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fillStyle='#caa96b';ctx.fill();
    const dx=player.x-s.x,dy=player.y-s.y;
    if(Math.hypot(dx,dy)<player.r+s.r+2+(pulse?36:0)){s.a=0;got++;}
  });
  if(pulse){ctx.beginPath();ctx.arc(player.x,player.y,70-pulse*2,0,Math.PI*2);ctx.strokeStyle='rgba(127,215,255,.45)';ctx.lineWidth=3;ctx.stroke();pulse--;}
  ctx.beginPath();ctx.arc(player.x,player.y,player.r,0,Math.PI*2);ctx.fillStyle='#f7f0df';ctx.shadowColor='#7fd7ff';ctx.shadowBlur=18;ctx.fill();ctx.shadowBlur=0;
  hud.textContent='SIGNAL SHARDS: '+got+'/25';
  ctx.fillStyle='#caa96b';ctx.font='900 22px Bahnschrift, sans-serif';ctx.fillText(hud.textContent,24,38);
  if(got===25){ctx.font='900 58px Bahnschrift, sans-serif';ctx.fillStyle='#7dff9f';ctx.fillText('HIBERNATION ONLINE',310,315);}
  requestAnimationFrame(frame);
}
seed();frame();
if('serviceWorker' in navigator){navigator.serviceWorker.register('./service-worker.js').catch(()=>{});}
window.MATTBEAR_HIBERNATION={movement:'HiberNation',artist:'MATTBEAR',featured:'All Fall Down',hub:'https://bearicide.github.io/HiberNation/'};