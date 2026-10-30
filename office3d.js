/* GACD Technology — 3D Virtual Office (three.js, vendored locally) */
import * as THREE from './vendor/three.module.min.js';
import {OrbitControls} from './vendor/OrbitControls.js';
const $=s=>document.querySelector(s),$$=s=>document.querySelectorAll(s);
const Q=new URLSearchParams(location.search);
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const hour=()=>{const h=Q.get('hour');if(h!==null&&h!=='')return parseFloat(h);const d=new Date();return d.getHours()+d.getMinutes()/60};
const TEAM=[
 {id:'cto',name:'CTO Alex',role:'Builds and runs GACD\'s tech.',status:'Reviewing code and pull requests',color:'#2b57c9',shirt:0x2a3f8a,hair:0x3a2418,skin:0xf1c9a0,desk:[-7,-4.5],face:Math.PI,
  lines:['Back to coding 💻','Merging a PR ✅','Checking cloud servers ☁️','Patching network security 🔒','Testing an IoT sensor 📡']},
 {id:'cfo',name:'CFO Alex',role:'Keeps GACD\'s finances sharp and growing.',status:'Tracking US top gainers and MRVL',color:'#1f8a4c',shirt:0x2f7a4d,hair:0x1a1410,skin:0xe8b88a,desk:[7,-4.5],face:Math.PI,
  lines:['Tracking US top gainers 📈','Watching MRVL 👀','Checking costs 💰','Stock report at 4:30 PM ET 📊']},
 {id:'mkt',name:'Marketing Connie',role:'Finds GACD\'s next opportunity and tells its story.',status:'Scouting Ontario IoT, cloud, network, AI and security opportunities',note:'Daily report goes out around 1 PM',color:'#c23d8a',shirt:0xd2569a,hair:0x6a3a1a,skin:0xf3cfae,desk:[-7,3.5],face:0,long:1,
  lines:['Drafting a social post ✍️','Planning the next campaign 📣','Scouting Ontario AI startups 🔎','IoT & cloud events this week 📅','Daily report around 1 PM 📝']},
 {id:'adm',name:'Admin Agnes',role:'Keeps the calendar, inbox and day on track.',status:'Preparing the daily 7:30 AM schedule and agenda',color:'#b8641f',shirt:0xe08a3c,hair:0x2a1a12,skin:0xd9a27a,desk:[7,3.5],face:0,long:1,
  lines:['Preparing the 7:30 AM agenda 🗓️','Sorting the inbox 📬','Booking a meeting room 📅','Checking the mail ✉️']}];
/* ---------- scene ---------- */
const box=$('#view3d');
const renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;box.prepend(renderer.domElement);
const scene=new THREE.Scene();
const cam=new THREE.PerspectiveCamera(45,1,.1,200);cam.position.set(0,17,21);
const ctr=new OrbitControls(cam,renderer.domElement);ctr.target.set(0,1,0);ctr.enableDamping=true;ctr.maxPolarAngle=Math.PI/2.15;ctr.minDistance=8;ctr.maxDistance=40;ctr.enablePan=false;
ctr.autoRotate=!RM;ctr.autoRotateSpeed=.6;let idle=0;ctr.addEventListener('start',()=>{ctr.autoRotate=false;idle=0});
const M=c=>new THREE.MeshLambertMaterial({color:c});
function B(w,h,d,c,x,y,z,p=scene){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),typeof c==='number'?M(c):c);m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;p.add(m);return m}
function labelTex(t,bg,fg,w=512,h=128,font=44){const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');x.fillStyle=bg;x.fillRect(0,0,w,h);x.strokeStyle=fg;x.lineWidth=8;x.setLineDash([16,10]);x.strokeRect(8,8,w-16,h-16);x.fillStyle=fg;x.font=`${font}px "Press Start 2P", monospace`;x.textAlign='center';x.textBaseline='middle';t.split('\n').forEach((l,i,a)=>x.fillText(l,w/2,h/2+(i-(a.length-1)/2)*font*1.3));const tx=new THREE.CanvasTexture(c);tx.colorSpace=THREE.SRGBColorSpace;return tx}
const hemi=new THREE.HemisphereLight(0xffffff,0x554466,1.2);scene.add(hemi);
const sun=new THREE.DirectionalLight(0xffffff,1.4);sun.position.set(10,20,8);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-16,right:16,top:16,bottom:-16});scene.add(sun);
const lamps=[];
// floor + zones
B(28,.2,20,0xc28d5d,0,-.1,0);
const zones=[[-7,-4.5,0xa8c8e8,'TECH LAB'],[7,-4.5,0xf0c0cf,'FINANCE'],[-7,3.5,0xf6d4e8,'MARKETING'],[7,3.5,0xf4d3b8,'ADMIN · RECEPTION']];
for(const[x,z,c,n]of zones){B(10,.04,6,c,x,.02,z);const s=new THREE.Mesh(new THREE.PlaneGeometry(4,.8),new THREE.MeshBasicMaterial({map:labelTex(n,'#1d1a30','#f4efe2',512,100,30)}));s.position.set(x,.06,z+(z<0?-2.6:2.6));s.rotation.x=-Math.PI/2;scene.add(s)}
// walls
const wallM=M(0xece6f6);B(28,4,.3,wallM,0,2,-10);B(.3,4,20,wallM,-14,2,0);
// windows on back wall
const winMats=[];for(const x of[-9,-3,3,9]){B(4.4,2.4,.1,0x5a3d28,x,2.4,-9.82);const g=new THREE.MeshBasicMaterial({color:0x9fd3f7});winMats.push(g);B(4,2,.1,g,x,2.4,-9.78)}
// welcome banner + logo sign
const ban=new THREE.Mesh(new THREE.PlaneGeometry(12,1.1),new THREE.MeshBasicMaterial({map:labelTex('WELCOME TO GACD TECHNOLOGY:\nBUILDING ONTARIO\'S IOT, CLOUD, NETWORK,\nAI AND SECURITY FUTURE','#ffcc33','#1b1b2f',1536,240,34)}));ban.scale.y=1.8;ban.position.set(0,4.6,-9.7);scene.add(ban);
const logo=new THREE.Mesh(new THREE.PlaneGeometry(3.2,1.6),new THREE.MeshBasicMaterial({map:labelTex('LOGO\nHERE','#f4efe2','#2b2340',512,256,56)}));logo.position.set(-13.8,2.4,3.5);logo.rotation.y=Math.PI/2;scene.add(logo);
// partitions (low)
B(.15,1.1,5,0xbfb6d8,-1.6,.55,-5.5);B(.15,1.1,5,0xbfb6d8,1.6,.55,-5.5);B(.15,1.1,4,0xbfb6d8,-1.6,.55,4.5);B(.15,1.1,4,0xbfb6d8,1.6,.55,4.5);
// meeting table centre + task board
B(2.6,.15,1.4,0xa8703f,0,.85,-.5);B(.2,.8,.2,0x6b4429,0,.4,-.5);
const board=B(3.2,1.8,.1,0xfbfbfd,0,2.2,-9.75);board.material=new THREE.MeshBasicMaterial({map:labelTex('TASK BOARD\nCLICK ME','#fbfbfd','#2b4a9a',512,288,34)});board.position.y=1.6;board.userData.open='tasks';
// pantry (coffee) at right wall-ish
B(2.6,1,1,0x8f6a49,12.2,.5,-1);const cm=B(.5,.7,.5,0x8a2f2f,11.8,1.35,-1);B(.3,.3,.3,0x3f9b4f,12.7,1.15,-1);
// mailbox at reception
const mail=B(.7,.6,.5,0x3b6fb6,11.5,1.3,6.5);B(1.4,.9,.8,0x9c6a3f,11.5,.45,6.5);mail.userData.open='contact';
// plants
for(const[x,z]of[[-13,-9],[13,-9],[-13,9],[0,8.5]]){B(.6,.6,.6,0xa8532f,x,.3,z);const l=new THREE.Mesh(new THREE.IcosahedronGeometry(.6,0),M(0x3f9b4f));l.position.set(x,1.1,z);l.castShadow=true;scene.add(l)}
/* ---------- desks (everyone faces the starting camera; monitors face the worker) ---------- */
const screens={};
function desk(t){const[x,z]=t.desk,g=new THREE.Group();g.position.set(x,0,z);scene.add(g);
 B(2.4,.12,1.1,0xdba96f,0,.8,0,g);for(const dx of[-1.1,1.1])for(const dz of[-.45,.45])B(.08,.8,.08,0x6b4429,dx,.4,dz,g);
 B(.9,.6,.06,0x2a2a2e,0,1.25,.35,g);const sc=new THREE.MeshBasicMaterial({color:0x43d36a});screens[t.id]=sc;const p=B(.8,.5,.02,sc,0,1.25,.31,g);p.rotation.y=Math.PI;
 B(.08,.25,.08,0x555555,0,.95,.35,g);B(.7,.03,.25,0xe5e5ee,0,.88,-.1,g);
 B(.7,.08,.7,0x4a4a66,0,.5,-.95,g);B(.7,.7,.08,0x4a4a66,0,.85,-1.3,g);B(.18,.04,.18,0x3d3d55,0,.04,-.95,g)}
TEAM.forEach(desk);
/* ---------- characters ---------- */
function person(t){const g=new THREE.Group(),body=new THREE.Group(),sh=M(t.shirt),sk=M(t.skin);g.add(body);
 B(.6,.75,.38,sh,0,1.15,0,body);const head=new THREE.Mesh(new THREE.SphereGeometry(.27,12,10),sk);head.position.y=1.78;head.castShadow=true;body.add(head);
 const hair=new THREE.Mesh(new THREE.SphereGeometry(.29,12,8,0,Math.PI*2,0,Math.PI/2),M(t.hair));hair.position.y=1.82;body.add(hair);
 if(t.long)B(.5,.5,.12,t.hair,0,1.62,-.2,body);if(t.id==='cto')B(.36,.07,.02,0x222222,0,1.8,.26,body);
 for(const ex of[-.1,.1])B(.05,.05,.02,0x1a1a1a,ex,1.8,.26,body);
 const arms=[],legs=[];for(const s of[-1,1]){const a=new THREE.Group();a.position.set(.38*s,1.48,0);B(.16,.6,.16,sh,0,-.3,0,a);B(.15,.12,.15,sk,0,-.62,0,a);body.add(a);arms.push(a);
  const l=new THREE.Group();l.position.set(.16*s,.78,0);B(.2,.75,.22,0x2a2a3a,0,-.38,0,l);body.add(l);legs.push(l)}
 scene.add(g);return{g,body,arms,legs,head}}
/* path graph: front aisle F (z=1.4), back aisle B (z=-8.6), connectors at x=-12.5,-3,3,10 */
const N={},E={};const node=(k,x,z)=>{N[k]=new THREE.Vector3(x,0,z);E[k]=E[k]||[]};const edge=(a,b)=>{E[a].push(b);E[b].push(a)};
const FX=[-12.5,-7,-3,0,3,7,10],BX=[-12.5,-9,-7,-3,0,3,7,9,10];
FX.forEach(x=>node('F'+x,x,1.4));BX.forEach(x=>node('B'+x,x,-8.6));
for(let i=1;i<FX.length;i++)edge('F'+FX[i-1],'F'+FX[i]);for(let i=1;i<BX.length;i++)edge('B'+BX[i-1],'B'+BX[i]);
for(const x of[-12.5,-3,3,10])edge('F'+x,'B'+x);
function gpath(a,b){const d={[a]:0},prev={},q=[a];while(q.length){q.sort((x,y)=>d[x]-d[y]);const u=q.shift();if(u===b)break;for(const v of E[u]){const nd=d[u]+N[u].distanceTo(N[v]);if(d[v]===undefined||nd<d[v]){d[v]=nd;prev[v]=u;q.push(v)}}}
 const p=[];let u=b;while(u!==undefined){p.unshift(u);u=prev[u]}return p}
const P=(x,z)=>new THREE.Vector3(x,0,z),PI=Math.PI;
const SPOTS={
 coffee:{pos:P(10.9,0),entry:'F10',face:PI/2,say:'Grabbing a coffee ☕'},
 meetL:{pos:P(-1.95,-.5),entry:'F-3',face:PI/2,say:'Quick sync 🤝',meet:1},
 meetR:{pos:P(1.95,-.5),entry:'F3',face:-PI/2,say:'Quick sync 🤝',meet:1},
 board:{pos:P(0,-8.4),entry:'B0',face:PI,say:'Updating the task board 📋'},
 mail:{pos:P(11.5,5.6),entry:'F10',via:[P(10,5.6)],face:0,say:'Checking the mail ✉️'},
 winL:{pos:P(-9,-8.7),entry:'B-9',face:PI,say:'Nice view of Ontario 🌆'},
 winR:{pos:P(9,-8.7),entry:'B9',face:PI,say:'Sunny out there ☀️'},
 plantA:{pos:P(-12.5,-8.1),entry:'B-12.5',face:PI,say:'Watering the plants 🪴'},
 plantB:{pos:P(0,7.5),entry:'F0',face:0,say:'Watering the plants 🪴'},
 plantC:{pos:P(-12.5,8.1),entry:'F-12.5',via:[P(-12.5,5)],face:0,say:'This plant needs water 🪴'}};
const VISIT={cto:'Got a minute for a tech question? 💻',cfo:'Quick budget check? 💰',mkt:'Can you share this post? 📣',adm:'Can I book you for a meeting? 📅'};
const CHATS=[['Got a sec? 👋','Sure, what\'s up?'],['How\'s the project going?','On track! 🚀'],['Coffee after this? ☕','Definitely!']];
const AG=TEAM.map((t,i)=>{const p=person(t),[dx,dz]=t.desk,front=dz>0;
 const seat=P(dx,dz-.95),entry=(front?'F':'B')+dx,via=front?[]:[P(dx,-7)];
 return{...t,...p,i,seat,home:{pos:seat,entry,via,face:0},st:"sit",sitT:5+i,path:[],msg:t.lines[0],mt:0,li:0,yaw:0,ph:0,side:0,spot:null,node:entry,stay:0}});
// visiting spots next to each desk
for(const a of AG){const front=a.desk[1]>0;SPOTS['v_'+a.id]={pos:P(a.desk[0]+(a.desk[0]<0?1.6:-1.6),a.seat.z+(front?-.2:0)),entry:a.home.entry,via:a.home.via,face:a.desk[0]<0?-PI/2:PI/2,say:VISIT[a.id],visit:a.id}}
function seat(a){a.st='sit';a.sitT=0;a.g.position.copy(a.seat);a.yaw=0;a.g.rotation.y=0;a.body.position.set(0,-.32,0);a.side=0;for(const l of a.legs)l.rotation.x=-PI/2;a.spot=null;a.node=a.home.entry}
AG.forEach(seat);
function say(a,m){a.msg=m;a.mt=0}
function buildPath(a,spot){const pts=[];
 // leave current spot back to its entry node
 const cur=a.spot?SPOTS[a.spot]:a.home;[...(cur.via||[])].reverse().forEach(v=>pts.push(v.clone()));
 for(const k of gpath(cur.entry,spot.entry))pts.push(N[k].clone());(spot.via||[]).forEach(v=>pts.push(v.clone()));pts.push(spot.pos.clone());return pts}
function goTo(a,key){const s=key==='home'?a.home:SPOTS[key];a.path=buildPath(a,s);a.target=key;a.st='walk';a.body.position.y=0;for(const l of a.legs)l.rotation.x=0;
 if(a.spot)a.spot=null;a.claim=key;if(key!=='home')say(a,'On my way… 🚶')}
const busy=()=>AG.filter(a=>a.st!=='sit').length;
function freeSpots(a){const taken=AG.filter(o=>o!==a).map(o=>o.claim);return Object.keys(SPOTS).filter(k=>!taken.includes(k)&&k!=='v_'+a.id&&!(SPOTS[k].visit&&AG.find(o=>o.id===SPOTS[k].visit).st!=='sit')&&!SPOTS[k].meet)}
function dispatch(){const sitters=AG.filter(a=>a.st==='sit'&&a.sitT>5);if(!sitters.length)return;const a=sitters[Math.random()*sitters.length|0];
 // sometimes start a meeting with a second sitter
 const other=sitters.find(o=>o!==a);if(other&&busy()===0&&Math.random()<.35&&!AG.some(o=>o.claim==='meetL'||o.claim==='meetR')){goTo(a,'meetL');goTo(other,'meetR');meet={a,b:other,t:-1,i:0};return}
 const f=freeSpots(a);goTo(a,f[Math.random()*f.length|0])}
let meet=null,dispT=.4,clk=0;
function angDiff(a,b){let d=b-a;while(d>PI)d-=2*PI;while(d<-PI)d+=2*PI;return d}
function walk(a,dt){const p=a.g.position,tgt=a.path[0];const d=tgt.clone().sub(p);d.y=0;const L=d.length();
 const dir=L>1e-4?d.clone().divideScalar(L):new THREE.Vector3(Math.sin(a.yaw),0,Math.cos(a.yaw));
 // collision avoidance: yield to lower-index walkers ahead; step aside while waiting
 let blocked=false;for(const o of AG){if(o===a||o.st==='sit')continue;const r=o.g.position.clone().sub(p);r.y=0;const dist=r.length();if(dist<1.1&&r.dot(dir)>.2*dist&&(o.st!=='walk'||o.i<a.i||o.waiting))blocked=!(o.waiting&&o.i>a.i&&o.st==='walk')}
 a.waiting=blocked;a.side+=((blocked?.7:0)-a.side)*Math.min(1,dt*3);
 const want=Math.atan2(dir.x,dir.z);a.yaw+=angDiff(a.yaw,want)*Math.min(1,dt*8);a.g.rotation.y=a.yaw;
 a.body.position.x=-a.side;
 if(!blocked){const step=2.0*dt;a.ph+=dt*9;if(L<=step){p.copy(tgt);a.path.shift()}else p.addScaledVector(dir,step)}else a.ph+=dt*2;
 const sw=Math.sin(a.ph)*(blocked?.15:.65);a.legs[0].rotation.x=sw;a.legs[1].rotation.x=-sw;a.arms[0].rotation.x=-sw*.8;a.arms[1].rotation.x=sw*.8;a.body.position.y=Math.abs(Math.sin(a.ph))*.07;
 if(!a.path.length)arrive(a)}
function arrive(a){a.body.position.set(0,0,0);a.side=0;a.waiting=false;for(const l of a.legs)l.rotation.x=0;a.arms.forEach(x=>x.rotation.x=0);
 if(a.target==='home'){seat(a);a.claim=null;say(a,a.lines[a.li=(a.li+1)%a.lines.length]);return}
 const s=SPOTS[a.target];a.spot=a.target;a.st='stand';a.stay=s.meet?30:3.5+Math.random()*3;a.faceTo=s.face;say(a,s.say);
 if(s.visit){const o=AG.find(x=>x.id===s.visit);if(o.st==='sit')setTimeout(()=>say(o,'Sure, happy to help! 👍'),1200)}}
function tickMeet(dt){if(!meet)return;const{a,b}=meet;if(meet.t<0){if(a.st==='stand'&&b.st==='stand'){meet.t=0;meet.c=CHATS[Math.random()*CHATS.length|0]}return}
 meet.t+=dt;const L=[[0,a,meet.c[0]],[2.2,b,meet.c[1]],[4.6,a,a.lines[0]],[7,b,b.lines[0]]];while(meet.i<L.length&&meet.t>=L[meet.i][0]){say(L[meet.i][1],L[meet.i][2]);meet.i++}
 if(meet.t>9.5){a.stay=b.stay=.2+Math.random()*.5;meet=null}}
function tick(dt){clk+=dt;if(RM){for(const a of AG){a.arms[0].rotation.x=a.arms[1].rotation.x=-1.2}return}
 dispT-=dt;if(busy()===0)dispT=Math.min(dispT,.3);if(dispT<=0){if(busy()<2)dispatch();dispT=2+Math.random()*3}
 tickMeet(dt);
 for(const a of AG){a.mt+=dt;
  if(a.st==='sit'){a.sitT+=dt;const tp=Math.sin(clk*14+a.desk[0])*.12;a.arms[0].rotation.x=-1.2+tp;a.arms[1].rotation.x=-1.2-tp;a.head.rotation.y=Math.sin(clk*.7+a.desk[1])*.15;
   if(a.mt>5.5){a.li=(a.li+1)%a.lines.length;say(a,a.lines[a.li])}}
  else if(a.st==='walk')walk(a,dt);
  else if(a.st==='stand'){a.yaw+=angDiff(a.yaw,a.faceTo)*Math.min(1,dt*6);a.g.rotation.y=a.yaw;a.arms[0].rotation.x=Math.sin(clk*2+a.i)*.15;a.stay-=dt;
   if(a.stay<=0){if(Math.random()<.3&&!SPOTS[a.spot].meet){const f=freeSpots(a);goTo(a,f[Math.random()*f.length|0])}else goTo(a,'home')}}
  screens[a.id].color.setHex(a.st==='sit'?((clk*8|0)%9===0?0x2f9d4f:0x43d36a):0x1d3a28)}}
window.__AG=AG;
/* ---------- day / night ---------- */
function light(){const h=hour(),d=h>=7&&h<=17?1:h>=5&&h<7?(h-5)/2:h>17&&h<=20.5?1-(h-17)/3.5:0;
 scene.background=new THREE.Color().lerpColors(new THREE.Color(0x15132b),new THREE.Color(0x9fd3f7),d);
 hemi.intensity=.6+.8*d;sun.intensity=.35+1.15*d;sun.color.set(d>.5?0xffffff:0xffc890);
 const sky=new THREE.Color().lerpColors(new THREE.Color(0x1b2152),new THREE.Color(0x9fd3f7),d);winMats.forEach(m=>m.color.copy(sky))}
/* ---------- tags + strip ---------- */
const tags={};for(const a of AG){const e=document.createElement('div');e.className='tag';e.innerHTML=`<span class="bb"></span><span class="nm" style="background:${a.color}">${a.name.toUpperCase()}</span>`;$('#tags').appendChild(e);tags[a.id]=e}
const v=new THREE.Vector3();
function placeTags(){const W=box.clientWidth,H=box.clientHeight,pl=[];
 for(const a of AG){v.copy(a.g.position);v.y+=2.35;v.project(cam);const e=tags[a.id];if(v.z>1){e.style.display='none';continue}e.style.display='';e.querySelector('.bb').textContent=a.msg;pl.push({e,x:(v.x+1)/2*W,y:(1-v.y)/2*H,w:e.offsetWidth,h:e.offsetHeight})}
 pl.sort((p,q)=>q.y-p.y);for(let i=0;i<pl.length;i++)for(let j=0;j<i;j++){const p=pl[i],q=pl[j];if(Math.abs(p.x-q.x)<(p.w+q.w)/2+4&&p.y>q.y-q.h-4&&p.y-p.h<q.y+4)p.y=q.y-q.h-4}
 for(const p of pl){p.e.style.left=Math.round(Math.max(p.w/2,Math.min(W-p.w/2,p.x)))+'px';p.e.style.top=Math.round(Math.max(p.h,p.y))+'px'}}
function strip(){$('#strip').innerHTML=AG.map(a=>`<button class="st" data-id="${a.id}" style="border-color:${a.color}"><b>${a.name.toUpperCase()}</b><i>● WORKING</i><span>${a.status}${a.note?' · '+a.note:''}</span><span>${a.role}</span></button>`).join('');
 $$('.st').forEach(b=>b.onclick=()=>{const a=AG.find(x=>x.id===b.dataset.id);ctr.autoRotate=false;ctr.target.copy(a.g.position).setY(1);say(a,a.status);box.scrollIntoView({behavior:RM?'auto':'smooth',block:'center'})})}
strip();
/* ---------- picking ---------- */
const ray=new THREE.Raycaster(),mp=new THREE.Vector2();let down=null;
renderer.domElement.addEventListener('pointerdown',e=>down=[e.clientX,e.clientY]);
renderer.domElement.addEventListener('pointerup',e=>{if(!down||Math.hypot(e.clientX-down[0],e.clientY-down[1])>6)return;const r=renderer.domElement.getBoundingClientRect();mp.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(mp,cam);
 const h=ray.intersectObjects(scene.children,true)[0];if(!h)return;let o=h.object;while(o&&!o.userData.open&&!AG.some(a=>a.g===o))o=o.parent;if(!o)return;if(o.userData.open)openP(o.userData.open);else{const a=AG.find(a=>a.g===o);say(a,a.status)}});
/* ---------- panels ---------- */
function openP(id){$('#'+id).hidden=false}
$$('[data-open]').forEach(b=>b.onclick=()=>openP(b.dataset.open));
$$('[data-close]').forEach(b=>b.onclick=()=>b.closest('.overlay').hidden=true);$$('.overlay').forEach(o=>o.onclick=e=>{if(e.target===o)o.hidden=true});
document.onkeydown=e=>{if(e.key==='Escape')$$('.overlay').forEach(o=>o.hidden=true)};
const TKEY='gacd_tasks',S=['todo','doing','done'],CLS={'CTO Alex':'cto','CFO Alex':'cfo','Marketing Connie':'mkt','Admin Agnes':'adm'};
let T=JSON.parse(localStorage.getItem(TKEY)||'null')||[{id:1,t:'Review open pull requests',a:'CTO Alex',s:'todo'},{id:2,t:'Draft monthly budget',a:'CFO Alex',s:'doing'}];
const save=()=>localStorage.setItem(TKEY,JSON.stringify(T)),esc=s=>s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function renderTasks(){$$('.col').forEach(c=>{const l=c.querySelector('.list');l.innerHTML='';T.filter(x=>x.s===c.dataset.s).forEach(x=>{const i=S.indexOf(x.s),d=document.createElement('div');d.className='task';
 d.innerHTML=`<div>${esc(x.t)}</div><span class="who ${CLS[x.a]||'cto'}">${esc(x.a)}</span><div>${i>0?'<button data-m="-1">◀</button>':''}${i<2?'<button data-m="1">▶</button>':''}<button data-del>✕</button></div>`;
 d.onclick=e=>{const b=e.target;if(b.dataset.m)x.s=S[i+ +b.dataset.m];else if('del' in b.dataset)T=T.filter(y=>y!==x);else return;save();renderTasks()};l.appendChild(d)})})}
$('#tf').onsubmit=e=>{e.preventDefault();T.push({id:Date.now(),t:$('#tt').value.trim(),a:$('#ta').value,s:'todo'});$('#tt').value='';save();renderTasks()};
$('#cf').onsubmit=e=>{e.preventDefault();const f=e.target,r=JSON.parse(localStorage.getItem('gacd_requests')||'[]');r.push({...Object.fromEntries(new FormData(f)),at:new Date().toISOString()});localStorage.setItem('gacd_requests',JSON.stringify(r));f.reset();$('#cm').textContent='Saved locally ('+r.length+' total). Thanks!'};
renderTasks();$('#y').textContent=new Date().getFullYear();
/* ---------- loop ---------- */
function size(){const w=box.clientWidth,h=box.clientHeight;renderer.setSize(w,h,false);cam.aspect=w/h;cam.position.setLength(w<700?30:26);cam.updateProjectionMatrix()}
addEventListener('resize',size);size();light();setInterval(light,60000);
const ff=parseFloat(Q.get('ff'))||0;for(let i=0;i<ff*20;i++)tick(.05);
let last=performance.now();
function loop(n){const dt=Math.min(.1,(n-last)/1000);last=n;tick(dt);if(!ctr.autoRotate&&!RM){idle+=dt;if(idle>15)ctr.autoRotate=true}ctr.update();renderer.render(scene,cam);placeTags();requestAnimationFrame(loop)}
requestAnimationFrame(loop);
{const o=Q.get('open');if(o==='tasks'||o==='contact')openP(o)}
