/* GACD Technology — isometric 3D Virtual Office (three.js vendored locally) */
import * as THREE from './vendor/three.module.min.js';
import {OrbitControls} from './vendor/OrbitControls.js';
const $=s=>document.querySelector(s),$$=s=>document.querySelectorAll(s);
const Q=new URLSearchParams(location.search);
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const PI=Math.PI,V=(x,z)=>new THREE.Vector3(x,0,z);
const TZ='America/Toronto';
const hour=()=>{const h=Q.get('hour');if(h!==null&&h!=='')return parseFloat(h);const p=new Intl.DateTimeFormat('en-CA',{timeZone:TZ,hour:'numeric',minute:'numeric',hourCycle:'h23'}).formatToParts(new Date());return +p.find(x=>x.type==='hour').value+ +p.find(x=>x.type==='minute').value/60};
const isoDate=()=>new Intl.DateTimeFormat('en-CA',{timeZone:TZ,year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const usDate=()=>new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',month:'short',day:'numeric',year:'numeric'}).format(new Date());
const etHour=()=>{const h=Q.get('hour');if(h!==null&&h!=='')return parseFloat(h);const p=new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',hour:'numeric',minute:'numeric',hourCycle:'h23'}).formatToParts(new Date());return +p.find(x=>x.type==='hour').value+ +p.find(x=>x.type==='minute').value/60};
const TEAM=[
 {id:'cto',name:'CTO Alex',short:'CTO',icon:'💻',role:"Builds and runs GACD's tech.",status:'Reviewing code and pull requests',color:'#5b8cff',shirt:0x3b5bb5,hair:0x3a2418,skin:0xf1c9a0,desk:[1.5,-4],
  files:()=>[['pr_review_notes.md']],lines:['Back to coding 💻','Merging a PR ✅','Checking cloud servers ☁️','Patching network security 🔒','Testing an IoT sensor 📡']},
 {id:'cfo',name:'CFO Alex',short:'CFO',icon:'📈',role:"Keeps GACD's finances sharp and growing.",status:'Tracking US top gainers and MRVL',color:'#3ddc84',shirt:0x2f7a4d,hair:0x1a1410,skin:0xe8b88a,desk:[5.5,-4],
  files:()=>[['US top gainers – '+usDate()],['MRVL',1]],lines:['Tracking US top gainers 📈','Watching MRVL 👀','Checking costs 💰','Stock report at 4:30 PM ET 📊']},
 {id:'mkt',name:'Marketing Connie',short:'Marketing',icon:'📣',role:"Finds GACD's next opportunity and tells its story.",status:'Scouting Ontario IoT, cloud, network, AI and security opportunities',note:'Daily report goes out around 1 PM',color:'#ff7ab8',shirt:0xd2569a,hair:0x6a3a1a,skin:0xf3cfae,desk:[1.5,.5],long:1,
  files:()=>[['opportunities_report.md']],lines:['Drafting a social post ✍️','Planning the next campaign 📣','Scouting Ontario AI startups 🔎','IoT & cloud events this week 📅','Daily report around 1 PM 📝']},
 {id:'adm',name:'Admin Agnes',short:'Admin',icon:'🗓️',role:'Keeps the calendar, inbox and day on track.',status:'Preparing the daily 7:30 AM schedule and agenda',color:'#ffb35c',shirt:0xe08a3c,hair:0x2a1a12,skin:0xd9a27a,desk:[5.5,.5],long:1,
  files:()=>[['briefing_'+isoDate()+'.md']],lines:['Preparing the 7:30 AM agenda 🗓️','Sorting the inbox 📬','Booking a meeting room 📅','Checking the mail ✉️']}];
const cfoDone=()=>etHour()>=16.5;
const statusOf=t=>t.id==='cfo'&&cfoDone()?'Done, emailed':t.status;
/* ---------- renderer / camera ---------- */
const box=$('#view3d');
const renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true,alpha:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;box.prepend(renderer.domElement);
const scene=new THREE.Scene();
const cam=new THREE.OrthographicCamera(-10,10,10,-10,-100,200);cam.position.set(20,19,20);
const ctr=new OrbitControls(cam,renderer.domElement);ctr.target.set(0,0,0);ctr.enableDamping=true;ctr.enablePan=false;ctr.minZoom=.7;ctr.maxZoom=3;
ctr.minPolarAngle=ctr.maxPolarAngle=Math.acos(19/Math.hypot(20,19,20));const az=PI/4;ctr.minAzimuthAngle=az-.45;ctr.maxAzimuthAngle=az+.45;
const mats={};const M=c=>mats[c]||(mats[c]=new THREE.MeshLambertMaterial({color:c}));
function B(w,h,d,c,x,y,z,p=scene){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),typeof c==='number'?M(c):c);m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;p.add(m);return m}
function Cy(r,h,c,x,y,z,seg=16,p=scene){const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,seg),typeof c==='number'?M(c):c);m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;p.add(m);return m}
function tex(lines,bg,fg,w,h,font,dash){const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');x.fillStyle=bg;x.fillRect(0,0,w,h);if(dash){x.strokeStyle=fg;x.lineWidth=6;x.setLineDash([14,9]);x.strokeRect(8,8,w-16,h-16)}x.fillStyle=fg;x.font=`600 ${font}px -apple-system,Segoe UI,Roboto,sans-serif`;x.textAlign='center';x.textBaseline='middle';lines.forEach((l,i)=>x.fillText(l,w/2,h/2+(i-(lines.length-1)/2)*font*1.25));const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=4;return t}
function sign(lines,bg,fg,w,h,x,y,z,ry,font,dash){const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:tex(lines,bg,fg,w*100,h*100,font,dash)}));m.position.set(x,y,z);m.rotation.y=ry;scene.add(m);return m}
/* ---------- lights ---------- */
const hemi=new THREE.HemisphereLight(0xfff4e6,0x2a2f45,1.1);scene.add(hemi);
const sun=new THREE.DirectionalLight(0xffe7cc,1.6);sun.position.set(12,22,10);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-16,right:16,top:16,bottom:-16});sun.shadow.bias=-.0005;scene.add(sun);
/* ---------- floor + cut-away walls ---------- */
B(24.6,.5,16.6,0x2a2f3d,0,-.3,0);B(24,.1,16,0xc9a57c,0,0,0);
for(let i=-11;i<12;i+=2)B(.02,.005,16,0xb89068,i,.055,0);
const zone=(w,d,c,x,z)=>B(w,.03,d,c,x,.07,z);
zone(6.5,4.6,0x3d6e75,-7,5);zone(8.2,7.2,0xe9d9c4,3.5,-1.8);zone(5.2,3.8,0x6d8f6a,-8,-5);
const wallC=0xf1e9de,trim=0x8a6a4c;
B(24,2.6,.3,wallC,0,1.3,-8.15);B(.3,2.6,16.6,wallC,-12.15,1.3,0);B(24,.12,.34,trim,0,2.66,-8.15);B(.34,.12,16.6,trim,-12.15,2.66,0);
// windows on back wall
const winMats=[];for(const x of[-9.5,-6,6.8,9.6]){B(2.4,1.3,.08,0x5a4632,x,1.6,-7.98);const g=new THREE.MeshBasicMaterial({color:0x9fd3f7});winMats.push(g);B(2.2,1.1,.06,g,x,1.6,-7.94)}
sign(["Welcome to GACD Technology:","building Ontario's IoT, cloud, network,","AI and security future."],'#ff6b57','#ffffff',6.2,1.15,-1.2,1.95,-7.99,0,24);
sign(['LOGO','HERE'],'#f8f4ee','#6b648f',2.2,1.4,-11.99,1.5,1.5,PI/2,40,1);
/* ---------- furniture ---------- */
const plant=(x,z,s=1)=>{B(.45*s,.5*s,.45*s,0xc4643a,x,.3*s,z);const l=new THREE.Mesh(new THREE.IcosahedronGeometry(.45*s,0),M(0x3f9b4f));l.position.set(x,.85*s,z);l.castShadow=true;scene.add(l);const l2=l.clone();l2.position.set(x+.15,1.2*s,z-.1);l2.scale.setScalar(.7);scene.add(l2)};
// lounge: rug, sofa, coffee table, plants
Cy(2.1,.04,0xe58a6f,-7,.1,4.8,24);B(4,.5,1,0xff7a66,-7,.4,6.6);B(4,.7,.35,0xff7a66,-7,.75,7.05);B(.4,.7,1,0xe5634f,-9.1,.55,6.6);B(.4,.7,1,0xe5634f,-4.9,.55,6.6);
Cy(.6,.4,0x8a6a4c,-7,.25,4.6);plant(-11.2,7.2,1.2);plant(-3.9,7.2);plant(-11.3,-7.3,1.1);plant(11.3,7.3,1.1);
// ping-pong
B(2.8,.1,1.6,0x2f8f6a,-8,.78,-5);B(.04,.18,1.6,0xffffff,-8,.9,-5);for(const dx of[-1.2,1.2])for(const dz of[-.6,.6])B(.08,.75,.08,0x333333,-8+dx,.4,-5+dz);
B(.5,1.6,.5,0x3554a5,-10.9,.8,-7.4);B(.5,1.6,.5,0xd44a3a,-10.3,.8,-7.4); // lockers
// glass meeting pod
const glass=new THREE.MeshPhysicalMaterial({color:0x9fd8ff,transparent:true,opacity:.22,roughness:.1});
const podX=-2.5,podZ=-5;B(4,1.9,.06,glass,podX,.95,-6.6);B(.06,1.9,3.2,glass,podX-2,.95,podZ);B(.06,1.9,3.2,glass,podX+2,.95,podZ);B(1.3,1.9,.06,glass,podX-1.35,.95,-3.4);B(1.3,1.9,.06,glass,podX+1.35,.95,-3.4);
B(4.06,.08,.08,0x39404f,podX,1.92,-6.6);B(4.06,.08,.08,0x39404f,podX,1.92,-3.4);Cy(.7,.06,0xdba96f,podX,.72,podZ-.2);Cy(.08,.7,0x555555,podX,.36,podZ-.2);
// desks
const screens={};
function desk(t){const[x,z]=t.desk,g=new THREE.Group();g.position.set(x,0,z);scene.add(g);
 B(2.2,.08,1.05,0xdba96f,0,.74,0,g);for(const dx of[-1,1])B(.06,.72,1,0xa07a52,dx,.37,0,g);
 B(1,.6,.06,0x22252e,0,1.15,.33,g);const sc=new THREE.MeshBasicMaterial({color:0x58c4ff});screens[t.id]=sc;const p=B(.9,.5,.02,sc,0,1.15,.3,g);p.rotation.y=PI;
 B(.08,.2,.08,0x555555,0,.86,.36,g);B(.6,.03,.22,0xe5e5ee,0,.8,-.12,g);B(.2,.12,.2,0xffffff,.75,.84,.1,g);
 B(.6,.08,.6,0x3d4458,0,.45,-.9,g);B(.6,.6,.08,0x3d4458,0,.8,-1.2,g);Cy(.05,.4,0x222222,0,.22,-.9,8,g)}
TEAM.forEach(desk);
// task board on back wall (behind desks)
const board=sign(['TASK BOARD','tap to open'],'#fbfbfd','#2b4a9a',2.6,1.5,3.5,1.55,-7.98,0,30);board.userData.open='tasks';
// server rack + vending
B(.9,2,.9,0x23262f,10.9,1,-6.6);for(let i=0;i<6;i++)B(.7,.18,.02,0x111318,10.9,.4+i*.3,-6.14);const led=new THREE.MeshBasicMaterial({color:0x46e06a});const leds=[];for(let i=0;i<6;i++){const l=B(.06,.06,.02,led.clone(),11.15,.4+i*.3,-6.12);leds.push(l)}
B(.9,1.9,.8,0xd94f4f,10.9,.95,-4.6);B(.6,1.1,.02,0x9fd8ff,10.8,1.1,-4.19);
// kitchen counter + coffee
B(1,.9,4,0xf3efe8,10.9,.45,-1);B(1.05,.06,4.05,0x8a6a4c,10.9,.92,-1);B(.4,.5,.4,0x8a2f2f,10.9,1.2,-2);Cy(.08,.15,0xffffff,10.75,1.03,-1.6,8);B(.5,.6,.4,0xdddde6,10.9,1.25,.3);
// bookshelves
for(const x of[2.5,5]){B(2.2,1.6,.5,0x8a6a4c,x,.8,7.2);for(let s=0;s<3;s++){B(2.1,.04,.45,0x6b4a30,x,.3+s*.5,7.15);for(let k=0;k<7;k++)B(.18,.35,.3,[0xd94f4f,0x4f7fd9,0xe8b830,0x4fb87f,0x9374b8][(k+s)%5],x-.9+k*.27,.5+s*.5,7.1)}}
// round table
Cy(.8,.06,0xdba96f,8.8,.72,5.6);Cy(.08,.7,0x555555,8.8,.36,5.6);for(const a of[0,2.1,4.2]){Cy(.25,.4,0x5ec4b6,8.8+Math.cos(a)*1.15,.2,5.6+Math.sin(a)*1.15,12)}
// mailbox (opens request form)
const mail=new THREE.Group();mail.position.set(-1.5,0,7);scene.add(mail);B(.9,.8,.6,0x8a6a4c,0,.4,0,mail);B(.6,.4,.4,0x3b6fb6,0,1,0,mail);B(.06,.3,.06,0xe33333,.33,1.1,0,mail);mail.userData.open='contact';
/* ---------- chibi characters ---------- */
function person(t){const g=new THREE.Group(),body=new THREE.Group(),sh=M(t.shirt),sk=M(t.skin);g.add(body);
 B(.5,.5,.34,sh,0,.62,0,body);const head=new THREE.Group();head.position.y=1.2;body.add(head);
 const hm=new THREE.Mesh(new THREE.BoxGeometry(.7,.62,.62),sk);hm.castShadow=true;head.add(hm);
 B(.74,.22,.66,t.hair,0,.27,-.02,head);B(.74,.4,.14,t.hair,0,.05,-.27,head);if(t.long){B(.14,.5,.5,t.hair,-.36,-.05,-.05,head);B(.14,.5,.5,t.hair,.36,-.05,-.05,head)}
 for(const ex of[-.15,.15])B(.08,.1,.02,0x1a1a1a,ex,0,.32,head);B(.1,.04,.02,0xd06060,0,-.14,.32,head);
 if(t.id==='cto')for(const ex of[-.15,.15])B(.18,.14,.02,0x222222,ex,0,.33,head);
 const arms=[],legs=[];for(const s of[-1,1]){const a=new THREE.Group();a.position.set(.31*s,.82,0);B(.13,.4,.13,sh,0,-.18,0,a);B(.13,.1,.13,sk,0,-.42,0,a);body.add(a);arms.push(a);
  const l=new THREE.Group();l.position.set(.12*s,.38,0);B(.17,.38,.19,0x2a2e3a,0,-.18,0,l);body.add(l);legs.push(l)}
 scene.add(g);return{g,body,arms,legs,head}}
/* ---------- path graph ---------- */
const N={},E={};const node=(k,x,z)=>{N[k]=V(x,z);E[k]=E[k]||[]};const edge=(a,b)=>{E[a].push(b);E[b].push(a)};
const row=(p,z,xs)=>{xs.forEach(x=>node(p+x,x,z));for(let i=1;i<xs.length;i++)edge(p+xs[i-1],p+xs[i])};
row('A',-2.1,[-10,-8,-5.2,-2.5,1.5,5.5,8.5]);row('F',3,[-10,-7,-5.2,-1.5,1.5,5.5,8.5]);row('K',-6.6,[1.5,3.5,5.5,8.5]);
edge('A-10','F-10');edge('A-5.2','F-5.2');edge('A8.5','F8.5');edge('A8.5','K8.5');
function gpath(a,b){const d={[a]:0},prev={},q=[a];while(q.length){q.sort((x,y)=>d[x]-d[y]);const u=q.shift();if(u===b)break;for(const v of E[u]){const nd=d[u]+N[u].distanceTo(N[v]);if(d[v]===undefined||nd<d[v]){d[v]=nd;prev[v]=u;q.push(v)}}}const p=[];let u=b;while(u!==undefined){p.unshift(u);u=prev[u]}return p}
const SPOTS={
 coffee:{pos:V(9.8,-1.4),entry:'A8.5',face:PI/2,say:'Grabbing a coffee ☕',act:'At the coffee bar'},
 vending:{pos:V(9.9,-4.6),entry:'K8.5',face:PI/2,say:'Snack from the vending machine 🥤',act:'Snack break'},
 server:{pos:V(9.9,-6.6),entry:'K8.5',face:PI/2,say:'Checking the servers 🖥️',act:'Checking the servers'},
 board:{pos:V(3.5,-7.3),entry:'K3.5',face:PI,say:'Updating the task board 📋',act:'Updating the task board'},
 shelf:{pos:V(3.8,6.1),entry:'F1.5',via:[V(3.8,4.2)],face:0,say:'Looking up a reference 📚',act:'At the bookshelf'},
 table:{pos:V(8.8,4.3),entry:'F8.5',face:0,say:'Reading at the round table 📖',act:'At the round table'},
 mail:{pos:V(-1.5,6.1),entry:'F-1.5',face:0,say:'Checking the mail ✉️',act:'Checking the mail'},
 sofa:{pos:V(-7,5.6),entry:'F-7',face:0,say:'Quick break on the sofa 🛋️',act:'Short break'},
 plant:{pos:V(-10.6,6.4),entry:'F-10',face:-PI/4,say:'Watering the plants 🪴',act:'Watering plants'},
 window:{pos:V(-9.6,-6.9),entry:'A-10',via:[V(-10.4,-3.6)],face:PI,say:'Nice view of Ontario 🌆',act:'At the window'},
 meetL:{pos:V(-3.3,-5.1),entry:'A-2.5',via:[V(-2.5,-2.9),V(-2.5,-4)],face:PI/2,say:'Quick sync 🤝',pair:'meetR',act:'In a meeting'},
 meetR:{pos:V(-1.7,-5.1),entry:'A-2.5',via:[V(-2.5,-2.9),V(-2.5,-4)],face:-PI/2,say:'Quick sync 🤝',pair:'meetL',act:'In a meeting'},
 pingL:{pos:V(-9.8,-5),entry:'A-10',via:[V(-10,-3.6)],face:PI/2,say:'Ping-pong break 🏓',pair:'pingR',act:'Ping-pong break'},
 pingR:{pos:V(-6.2,-5),entry:'A-5.2',via:[V(-5.6,-3.6)],face:-PI/2,say:'Ping-pong break 🏓',pair:'pingL',act:'Ping-pong break'}};
const VISIT={cto:'Got a minute for a tech question? 💻',cfo:'Quick budget check? 💰',mkt:'Can you share this post? 📣',adm:'Can I book you for a meeting? 📅'};
const CHATS=[['Got a sec? 👋',"Sure, what's up?"],["How's the project going?",'On track! 🚀'],['Coffee after this? ☕','Definitely!']];
const AG=TEAM.map((t,i)=>{const p=person(t),[dx,dz]=t.desk,front=dz>0,seat=V(dx,dz-.9),entry=(front?'A':'K')+dx;
 return{...t,...p,i,seat,home:{pos:seat,entry,face:0},st:'sit',sitT:4+i*1.5,path:[],msg:t.lines[0],mt:0,li:0,yaw:0,ph:0,side:0,spot:null,stay:0,act:'At desk'}});
for(const a of AG){const front=a.desk[1]>0,p=V(a.desk[0]+(a.desk[0]<3?1.4:-1.4),a.seat.z+(front?-.6:-.6));SPOTS['v_'+a.id]={pos:p,entry:a.home.entry,face:Math.atan2(a.seat.x-p.x,a.seat.z-p.z),say:VISIT[a.id],visit:a.id,act:'Visiting '+a.name}}
function seat(a){a.st='sit';a.sitT=0;a.g.position.copy(a.seat);a.yaw=0;a.g.rotation.y=0;a.body.position.set(0,.06,0);a.side=0;for(const l of a.legs)l.rotation.x=-PI/2;a.spot=null;a.claim=null;a.act='At desk'}
AG.forEach(seat);
let logL=[];
function say(a,m){a.msg=m;a.mt=0}
function buildPath(a,s){const pts=[],cur=a.spot?SPOTS[a.spot]:a.home;[...(cur.via||[])].reverse().forEach(v=>pts.push(v.clone()));for(const k of gpath(cur.entry,s.entry))pts.push(N[k].clone());(s.via||[]).forEach(v=>pts.push(v.clone()));pts.push(s.pos.clone());return pts}
function goTo(a,key){const s=key==='home'?a.home:SPOTS[key];a.path=buildPath(a,s);a.target=key;a.st='walk';a.body.position.set(0,0,0);for(const l of a.legs)l.rotation.x=0;a.spot=null;a.claim=key;a.act=key==='home'?'Heading back to desk':'Walking: '+(SPOTS[key].act||'').toLowerCase();if(key!=='home')say(a,'On my way… 🚶')}
const away=()=>AG.filter(a=>a.st!=='sit').length;
function freeSpots(a){const taken=AG.filter(o=>o!==a).map(o=>o.claim);return Object.keys(SPOTS).filter(k=>!taken.includes(k)&&k!=='v_'+a.id&&!SPOTS[k].pair&&!(SPOTS[k].visit&&AG.find(o=>o.id===SPOTS[k].visit).st!=='sit'))}
let pair=null,dispT=.5,clk=0;
function dispatch(){const sit=AG.filter(a=>a.st==='sit'&&a.sitT>5);if(!sit.length)return;const a=sit[Math.random()*sit.length|0],o=sit.find(x=>x!==a);
 if(o&&away()===0&&Math.random()<.4&&!pair){const k=Math.random()<.6?['meetL','meetR']:['pingL','pingR'];goTo(a,k[0]);goTo(o,k[1]);pair={a,b:o,t:-1,i:0,k:k[0]};return}
 const f=freeSpots(a);goTo(a,f[Math.random()*f.length|0])}
const angD=(a,b)=>{let d=b-a;while(d>PI)d-=2*PI;while(d<-PI)d+=2*PI;return d};
function walk(a,dt){const p=a.g.position,tgt=a.path[0],d=tgt.clone().sub(p);d.y=0;const L=d.length(),dir=L>1e-4?d.clone().divideScalar(L):V(Math.sin(a.yaw),Math.cos(a.yaw));
 let blocked=false;for(const o of AG){if(o===a||o.st==='sit')continue;const r=o.g.position.clone().sub(p);r.y=0;const dist=r.length();if(dist<.9&&r.dot(dir)>.2*dist&&(o.st!=='walk'||o.i<a.i))blocked=!(o.waiting&&o.i>a.i&&o.st==='walk')}
 a.waiting=blocked;a.side+=((blocked?.55:0)-a.side)*Math.min(1,dt*3);
 a.yaw+=angD(a.yaw,Math.atan2(dir.x,dir.z))*Math.min(1,dt*8);a.g.rotation.y=a.yaw;a.body.position.x=-a.side;
 if(!blocked){const st=1.8*dt;a.ph+=dt*11;if(L<=st){p.copy(tgt);a.path.shift()}else p.addScaledVector(dir,st)}else a.ph+=dt*2;
 const sw=Math.sin(a.ph)*(blocked?.15:.7);a.legs[0].rotation.x=sw;a.legs[1].rotation.x=-sw;a.arms[0].rotation.x=-sw*.8;a.arms[1].rotation.x=sw*.8;a.body.position.y=Math.abs(Math.sin(a.ph))*.06;a.head.rotation.z=Math.sin(a.ph)*.04;
 if(!a.path.length)arrive(a)}
function arrive(a){a.body.position.set(0,0,0);a.side=0;a.waiting=false;a.head.rotation.z=0;for(const l of a.legs)l.rotation.x=0;a.arms.forEach(x=>x.rotation.x=0);
 if(a.target==='home'){seat(a);say(a,a.lines[a.li=(a.li+1)%a.lines.length]);return}
 const s=SPOTS[a.target];a.spot=a.target;a.st='stand';a.stay=s.pair?40:3.5+Math.random()*3;a.faceTo=s.face;a.act=s.act;say(a,s.say);
 if(s.visit){const o=AG.find(x=>x.id===s.visit);if(o.st==='sit')setTimeout(()=>say(o,'Sure, happy to help! 👍'),1200)}}
function tickPair(dt){if(!pair)return;const{a,b}=pair;if(pair.t<0){if(a.st==='stand'&&b.st==='stand'){pair.t=0;pair.c=pair.k==='pingL'?['Ready? 🏓','Serve it!']:CHATS[Math.random()*CHATS.length|0];if(pair.k==='meetL')addLog(`<b>${a.name}</b> and <b>${b.name}</b> met in the meeting pod`)}return}
 pair.t+=dt;const L=[[0,a,pair.c[0]],[2.2,b,pair.c[1]],[4.6,a,a.lines[0]],[7,b,b.lines[0]]];while(pair.i<L.length&&pair.t>=L[pair.i][0]){say(L[pair.i][1],L[pair.i][2]);pair.i++}
 if(pair.k==='pingL'){for(const x of[a,b])x.arms[1].rotation.x=-1+Math.sin(pair.t*6+x.i)*.6}
 if(pair.t>9.5){a.stay=.2;b.stay=.6;pair=null}}
function tick(dt){clk+=dt;leds.forEach((l,i)=>l.material.color.setHex(RM||((clk*3+i*1.7)|0)%3?0x46e06a:0x1f5a30));
 if(RM){for(const a of AG){a.arms[0].rotation.x=a.arms[1].rotation.x=-1.1}return}
 dispT-=dt;if(away()===0)dispT=Math.min(dispT,.4);if(dispT<=0){if(away()<2)dispatch();dispT=2+Math.random()*3}
 tickPair(dt);
 for(const a of AG){a.mt+=dt;
  if(a.st==='sit'){a.sitT+=dt;const tp=Math.sin(clk*14+a.desk[0])*.12;a.arms[0].rotation.x=-1.1+tp;a.arms[1].rotation.x=-1.1-tp;a.head.rotation.y=Math.sin(clk*.7+a.desk[1])*.15;if(a.mt>6){a.li=(a.li+1)%a.lines.length;say(a,a.lines[a.li])}}
  else if(a.st==='walk')walk(a,dt);
  else if(a.st==='stand'){a.yaw+=angD(a.yaw,a.faceTo)*Math.min(1,dt*6);a.g.rotation.y=a.yaw;if(!pair||(pair.a!==a&&pair.b!==a))a.arms[0].rotation.x=Math.sin(clk*2+a.i)*.15;a.stay-=dt;
   if(a.stay<=0){if(Math.random()<.3&&!SPOTS[a.spot].pair){const f=freeSpots(a);goTo(a,f[Math.random()*f.length|0])}else goTo(a,'home')}}
  screens[a.id].color.setHex(a.st==='sit'?((clk*8|0)%9===0?0x3a9ad0:0x58c4ff):0x1d2a3a)}}
window.__AG=AG;
/* ---------- day / night ---------- */
function light(){const h=hour(),d=h>=7&&h<=17?1:h>=5&&h<7?(h-5)/2:h>17&&h<=20.5?1-(h-17)/3.5:0;
 hemi.intensity=.7+.5*d;sun.intensity=.6+1*d;sun.color.set(d>.5?0xffe7cc:0xffb070);const sky=new THREE.Color().lerpColors(new THREE.Color(0x1b2152),new THREE.Color(0x9fd3f7),d);winMats.forEach(m=>m.color.copy(sky))}
/* ---------- tags ---------- */
const tags={};for(const a of AG){const e=document.createElement('div');e.className='tag';e.innerHTML=`<span class="bb"></span><span class="pill">${a.icon} ${a.name.replace(/^(CTO|CFO|Marketing|Admin) /,'')} <em>${a.short}</em></span>`;$('#tags').appendChild(e);tags[a.id]=e}
const v=new THREE.Vector3();
function placeTags(){const W=box.clientWidth,H=box.clientHeight,pl=[];
 for(const a of AG){v.copy(a.g.position);v.y+=(a.st==='sit'?1.95:2.05);v.project(cam);const e=tags[a.id],bb=e.querySelector('.bb');bb.textContent=a.msg;bb.classList.toggle('off',a.mt>4.5&&!RM);pl.push({e,x:(v.x+1)/2*W,y:(1-v.y)/2*H,w:e.offsetWidth,h:e.offsetHeight})}
 pl.sort((p,q)=>q.y-p.y);for(let i=0;i<pl.length;i++)for(let j=0;j<i;j++){const p=pl[i],q=pl[j];if(Math.abs(p.x-q.x)<(p.w+q.w)/2+4&&p.y>q.y-q.h-4&&p.y-p.h<q.y+4)p.y=q.y-q.h-4}
 for(const p of pl){p.e.style.left=Math.round(Math.max(p.w/2,Math.min(W-p.w/2,p.x)))+'px';p.e.style.top=Math.round(Math.max(p.h,p.y))+'px'}}
/* ---------- tasks, log, cards ---------- */
const TKEY='gacd_tasks',LKEY='gacd_log',S=['todo','doing','done'],CLS={'CTO Alex':'cto','CFO Alex':'cfo','Marketing Connie':'mkt','Admin Agnes':'adm'};
let T=JSON.parse(localStorage.getItem(TKEY)||'null')||[{id:1,t:'Review open pull requests',a:'CTO Alex',s:'doing'},{id:2,t:'Draft monthly budget',a:'CFO Alex',s:'todo'}];
const save=()=>localStorage.setItem(TKEY,JSON.stringify(T)),esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const tnow=()=>new Intl.DateTimeFormat('en-CA',{timeZone:TZ,hour:'numeric',minute:'2-digit'}).format(new Date());
logL=JSON.parse(localStorage.getItem(LKEY)||'null')||[];
if(!logL.length){logL=TEAM.map(t=>({h:`<b>${t.name}</b> is working: ${esc(statusOf(t))}`,at:tnow()}))}
function addLog(h){logL.unshift({h,at:tnow()});logL=logL.slice(0,25);localStorage.setItem(LKEY,JSON.stringify(logL));renderLog()}
function renderLog(){$('#log').innerHTML=logL.map(l=>`<li><time>${l.at}</time>${l.h}</li>`).join('')}
function renderTasks(){$$('.col').forEach(c=>{const l=c.querySelector('.list');l.innerHTML='';T.filter(x=>x.s===c.dataset.s).forEach(x=>{const i=S.indexOf(x.s),d=document.createElement('div');d.className='task';
 d.innerHTML=`<div>${esc(x.t)}</div><span class="who ${CLS[x.a]||'cto'}">${esc(x.a)}</span><div>${i>0?'<button data-m="-1">◀</button>':''}${i<2?'<button data-m="1">▶</button>':''}<button data-del>✕</button></div>`;
 d.onclick=e=>{const b=e.target;if(b.dataset.m){x.s=S[i+ +b.dataset.m];if(x.s==='done')addLog(`<b>${esc(x.a)}</b> finished: ${esc(x.t)}`)}else if('del' in b.dataset)T=T.filter(y=>y!==x);else return;save();renderTasks();cards()};l.appendChild(d)})})}
function assign(t,who){T.push({id:Date.now(),t,a:who,s:'todo'});save();renderTasks();addLog(`Assigned to <b>${esc(who)}</b>: ${esc(t)}`);const a=AG.find(x=>x.name===who);say(a,'Got it: '+t.slice(0,40)+' 👍');cards()}
$('#cmd').onsubmit=e=>{e.preventDefault();const t=$('#cmdt').value.trim();if(!t)return;assign(t,$('#cmda').value);$('#cmdt').value=''};
$('#tf').onsubmit=e=>{e.preventDefault();assign($('#tt').value.trim(),$('#ta').value);$('#tt').value=''};
$('#cf').onsubmit=e=>{e.preventDefault();const f=e.target,r=JSON.parse(localStorage.getItem('gacd_requests')||'[]');r.push({...Object.fromEntries(new FormData(f)),at:new Date().toISOString()});localStorage.setItem('gacd_requests',JSON.stringify(r));addLog(`New request saved for <b>${esc(f.to.value)}</b>`);f.reset();$('#cm').textContent='Saved locally ('+r.length+' total). Thanks!'};
function cards(){const h=hour();
 $('#cards').innerHTML=AG.map(a=>{const mine=T.filter(x=>x.a===a.name&&x.s!=='done'),done=a.id==='cfo'&&cfoDone();
  const cur=statusOf(a)+(a.note&&!done?' · '+a.note:'')+(mine.length?'\nNext: '+mine[mine.length-1].t:'');
  const pct=done?100:Math.round(25+((h*60+a.i*37)%70));
  const files=a.files().map(([f,tg])=>`<span class="file${tg?' tag2':''}">${tg?'🏷️':'📄'} ${esc(f)}</span>`).join('');
  return `<div class="card" data-id="${a.id}"><div class="ch"><div class="av" style="background:${a.color}33">${a.icon}</div><div><h4>${a.name}</h4><span class="state">${done?'Done, emailed':(a.st==='sit'?'Working':esc(a.act))}</span></div></div>
  <p class="role">${a.role}</p><div class="cur">${esc(cur)}</div><div class="bar"><i style="width:${pct}%;background:${a.color}"></i></div><div class="files">${files}</div><div class="ex">Example output</div></div>`}).join('');
 $$('.card').forEach(c=>c.onclick=()=>{const a=AG.find(x=>x.id===c.dataset.id);say(a,statusOf(a));box.scrollIntoView({behavior:RM?'auto':'smooth',block:'center'})});
 $('#nW').textContent=AG.length;$('#nO').textContent=AG.reduce((n,a)=>n+a.files().filter(f=>!f[1]).length,0)+T.filter(x=>x.s==='done').length;$('#nT').textContent=T.filter(x=>x.s==='todo').length}
/* ---------- picking + panels ---------- */
const ray=new THREE.Raycaster(),mp=new THREE.Vector2();let down=null;
renderer.domElement.addEventListener('pointerdown',e=>down=[e.clientX,e.clientY]);
renderer.domElement.addEventListener('pointerup',e=>{if(!down||Math.hypot(e.clientX-down[0],e.clientY-down[1])>6)return;const r=renderer.domElement.getBoundingClientRect();mp.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(mp,cam);
 for(const h of ray.intersectObjects(scene.children,true)){let o=h.object;while(o&&!o.userData.open&&!AG.some(a=>a.g===o))o=o.parent;if(!o)continue;if(o.userData.open)openP(o.userData.open);else{const a=AG.find(a=>a.g===o);say(a,statusOf(a))}break}});
function openP(id){$('#'+id).hidden=false}
$$('[data-open]').forEach(b=>b.onclick=()=>openP(b.dataset.open));
$$('[data-close]').forEach(b=>b.onclick=()=>b.closest('.overlay').hidden=true);$$('.overlay').forEach(o=>o.onclick=e=>{if(e.target===o)o.hidden=true});
document.onkeydown=e=>{if(e.key==='Escape')$$('.overlay').forEach(o=>o.hidden=true)};
renderTasks();renderLog();cards();$('#y').textContent=new Date().getFullYear();setInterval(cards,3000);
/* ---------- loop ---------- */
function size(){const w=box.clientWidth,h=box.clientHeight,asp=w/h,view=asp<1?13:8.2;cam.left=-view*Math.max(asp,.75);cam.right=view*Math.max(asp,.75);cam.top=view*Math.max(1,.75/asp);cam.bottom=-cam.top;
 if(asp<1){const s=Math.max(asp,.55)*1.2;cam.left=-13;cam.right=13;cam.top=13/asp;cam.bottom=-13/asp;cam.zoom=1.25}else cam.zoom=1;cam.updateProjectionMatrix();renderer.setSize(w,h,false)}
addEventListener('resize',size);size();light();setInterval(light,60000);
const ff=parseFloat(Q.get('ff'))||0;for(let i=0;i<ff*20;i++)tick(.05);
let last=performance.now();
function loop(n){const dt=Math.min(.1,(n-last)/1000);last=n;tick(dt);ctr.update();renderer.render(scene,cam);placeTags();requestAnimationFrame(loop)}
requestAnimationFrame(loop);
{const o=Q.get('open');if(o==='tasks'||o==='contact')openP(o)}
